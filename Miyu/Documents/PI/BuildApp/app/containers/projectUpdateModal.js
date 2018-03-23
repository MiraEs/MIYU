'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Alert,
	View,
	TextInput,
	StyleSheet,
	ActionSheetIOS,
	Text,
	Image,
	TouchableOpacity,
	Platform,
} from 'react-native';
import { ScrollView } from 'BuildLibrary';
import styles from '../lib/styles';
import { NavigationStyles } from '@expo/ex-navigation';
import { EXPERT } from '../constants/constants';
import Avatar from '../components/Avatar';
import TimerMixin from 'react-timer-mixin';
import {
	updateIsRefreshing,
	updateShowProjectEvents,
	updateIsFetchingProjectData,
	getEvents,
	saveProjectFavorite,
	getPhotos,
	createEvent,
	addOrderToProject,
} from '../actions/ProjectEventActions';
import {
	resetSingleEventData,
	getEvent,
	saveComment,
} from '../actions/SingleEventActions';
import {
	loadPhotosSuccess,
	loadPhotosFail,
	addPhoto,
	getDevicePhotos,
	resetSelectedPhotos,
	togglePhotoSelected,
	toggleFetchingPhotos,
} from '../actions/DevicePhotosActions';
import helpers from '../lib/helpers';
import EventEmitter from '../lib/eventEmitter';
import PinToKeyboard from '../components/PinToKeyboard';
import Icon from 'react-native-vector-icons/Ionicons';
import { getAvatarUrl, getFullName } from '../reducers/helpers/userReducerHelpers';
import { getProject } from '../reducers/helpers/projectsReducerHelper';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NavigationBarTextButton from '../components/navigationBar/NavigationBarTextButton';
import {
	trackState,
	trackAction,
} from '../actions/AnalyticsActions';

const PROJECT_UPDATE_MODAL_ON_POST_PRESS = 'PROJECT_UPDATE_MODAL_ON_POST_PRESS';
const PROJECT_UPDATE_MODAL_ON_CANCEL_PRESS = 'PROJECT_UPDATE_MODAL_ON_CANCEL_PRESS';

const componentStyles = StyleSheet.create({
	pinnedButtonsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: styles.measurements.gridSpace1,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'stretch',
		padding: styles.measurements.gridSpace1,
	},
	borderBottom: {
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.mediumGray,
	},
	expertButtonWrapper: {
		padding: styles.measurements.gridSpace1,
		borderRadius: 5,
		marginLeft: styles.measurements.gridSpace1,
	},
	expertButtonText: {
		color: styles.colors.primary,
		fontFamily: styles.fonts.mainRegular,
	},
	camera: {
		height: 25,
		lineHeight: 27,
	},
	updateText: {
		fontSize: 16,
		fontFamily: styles.fonts.mainRegular,
	},
	removeSelectedContainer: {
		position: 'absolute',
		top: 8,
		right: 10,
		backgroundColor: 'transparent',
	},
	iconBackground: {
		backgroundColor: styles.colors.white,
		width: 20,
		height: 20,
		borderRadius: 10,
		overflow: 'hidden',
		alignItems: 'center',
	},
	statusUpdateInput: {
		textAlignVertical: 'top',
		fontFamily: styles.fonts.mainRegular,
		color: styles.colors.secondary,
		backgroundColor: styles.colors.white,
		flex: 1,
		marginLeft: styles.measurements.gridSpace1,
		height: 70,
	},
	modal: {
		backgroundColor: styles.colors.white,
	},
});

export class ProjectUpdateModal extends Component {

	constructor(props) {
		super(props);

		this.state = {
			animated: true,
			transparent: false,
			updateText: this.props.shouldMentionExpert ? `${EXPERT} - ` : '',
			title: 'Project Update',
			placeholderText: `Share an update or use ${EXPERT} to engage a product expert`,
			isComment: false,
			devicePhotos: [],
		};
	}

	componentWillMount() {
		const updates = {};
		const { postType, projectId } = this.props;
		if (postType && postType === 'comment') {
			Object.assign(updates, {
				title: 'Comment',
				isComment: true,
				placeholderText: 'Add your comment here',
			});
		}
		// if we get a projectId from parent store it in state.
		if (projectId) {
			updates.projectId = projectId;
		}

		this.setState(updates);
		// We can't use autoFocus on the input because it
		// causes some jank in the modal animation (eyeroll)
		setTimeout(() => {
			const { imagesToPost } = this.props;
			if (this.input && (imagesToPost && imagesToPost.length === 0)) {
				this.input.focus();
			}
		}, 700);
	}

	componentDidMount() {
		this.props.actions.trackState('build:app:projectupdate');
		EventEmitter.addListener(PROJECT_UPDATE_MODAL_ON_POST_PRESS, this.onPostButtonPress);
		EventEmitter.addListener(PROJECT_UPDATE_MODAL_ON_CANCEL_PRESS, this.onCancelButtonPress);
	}

