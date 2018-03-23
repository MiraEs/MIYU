/**
 *
 * WARNING: This is probably not the photo modal you're looking for.
 * This modal is used for the old projects system and is closely tied
 * to it. Other uses should look at the SelectPhotoModal for more
 * general uses
 *
 *
 *
 *
 *
 *
 */




import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	TouchableHighlight,
	Alert,
} from 'react-native';
import {
	ListView,
	Image,
	Text,
	withScreen,
} from 'BuildLibrary';
import { LinkingManager } from 'BuildNative';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import Dimensions from 'Dimensions';
const { width } = Dimensions.get('window');
import {
	getDevicePhotos,
	toggleFetchingPhotos,
	togglePhotoSelected,
	resetSelectedPhotos,
} from '../actions/DevicePhotosActions';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	withNavigation,
	NavigationStyles,
} from '@expo/ex-navigation';
import NavigationBarTextButton from '../components/navigationBar/NavigationBarTextButton';
import EventEmitter from '../lib/eventEmitter';
import Permissions from '../lib/Permissions';
import Camera from 'react-native-camera';

const imageDimensions = ((width - 20) / 3) - (20 / 3);

const componentStyles = StyleSheet.create({
	takePhoto: {
		marginTop: styles.measurements.gridSpace1,
	},
	selectedCheckmarkBackground: {
		position: 'absolute',
		top: 7,
		right: 10,
	},
	selectedCheckmark: {
		position: 'absolute',
		top: 10,
		right: 10,
		backgroundColor: styles.colors.primary,
		width: 18,
		height: 18,
		borderRadius: 10,

	},
	selectedImage: {
		borderWidth: styles.dimensions.borderWidthLarge,
		borderColor: styles.colors.primary,
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		backgroundColor: 'transparent',
	},
	selectedPhotoCount: {
		padding: styles.measurements.gridSpace1,
		alignItems: 'center',
		borderTopWidth: styles.dimensions.borderWidth,
		borderTopColor: styles.colors.mediumGray,
	},
	contentContainerStyle: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		flexWrap: 'wrap',
		paddingTop: styles.measurements.gridSpace1,
	},
});

const ON_CANCEL_PRESS = 'ON_CANCEL_PRESS';
const ON_SELECT_BUTTON_PRESS = 'ON_SELECT_BUTTON_PRESS';

export class AddPhotoModal extends Component {

	componentDidMount() {
		const { isFirstPage, actions } = this.props;
		if (helpers.isAndroid()) {
			Permissions.requestExternalReadStorage().then(() => {
				actions.getDevicePhotos({
					isFirstPage,
				});
			});
		} else {
			actions.getDevicePhotos({
				isFirstPage,
			});
		}

		EventEmitter.addListener(ON_CANCEL_PRESS, this.onCancelPress);
		EventEmitter.addListener(ON_SELECT_BUTTON_PRESS, this.onSelectButtonPress);
	}

