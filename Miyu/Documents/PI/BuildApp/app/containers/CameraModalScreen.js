/**
 *
 * WARNING: This is probably not the camera modal you're looking for.
 * This modal is used for the old projects system and is closely tied
 * to it. Other uses should look at the DeviceCameraModal for more
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
	CameraRoll,
	StyleSheet,
	View,
	TouchableOpacity,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { measurements, fontSize } from '../lib/styles';
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import helpers from '../lib/helpers';
import {
	loadPhotosSuccess,
	loadPhotosFail,
	addPhoto,
	getDevicePhotos,
	resetSelectedPhotos,
	togglePhotoSelected,
	toggleFetchingPhotos,
} from '../actions/DevicePhotosActions';
import { trackState } from '../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-end',
		backgroundColor: 'black',
	},
	welcome: {
		fontSize: fontSize.large,
		textAlign: 'center',
		margin: measurements.gridSpace1,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
	},
	cameraControls: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'rgba(0, 0, 0, .1)',
		height: 68,
	},
	toggleFrontBack: {
		position: 'absolute',
		right: 10,
		top: 10,
	},
	takePicture: {
		alignSelf: 'center',
	},
	closeButton: {
		position: 'absolute',
		top: 15,
		left: 15,
	},
	camera: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	icon:{
		height: 65,
		width: 65,
	},
	iconSmall:{
		height: 50,
		width: 50,
	},
});

export class CameraModalScreen extends Component {

	constructor(props) {
		super(props);

		this.state = {
			cameraType: Camera.constants.Type.back,
			captureMode: helpers.isIOS() ? Camera.constants.CaptureTarget.cameraRoll : Camera.constants.CaptureTarget.temp,
		};
	}

	componentDidMount() {
		this.props.actions.trackState('build:app:cameramodal');
	}

	toggleFrontBackCamera = () => {
		const { back, front } = Camera.constants.Type;
		this.setState({
			cameraType: this.state.cameraType === back ? front : back,
		});
	};

	handleImageTaken = (data) => {
		if (this.cam && this.cam.stopCapture) {
			this.cam.stopCapture();
		}
		if (data && data.path) {
			if (helpers.isIOS()) {
				this.props.actions.addPhoto(data.path);
			} else {
				// on Android we do this extra step because we get a file:/// path back
				// and the app cant actually find that file for uploading. So instead we
				// save it as a temp file initially and then save it to the camera roll
				// manually before uploading...
				CameraRoll.saveToCameraRoll(data.path).then((path) => {
					this.props.actions.addPhoto(path);
				});
			}

			const { returnTo, eventStoreType, project } = this.props;
			if (returnTo === 'comment' || returnTo === 'post') {
				const previousProps = {
					eventStoreType,
					postType: 'post',
				};
				if (project && project.id) {
					previousProps.projectId = project.id;
				}
				if (returnTo === 'comment') {
					previousProps.postType = 'comment';
				}
			}
			this.closeCamera();
		}
	};

	takePicture = () => {
		this.cam.capture({
			target: this.state.captureMode,
			pictureFolder: 'Build.com',
		}).then((data) => this.handleImageTaken(data));
	};

	closeCamera = () => {
		this.props.navigator.pop();
	};

	render() {
		return (
			<View style={componentStyles.container}>
				<Camera
					ref={(node) => this.cam = node}
					style={componentStyles.camera}
					type={this.state.cameraType}
				/>
				<View style={componentStyles.cameraControls}>
					<TouchableOpacity
						onPress={this.closeCamera}
						style={componentStyles.closeButton}
					>
						<Icon
							name={helpers.getIcon('close')}
							size={50}
							color="white"
							style={componentStyles.iconSmall}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={this.takePicture}
						style={componentStyles.takePicture}
					>
						<Icon
							name="ios-radio-button-on"
							size={65}
							color="white"
							style={componentStyles.icon}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={this.toggleFrontBackCamera}
						style={componentStyles.toggleFrontBack}
					>
						<Icon
							name="ios-reverse-camera-outline"
							size={50}
							color="white"
							style={componentStyles.iconSmall}
						/>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

CameraModalScreen.propTypes = {
	returnTo: PropTypes.string.isRequired,
	eventStoreType: PropTypes.string.isRequired,
	project: PropTypes.object,
	actions: PropTypes.object.isRequired,
	navigator: PropTypes.shape({
		pop: PropTypes.func,
	}),
};

export default connect((state) => {
	return {
		...state.devicePhotosReducer,
		images: state.devicePhotosReducer.photos,
	};
}, (dispatch) => {
	return {
		actions: bindActionCreators({
			loadPhotosSuccess,
			loadPhotosFail,
			addPhoto,
			getDevicePhotos,
			resetSelectedPhotos,
			togglePhotoSelected,
			toggleFetchingPhotos,
			trackState,
		}, dispatch),
	};
})(CameraModalScreen);