	componentWillUnmount() {
		EventEmitter.removeListener(PROJECT_UPDATE_MODAL_ON_POST_PRESS, this.onPostButtonPress);
		EventEmitter.removeListener(PROJECT_UPDATE_MODAL_ON_CANCEL_PRESS, this.onCancelButtonPress);
	}

	updateText = (updateText) => {
		this.setState({
			updateText,
		});
	};

	hideModal = () => {
		this.props.photoActions.resetSelectedPhotos();
		if (this.input) {
			this.input.blur();
		}
		this.props.navigator.pop();
	};

	hasImagesToPost = () => {
		const { imagesToPost } = this.props;
		return imagesToPost && imagesToPost.length > 0;
	};

	/**
	 * Returns the tracking data for both posts and comments
	 * @return {Object} Data to track
	 */
	getTrackingData = () => {
		const { projectId, updateText } = this.state;
		const { projects, imagesToPost } = this.props;
		let status;

		if (projectId) {
			status = getProject(projects, projectId).archived ? 'archived' : 'active';
		}

		return {
			user_id: this.props.user.customerId,
			project_id: projectId,
			photo: imagesToPost.length > 0,
			text: updateText.length > 0,
			photo_count: imagesToPost.length,
			'@expert': updateText ? updateText.includes(EXPERT) : false,
			project_status: status,
		};
	};

	trackSavePostEvent = () => {
		this.props.actions.trackAction('Post', this.getTrackingData());
	};

	savePostEvent = () => {

		const { imagesToPost, actions, dispatch } = this.props;

		const { updateText, projectId } = this.state;
		let photos = [];

		if (imagesToPost) {
			photos = photos.concat(imagesToPost);
		}

		dispatch(actions.createEvent({
			eventType: 'POST',
			message: updateText,
			projectId,
			photos,
		}));
		this.trackSavePostEvent();
		this.hideModal();

	};

	trackSaveEventComment = () => {
		this.props.actions.trackAction('Comment', this.getTrackingData());
	};

	saveEventComment = () => {
		let photos = [];

		const { actions, dispatch, imagesToPost } = this.props;

		if (imagesToPost) {
			photos = photos.concat(imagesToPost);
		}

		dispatch(actions.saveComment({
			eventId: this.props.eventId,
			message: this.state.updateText,
			photos,
		}));
		this.trackSaveEventComment();
		this.hideModal();
	};

	onPostButtonPress = () => {
		if (this.state.updateText === '' && this.props.imagesToPost.length === 0) {
			Alert.alert(`You must enter text for your ${this.state.isComment ? 'comment' : 'post'}`);
			return;
		}

		if (this.state.isComment) {
			this.saveEventComment();
		} else {
			this.savePostEvent();
		}
	};

	updateSelectedProject = (projectId) => {
		this.setState({
			projectId,
		});
	};

	onCancelButtonPress = () => {
		if (Platform.OS === 'ios' && (this.state.updateText !== '' || this.props.imagesToPost.length > 0)) {
			ActionSheetIOS.showActionSheetWithOptions({
				options: [
					'Discard Update',
					'Keep Update',
				],
				destructiveButtonIndex: 0,
			}, (index) => {
				if (index === 0) {
					this.hideModal();
				}
			});
		} else {
			this.hideModal();
		}
	};

	mentionExpert = () => {
		const updateText = this.state.updateText === '' ? `${EXPERT} - ` : `${EXPERT} - ${this.state.updateText}`;
		this.setState({
			updateText,
		});
	};

	launchAddPhotoScreen = () => {
		if (this.input) {
			this.input.blur();
		}
		this.props.navigator.push('addPhoto', {
			launchedFrom: this.state.isComment ? 'comment' : 'post',
			returnTo: this.state.isComment ? 'comment' : 'post',
			shouldClearSelectedPhotos: !this.hasImagesToPost(),
			eventStoreType: this.props.eventStoreType,
			project: getProject(this.props.projects, this.props.projectId),
		});
	};

	renderPostImage = () => {
		const { imagesToPost, devicePhotos } = this.props;
		const photos = imagesToPost.map((imageUrl) => {
			return devicePhotos.photos.filter((photo) => photo.image.uri === imageUrl)[0];
		});
		if (
			this.props.imagesToPost.length === 0 ||
			!photos ||
			(photos.length === 1 && photos[0] === undefined)
		) {
			return <View />;
		}
		return photos.map((photo, index) => {
			let style;
			// if more than one image make 2 and a half fit
			if (photos.length > 1) {
				const photoDimension = (styles.dimensions.width - 30) / 2.5;
				style = {
					width: photoDimension,
					height: photoDimension,
					marginLeft: styles.measurements.gridSpace1,
				};
			} else {
				// if only one image make full width
				style = {
					width: styles.dimensions.width,
					height: photo.image.height ? (photo.image.height / photo.image.width) * styles.dimensions.width : styles.dimensions.width,
				};
			}

			return (
				<View key={`photo-${index}`}>
					<Image
						source={{
							uri: photo.image.uri,
						}}
						style={style}
					/>
					<TouchableOpacity
						onPress={() => {
							this.props.photoActions.togglePhotoSelected(photo.image.uri);
						}}
						style={componentStyles.removeSelectedContainer}
					>
						<View style={componentStyles.iconBackground}>
							<Icon
								name="ios-close"
								size={20}
								color={styles.colors.primary}
							/>
						</View>
					</TouchableOpacity>
				</View>
			);
		});
	};