	componentWillUnmount() {
		EventEmitter.removeAllListeners(ON_CANCEL_PRESS);
		EventEmitter.removeAllListeners(ON_SELECT_BUTTON_PRESS);
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:addphotomodal',
		};
	}

	getScreenData = () => {
		const { isFirstPage, actions } = this.props;
		actions.getDevicePhotos({
			isFirstPage,
		});
	};

	getData = () => {
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => {
				return r1 !== r2 && r1.isSelected !== r2.isSelected;
			},
		});

		return ds.cloneWithRows(this.props.images);
	};

	onEndReached = () => {
		const { actions, cursor, isFetchingNextPage, hasNextPage } = this.props;
		if (!isFetchingNextPage && hasNextPage) {
			actions.toggleFetchingPhotos();
			actions.getDevicePhotos({
				filters: {
					cursor,
				},
			});
		}
	};

	onCancelPress = () => {
		const {
			actions,
			shouldClearSelectedPhotos,
			initialSelectedPhotos,
		} = this.props;
		actions.resetSelectedPhotos(shouldClearSelectedPhotos ? [] : initialSelectedPhotos);
		this.hideModal();
	};

	hideModal = () => {
		this.props.navigation.getNavigator('root').pop();
	};

	toggleImageSelection = (image) => {
		this.props.actions.togglePhotoSelected(image);
	};

	launchCamera = () => {
		if (helpers.isIOS()) {
			Camera.checkVideoAuthorizationStatus().then((isAuthorized) => {
				if (isAuthorized) {
					this.openCameraScreen();
				} else {
					Alert.alert('Camera Access Disabled', 'Build.com does not have access to your camera. To enable access open the Settings app, tap the Build app, and toggle the Camera switch.');
				}
			});
		} else {
			Permissions.requestCamera().then((cameraPermStatus) => {
				if (Permissions.isGranted(cameraPermStatus)) {
					return Permissions.requestExternalWriteStorage()
						.then((storagePermStatus) => {
							return { cameraPermStatus, storagePermStatus };
						});
				} else {
					return { cameraPermStatus };
				}
			}).then(({ cameraPermStatus, storagePermStatus }) => {
				if (Permissions.isGranted(cameraPermStatus) && Permissions.isGranted(storagePermStatus)) {
					this.openCameraScreen();
				} else if (Permissions.isGranted(cameraPermStatus) && !Permissions.isGranted(storagePermStatus)) {
					Alert.alert(
						'Storage Access Denied',
						'Build.com does not have access to your media and storage. Please allow access to save photos.',
						[
							{
								text: 'Settings',
								onPress: LinkingManager.openBuildAppSettings,
							},
							{
								text: 'Ok',
							},
						]
					);
				}
			}).catch(helpers.noop).done();
		}
	};

	openCameraScreen = () => {
		this.props.navigation.getNavigator('root').push('camera', {
			returnTo: this.props.returnTo,
			project: this.props.project,
			eventStoreType: this.props.eventStoreType,
		});
	};

	onSelectButtonPress = () => {
		if (this.props.launchedFrom === 'post' || this.props.launchedFrom === 'comment') {
			this.hideModal();
		} else {
			this.hideModal();
			this.props.navigation.getNavigator('root').push('projectUpdate', {
				eventStoreType: this.props.eventStoreType,
				projectId: this.props.project ? this.props.project.id : undefined,
			});

		}
	};

	renderHeader = () => {
		return (
			<TouchableOpacity
				onPress={this.launchCamera}
				style={[styles.photoGrid.thumbnails, {
					width: (imageDimensions + 2),
				}]}
			>
				<Icon
					name={helpers.getIcon('camera')}
					size={65}
					style={styles.photoGrid.cameraIcon}
				/>
				<Text
					color="primary"
					style={componentStyles.takePhoto}
				>
					Take Photo
				</Text>
			</TouchableOpacity>
		);
	};

	renderSelectedImageElements = (photo) => {
		if (photo.isSelected) {
			return (
				<View
					style={[styles.photoGrid.thumbnails, componentStyles.selectedImage]}
				>
					<View
						style={componentStyles.selectedCheckmark}
					/>
					<Icon
						name={helpers.getIcon('checkmark-circle')}
						size={24}
						color="white"
						style={componentStyles.selectedCheckmarkBackground}
					/>
				</View>
			);
		}
	};

	renderSelectedPhotoCount = () => {
		const count = this.props.selectedPhotos.length;

		if (count) {
			return (
				<View style={componentStyles.selectedPhotoCount}>
					<Text>{count} Photos Selected</Text>
				</View>
			);
		}
	};

	renderPhoto = (photo) => {
		return (
			<View>
				<TouchableHighlight
					onPress={() => this.toggleImageSelection(photo.image.uri)}
					style={styles.photoGrid.thumbnailContainer}
					underlayColor="rgba(0, 0, 0, .2)"
				>
					<View>
						<Image
							resizeMode="cover"
							source={{uri: photo.image.uri}}
							style={styles.photoGrid.thumbnails}
						/>
						{this.renderSelectedImageElements(photo)}
					</View>
				</TouchableHighlight>
			</View>

		);
	};

	renderContent = () => {
		if (this.props.retrievePhotoError) { // this is not actually wired up
			return <Text>{this.props.retrievePhotoError}</Text>;
		} else {
			return (
				<ListView
					automaticallyAdjustContentInsets={false}
					contentContainerStyle={componentStyles.contentContainerStyle}
					dataSource={this.getData()}
					enableEmptySections={true}
					initialListSize={3}
					onEndReached={this.onEndReached}
					onEndReachedThreshold={2300}
					pageSize={3}
					renderHeader={this.renderHeader}
					renderRow={this.renderPhoto}
				/>
			);
		}
	};

	render() {
		return (
			<View style={[styles.elements.screen, {backgroundColor: styles.colors.lightGray}]}>
				{this.renderContent()}
				{this.renderSelectedPhotoCount()}
			</View>
		);
	}

}

AddPhotoModal.route = {
	styles: {
		...NavigationStyles.SlideVertical,
		gestures: null,
	},
	navigationBar: {
		visible: true,
		title: 'Add Photo',
		renderLeft() {
			return (
				<NavigationBarTextButton onPress={() => EventEmitter.emit(ON_CANCEL_PRESS)}>Cancel</NavigationBarTextButton>
			);
		},
		renderRight() {
			return (
				<NavigationBarTextButton onPress={() => EventEmitter.emit(ON_SELECT_BUTTON_PRESS)}>Select</NavigationBarTextButton>
			);
		},
	},
};

AddPhotoModal.propTypes = {
	actions: PropTypes.object.isRequired,
	cursor: PropTypes.string.isRequired,
	eventStoreType: PropTypes.string.isRequired,
	hasNextPage: PropTypes.bool.isRequired,
	images: PropTypes.array.isRequired,
	initialSelectedPhotos: PropTypes.array.isRequired,
	isFetchingNextPage: PropTypes.bool.isRequired,
	isFirstPage: PropTypes.bool.isRequired,
	launchedFrom: PropTypes.string.isRequired,
	project: PropTypes.shape({
		id: PropTypes.number,
	}),
	returnTo: PropTypes.string.isRequired,
	selectedPhotos: PropTypes.array.isRequired,
	shouldClearSelectedPhotos: PropTypes.bool.isRequired,
	retrievePhotoError: PropTypes.string,
	trackState: PropTypes.func,
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
};

AddPhotoModal.defaultProps = {
	shouldClearSelectedPhotos: true,
	retrievePhotoError: '',
	isFetchingNextPage: false,
	isFirstPage: true,
	initialSelectedPhotos: [],
	cursor: '',
};

const mapStateToProps = (state) => {
	return {
		...state.devicePhotosReducer,
		images: state.devicePhotosReducer.photos,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getDevicePhotos,
			toggleFetchingPhotos,
			togglePhotoSelected,
			resetSelectedPhotos,
		}, dispatch),
	};
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(withScreen(AddPhotoModal)));
