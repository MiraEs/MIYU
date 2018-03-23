import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	FlatList,
	InteractionManager,
	View,
	StyleSheet,
	TouchableOpacity,
	TouchableHighlight,
	Alert,
} from 'react-native';
import {
	Image,
	Text,
	withScreen,
} from 'BuildLibrary';
import { LinkingManager } from 'BuildNative';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
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
import Permissions from '../lib/Permissions';
import Camera from 'react-native-camera';

const imageDimensions = (styles.dimensions.width - (4 * styles.measurements.gridSpace1)) / 3;

const componentStyles = StyleSheet.create({
	flatlist: {
		margin: styles.measurements.gridSpace1,
	},
	cameraIconWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	cameraIcon: {
		height: 55,
		color: styles.colors.primary,
	},
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
		backgroundColor: styles.colors.accent,
		width: 18,
		height: 18,
		borderRadius: 10,
	},
	selectedImage: {
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
	thumbnailContainer: {
		height: imageDimensions,
		width: imageDimensions,
		marginBottom: styles.measurements.gridSpace1,
	},
	thumbnails: {
		height: imageDimensions,
		width: imageDimensions,
	},
	selectedThumbnailContainer: {
		borderWidth: styles.dimensions.borderWidthLarge,
		borderColor: styles.colors.accent,
	},
	selectedThumbnail: {
		height: imageDimensions - 2 * styles.dimensions.borderWidthLarge,
		width: imageDimensions - 2 * styles.dimensions.borderWidthLarge,
	},
});

export class SelectPhotoModal extends Component {