	renderPinnedButtons = () => {
		return (
			<View style={componentStyles.pinnedButtonsContainer}>
				<TouchableOpacity
					onPress={this.launchAddPhotoScreen}
				>
					<Icon
						name={helpers.getIcon('camera')}
						size={33}
						color={styles.colors.primary}
						style={componentStyles.camera}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={this.mentionExpert}
					style={componentStyles.expertButtonWrapper}
				>
					<Text style={componentStyles.expertButtonText}>{EXPERT}</Text>
				</TouchableOpacity>
			</View>
		);
	};

	render() {
		return (

			<View
				onLayout={(event) => {
					this.setState({
						deviceWidth: event.nativeEvent.layout.width,
					});
				}}
				style={[styles.elements.screen, componentStyles.modal]}
			>
				<ScrollView
					automaticallyAdjustContentInsets={false}
					keyboardDismissMode="on-drag"
					style={{
						marginBottom: this.state.keyboardOffset,
					}}
				>
					<View
						style={componentStyles.row}
					>
						<Avatar
							fullName={getFullName(this.props.user)}
							firstName={this.props.user.firstName}
							lastName={this.props.user.lastName}
							url={getAvatarUrl(this.props.user)}
						/>
						<TextInput
							value={this.state.updateText}
							multiline={true}
							onChangeText={this.updateText}
							placeholder={this.state.placeholderText}
							ref={(ref) => {
								if (ref) {
									this.input = ref;
								}
							}}
							style={componentStyles.statusUpdateInput}
							underlineColorAndroid="transparent"
						/>
					</View>
					<ScrollView
						horizontal={true}
					>
						{this.renderPostImage()}
					</ScrollView>
				</ScrollView>
				<PinToKeyboard
					height={45}
					component={this.renderPinnedButtons()}
				/>
			</View>

		);
	}

}

ProjectUpdateModal.route = {
	styles: {
		...NavigationStyles.SlideVertical,
		gestures: null,
	},
	navigationBar: {
		visible: true,
		title(props) {
			return props && props.postType && props.postType.toLowerCase() === 'comment' ? 'Comment' : 'Project Update';
		},
		renderRight() {
			return <NavigationBarTextButton onPress={() => EventEmitter.emit(PROJECT_UPDATE_MODAL_ON_POST_PRESS)}>Post</NavigationBarTextButton>;
		},
		renderLeft() {
			return <NavigationBarTextButton onPress={() => EventEmitter.emit(PROJECT_UPDATE_MODAL_ON_CANCEL_PRESS)}>Cancel</NavigationBarTextButton>;
		},
	},
};

ProjectUpdateModal.propTypes = {
	actions: PropTypes.object.isRequired,
	devicePhotos: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	eventId: PropTypes.number,
	eventStoreType: PropTypes.string.isRequired,
	imagesToPost: PropTypes.array.isRequired,
	imageToPost: PropTypes.array,
	photoActions: PropTypes.object.isRequired,
	postType: PropTypes.string,
	projectId: PropTypes.number,
	projects: PropTypes.object.isRequired,
	shouldMentionExpert: PropTypes.bool,
	user: PropTypes.object.isRequired,
	navigator: PropTypes.shape({
		pop: PropTypes.func,
		push: PropTypes.func,
	}),
};

ProjectUpdateModal.mixins = [TimerMixin];

ProjectUpdateModal.defaultProps = {
	devicePhotos: {},
};

export default connect((state, ownProps) => {
	const props = {
		user: state.userReducer.user,
		devicePhotos: {
			photos: state.devicePhotosReducer.photos,
			selectedPhotos: state.devicePhotosReducer.selectedPhotos,
		},
		imagesToPost: state.devicePhotosReducer.selectedPhotos.map((photo) => photo.image.uri),
		projects: state.projectsReducer.projects,
	};

	switch (ownProps.eventStoreType) {
		case 'project':
			props.actions = {
				updateIsRefreshing,
				updateShowProjectEvents,
				updateIsFetchingProjectData,
				getEvents,
				saveProjectFavorite,
				getPhotos,
				createEvent,
				addOrderToProject,
			};
			break;
		case 'singleEvent':
			props.actions = {
				resetSingleEventData,
				getEvent,
			};
			break;
		default:
			break;
	}

	props.actions = { ...props.actions, saveComment, trackState, trackAction };
	return props;
}, (dispatch) => {
	return {
		dispatch,
		photoActions: bindActionCreators({
			loadPhotosSuccess,
			loadPhotosFail,
			addPhoto,
			getDevicePhotos,
			resetSelectedPhotos,
			togglePhotoSelected,
			toggleFetchingPhotos,
		}, dispatch),
	};
})(ProjectUpdateModal);
