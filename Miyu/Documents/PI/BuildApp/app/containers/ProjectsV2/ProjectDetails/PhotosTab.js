import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	FlatList,
	StyleSheet,
	View,
} from 'react-native';
import {
	Image,
	IconButton,
	Text,
	TouchableOpacity,
	withScreen,
} from 'BuildLibrary';
import styles from '../../../lib/styles';
import helpers from '../../../lib/helpers';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TrackingActions from '../../../lib/analytics/TrackingActions';
import Icon from 'react-native-vector-icons/Ionicons';
import {
	createEvent,
	getPhotos,
} from '../../../actions/ProjectEventActions';
import { withNavigation } from '@expo/ex-navigation';
import { trackAction } from '../../../actions/AnalyticsActions';
import { getProject } from '../../../reducers/helpers/projectsReducerHelper';

const componentStyles = StyleSheet.create({
	tab: {
		width: styles.dimensions.width,
	},
	headerButton: {
		marginBottom: styles.measurements.gridSpace1,
	},
	list: {
		paddingVertical: styles.measurements.gridSpace1,
	},
	emptyContentRow: {
		flexDirection: 'row',
		flexGrow: 1,
		backgroundColor: styles.colors.primaryLight,
		alignItems: 'center',
	},
	emptyContentColumn: {
		flexGrow: 1,
		alignItems: 'center',
	},
	photoWrapper: {
		backgroundColor: styles.colors.white,
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingBottom: styles.measurements.gridSpace1,
	},
	horizontalRule: {
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.primary,
		width: 60,
		marginVertical: styles.measurements.gridSpace1,
	},
	dialogButtonsWrapper: {
		flexDirection: 'row',
		marginHorizontal: styles.measurements.gridSpace1,
	},
	dialogButtons: {
		flex: 1,
		marginTop: styles.measurements.gridSpace2,
	},
	button: {
		marginTop: styles.measurements.gridSpace1,
	},
	iconStyle: {
		transform: [{rotateZ: '-90deg'}],
	},
	cameraIcon: {
		height: 28,
		lineHeight: 34,
		marginBottom: styles.measurements.gridSpace1,
	},
	bodyText: {
		marginHorizontal: styles.measurements.gridSpace2,
	},
});

const PHOTO_SIZE = styles.dimensions.width - styles.measurements.gridSpace1 * 2;

export class PhotosTab extends Component {
	state = {
		initialLoading: true,
	};

	componentWillReceiveProps({ loading }) {
		if (this.state.initialLoading && loading && loading !== this.props.loading) {
			this.setState({ initialLoading: false });
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:projects:details:photos',
		};
	}

	getScreenData = () => {
		this.props.actions.getPhotos({ projectId: this.props.projectId });
	};

	photoKeyExtractor(photo) {
		return photo.id;
	}

	onPressAddPhotos = () => {
		this.props.navigation
			.getNavigator('root')
			.push('selectPhotoModal', {
				onDone: this.uploadPhotos,
			});
	};

	uploadPhotos = (selectedPhotos) => {
		const { actions, projectId, project, user } = this.props;

		actions.createEvent({
			eventType: 'POST',
			message: '',
			photos: selectedPhotos,
			projectId,
		})
			.then(this.getScreenData)
			.catch(helpers.noop)
			.done();
		actions.trackAction('Post', {
			user_id: user.customerId,
			project_id: projectId,
			photo: selectedPhotos.length > 0,
			text: false,
			photo_count: selectedPhotos.length,
			'@expert': false,
			project_status: project.archived ? 'archived' : 'active',
		});
	};

