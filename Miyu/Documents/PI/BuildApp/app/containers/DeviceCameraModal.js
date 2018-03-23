import React, {
	PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import {
	CameraRoll,
	StyleSheet,
	View,
	TouchableOpacity,
} from 'react-native';
import { withScreen } from 'BuildLibrary';
import styles from '../lib/styles';
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import helpers from '../lib/helpers';
import { withNavigation } from '@expo/ex-navigation';

const componentStyles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'flex-end',
		backgroundColor: styles.colors.lightGray,
	},
	cameraControls: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: styles.colors.underlayGrey,
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
	icon: {
		height: 65,
		width: 65,
	},
	iconSmall: {
		height: 50,
		width: 50,
	},
});

export class DeviceCameraModal extends PureComponent {
	state = {
		cameraType: Camera.constants.Type.back,
	};

	setScreenTrackingInformation() {
		return {
			name: 'build:app:devicecameramodal',
		};
	}

	toggleFrontBackCamera = () => {
		const { back, front } = Camera.constants.Type;
		this.setState((prevState) => ({
			cameraType: prevState.cameraType === back ? front : back,
		}));
	};

	handleImageTaken = ({ path = '' }) => {
		if (path) {
			if (helpers.isIOS()) {
				this.props.onImageCapture(path);
			} else {
				// on Android we do this extra step because we get a file:/// path back
				// and the app cant actually find that file for uploading. So instead we
				// save it as a temp file initially and then save it to the camera roll
				// manually before uploading...
				CameraRoll.saveToCameraRoll(path).then((path) => {
					this.props.onImageCapture(path);
				});
			}
		}
	};

	takePicture = () => {
		this.cam.capture().then(this.handleImageTaken);
	};

	closeCamera = () => {
		this.props.navigator.pop();
	};

	render() {
		const captureTarget = helpers.isIOS() ? Camera.constants.CaptureTarget.cameraRoll : Camera.constants.CaptureTarget.temp;
		return (
			<View style={componentStyles.container}>
				<Camera
					ref={(node) => this.cam = node}
					aspect={Camera.constants.Aspect.fit}
					captureTarget={captureTarget}
					keepAwake={true}
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

DeviceCameraModal.propTypes = {
	navigator: PropTypes.shape({
		pop: PropTypes.func,
	}),
	onImageCapture: PropTypes.func.isRequired,
};

DeviceCameraModal.defaultProps = {
	onImageCapture: helpers.noop,
};

export default withNavigation(withScreen(DeviceCameraModal));