	componentWillMount() {
		const { selectedPhotos = [] } = this.props;
		helpers.setStatusBarStyle('default', false);
		InteractionManager.runAfterInteractions(() => {
			this.props.navigator.updateCurrentRouteParams({
				onCancel: () => this.onCancelPress(),
				onSelectButtonPress: () => this.onSelectButtonPress(),
				disableDone: !selectedPhotos.length,
			});
		});
	}

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
	}

	componentWillReceiveProps({ selectedPhotos = [] }) {
		const { selectedPhotos: oldPhotos = [] } = this.props;

		if (selectedPhotos.length !== oldPhotos.length) {
			this.props.navigator.updateCurrentRouteParams({
				disableDone: !selectedPhotos.length,
			});
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:selectphotomodal',
		};
	}

	getScreenData = () => {
		const { isFirstPage, actions } = this.props;
		actions.getDevicePhotos({
			isFirstPage,
		});
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

	togglePhotoSelection = (photo) => {
		this.props.actions.togglePhotoSelected(photo);
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
						[{
							text: 'Settings',
							onPress: LinkingManager.openBuildAppSettings,
						}, {
							text: 'Ok',
						}],
					);
				}
			}).catch(helpers.noop).done();
		}
	};

	onCancelPress = () => {
		const {
			actions,
			shouldClearSelectedPhotos,
			initialSelectedPhotos,
		} = this.props;
		actions.resetSelectedPhotos(shouldClearSelectedPhotos ? [] : initialSelectedPhotos);
		this.props.navigator.pop();
	};

	onImageCapture = (path) => {
		this.props.navigator.pop(2);
		this.props.onDone([path]);
	};

	onSelectButtonPress = () => {
		this.props.navigator.pop();
		this.props.onDone(this.props.selectedPhotos);
	};

	openCameraScreen = () => {
		this.props.navigator.push('deviceCameraModal', {
			onImageCapture: this.onImageCapture,
		});
	};

	photoKeyExtractor = (photo, index) => {
		return index;
	}

	renderHeader = () => {
		return (
			<TouchableOpacity
				onPress={this.launchCamera}
				style={[componentStyles.thumbnails, componentStyles.cameraIconWrapper]}
			>
				<Icon
					name={helpers.getIcon('camera')}
					size={65}
					style={componentStyles.cameraIcon}
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
				<View style={[componentStyles.thumbnails, componentStyles.selectedImage]}>
					<View style={componentStyles.selectedCheckmark}/>
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

	renderPhoto = ({ item: photo, index }) => {
		if (React.isValidElement(photo)) {
			return photo;
		}

		const additionalThumbnail = [];
		const additionalThumbnailContainer = [{
			marginHorizontal: (index % 3) === 1 ? 7 : 0,
		}];
		if (photo.isSelected) {
			additionalThumbnailContainer.push(componentStyles.selectedThumbnailContainer);
			additionalThumbnail.push(componentStyles.selectedThumbnail);
		}
		return (
			<View>
				<TouchableHighlight
					onPress={() => this.togglePhotoSelection(photo.image.uri)}
					style={[componentStyles.thumbnailContainer, ...additionalThumbnailContainer]}
					underlayColor="rgba(0, 0, 0, .2)"
				>
					<View>
						<Image
							resizeMode="cover"
							source={{uri: photo.image.uri}}
							style={[componentStyles.thumbnails, ...additionalThumbnail]}
						/>
						{this.renderSelectedImageElements(photo)}
					</View>
				</TouchableHighlight>
			</View>

		);
	};

	renderContent = () => {
		if (this.props.error) {
			return <Text>{this.props.error}</Text>;
		} else {
			const photos = [this.renderHeader(), ...this.props.photos];
			return (
				<FlatList
					data={photos}
					initialNumToRender={50}
					keyExtractor={this.photoKeyExtractor}
					numColumns={3}
					onEndReached={this.onEndReached}
					onEndReachedThreshold={1}
					renderItem={this.renderPhoto}
					style={componentStyles.flatlist}
				/>
			);
		}
	};

	render() {
		return (
			<View style={styles.elements.screen}>
				{this.renderContent()}
				{this.renderSelectedPhotoCount()}
			</View>
		);
	}

}

SelectPhotoModal.route = {
	styles: {
		...NavigationStyles.SlideVertical,
		gestures: null,
	},
	navigationBar: {
		visible: true,
		title: 'Add Photo',
		renderLeft(route) {
			return (
				<NavigationBarTextButton
					onPress={() => route.params.onCancel()}
				>
					Cancel
				</NavigationBarTextButton>
			);
		},
		renderRight(route) {
			return (
				<NavigationBarTextButton
					onPress={() => route.params.onSelectButtonPress()}
					disabled={route.params.disableDone}
				>
					Select
				</NavigationBarTextButton>
			);
		},
	},
};

SelectPhotoModal.propTypes = {
	actions: PropTypes.object.isRequired,
	cursor: PropTypes.string.isRequired,
	error: PropTypes.string,
	hasNextPage: PropTypes.bool.isRequired,
	initialSelectedPhotos: PropTypes.array.isRequired,
	isFetchingNextPage: PropTypes.bool.isRequired,
	isFirstPage: PropTypes.bool.isRequired,
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
	navigator: PropTypes.shape({
		pop: PropTypes.func,
		push: PropTypes.func,
		updateCurrentRouteParams: PropTypes.func,
	}),
	onDone: PropTypes.func,
	photos: PropTypes.array.isRequired,
	selectedPhotos: PropTypes.array.isRequired,
	shouldClearSelectedPhotos: PropTypes.bool.isRequired,
};

SelectPhotoModal.defaultProps = {
	cursor: '',
	error: '',
	initialSelectedPhotos: [],
	isFetchingNextPage: false,
	isFirstPage: true,
	onDone: helpers.noop,
	shouldClearSelectedPhotos: true,
};

export const mapStateToProps = (state) => {
	return {
		cursor: state.devicePhotosReducer.cursor,
		error: state.devicePhotosReducer.error,
		hasNextPage: state.devicePhotosReducer.hasNextPage,
		isFetchingNextPage: state.devicePhotosReducer.isFetchingNextPage,
		photos: state.devicePhotosReducer.photos,
		selectedPhotos: state.devicePhotosReducer.selectedPhotos,
	};
};

export const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getDevicePhotos,
			resetSelectedPhotos,
			toggleFetchingPhotos,
			togglePhotoSelected,
		}, dispatch),
	};
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(withScreen(SelectPhotoModal)));