	// currently this function really only supports primary or non-primary (white) buttons
	renderAddPhotosButton = (colorScheme = 'primary') => {
		const isPrimary = colorScheme === 'primary';
		const borders = false;
		const textColor = isPrimary ? 'white' : 'secondary';
		const color = isPrimary ? 'primary' : 'white';
		return (
			<IconButton
				accessibilityLabel="Add Project Photos"
				borders={borders}
				color={color}
				iconName="md-log-in"
				iconSize="small"
				iconStyle={componentStyles.iconStyle}
				onPress={this.onPressAddPhotos}
				style={componentStyles.button}
				text="Add Project Photos"
				textColor={textColor}
				trackAction={TrackingActions.PHOTOS_UPLOAD_PHOTO_TAP}
			/>
		);
	};

	renderEmptyState = () => {
		return (
			<View style={componentStyles.emptyContentRow}>
				<View style={componentStyles.emptyContentColumn}>
					<Icon
						color={styles.colors.primary}
						name={helpers.getIcon('camera')}
						size={45}
						style={componentStyles.cameraIcon}
					/>
					<Text weight="bold">
						Photo Gallery
					</Text>
					<Text
						family="archer"
						size="large"
					>
						Upload Progress Photos
					</Text>
					<View style={componentStyles.horizontalRule} />
					<Text
						style={componentStyles.bodyText}
						textAlign="center"
					>
						Keep everyone updated with the latest
						progress and inspiration photos
					</Text>
					<View style={componentStyles.dialogButtonsWrapper}>
						<View style={componentStyles.dialogButtons}>
							{this.renderAddPhotosButton('primary')}
						</View>
					</View>
				</View>
			</View>
		);
	};

	renderHeader = () => {
		return (
			<View style={componentStyles.headerButton}>
				{this.renderAddPhotosButton('white')}
			</View>
		);
	};

	renderPhoto = ({ item: photo, index }) => {
		const { photos = [] } = this.props;
		const images = photos.map(({ imageUrl: uri }) => ({ uri }));
		const additionalStyle = {
			paddingTop: !index ? styles.measurements.gridSpace1 : 0,
		};

		return (
			<View style={[componentStyles.photoWrapper, additionalStyle]}>
				<TouchableOpacity
					key={index}
					onPress={() => {
						this.props.navigation.getNavigator('root').push('largeImageGalleryScreen', {
							currentIndex: index,
							title: 'Gallery',
							images,
						});
					}}
					trackAction={TrackingActions.PHOTOS_PHOTO_TAP}
				>
					<Image
						height={PHOTO_SIZE}
						resizeMode="contain"
						source={{ uri: photo.imageUrl }}
						width={PHOTO_SIZE}
					/>
				</TouchableOpacity>
			</View>
		);
	};

	render() {
		const { loading, photos } = this.props;

		// prevent an initial flash of old/wrong content
		if (this.state.initialLoading) {
			return <View />;
		}
		// can't use flatlist's empty list option because the styling doesn't work out
		if (!photos.length) {
			return this.renderEmptyState();
		}
		return (
			<FlatList
				data={photos}
				extraData={loading}
				keyExtractor={this.photoKeyExtractor}
				ListHeaderComponent={this.renderHeader}
				renderItem={this.renderPhoto}
				style={[styles.elements.screenGreyLight, componentStyles.tab, componentStyles.list]}
			/>
		);
	}
}

PhotosTab.displayName = 'Photos Tab';

PhotosTab.propTypes = {
	actions: PropTypes.object.isRequired,
	error: PropTypes.string.isRequired,
	loading: PropTypes.bool.isRequired,
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
	photos: PropTypes.array,
	projectId: PropTypes.number.isRequired,
	project: PropTypes.object,
	user: PropTypes.object,
};

PhotosTab.defaultProps = {
	photos: [],
};

export const mapStateToProps = (state, ownProps) => {
	return {
		error: state.photosReducer.error,
		loading: state.photosReducer.loading,
		photos: state.photosReducer.photos,
		project: getProject(state.projectsReducer.projects, ownProps.projectId),
		user: state.userReducer.user,
	};
};

export const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			createEvent,
			getPhotos,
			trackAction,
		}, dispatch),
	};
};


export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(withScreen(PhotosTab)));
