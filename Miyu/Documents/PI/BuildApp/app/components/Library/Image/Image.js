import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import ReactNative, {
	StyleSheet,
} from 'react-native';
import { getCloudinaryNoImageAvailableUrl } from '../../../lib/helpers';

class Image extends Component {

	constructor(props) {
		super(props);
		this.state = {
			source: '',
			shouldGet404Image: true,
		};
	}

	getStyle = () => {
		const { width, height, resourceWidth, resourceHeight, style } = this.props;
		const styles = [style.image || style];
		// width and height must be provided else assumption would be to use image size received from the source
		if (width) {
			if (height) {
				styles.push(this.getDimensions());
			} else if (resourceWidth && resourceHeight) {
				const ratio = width / resourceWidth;
				styles.push({
					height: Math.round(resourceHeight * ratio),
					width,
				});
			}
		}
		return styles;
	};

	getDimensions = () => {
		const { height, width, style } = this.props;
		if (height && width) {
			return {
				height,
				width,
			};
		}
		const styles = StyleSheet.flatten(style);
		return {
			height: styles.height,
			width: styles.width,
		};
	};

	onLoad = () => {
		if (this.props.onLoad) {
			this.props.onLoad();
		}

		// we need to keep track of success state here because the Image component
		// on Android doesn't work with the onError prop yet... :'(
		// Note that onLoad always fires before onLoadEnd
		this.setState({
			shouldGet404Image: false,
		});
	};

	onLoadEnd = () => {
		if (this.state.shouldGet404Image) {
			this.setState({
				source: getCloudinaryNoImageAvailableUrl(this.getDimensions()),
			});
		}
	};

	getSource = () => {
		if (this.state.source) {
			return { uri: this.state.source };
		}

		if (typeof this.props.source === 'string') {
			return { uri: this.props.source };
		}

		return this.props.source;
	};

	renderReactNativeImage = () => {
		return (
			<ReactNative.Image
				onLayout={this.props.onLayout}
				style={this.getStyle()}
				source={this.getSource()}
				resizeMode={this.props.resizeMode}
				onLoadEnd={this.onLoadEnd}
				//This function seems to lose context at some point on android, this seems to fix it.
				onLoad={this.onLoad.bind(this)}
			>
				{this.props.children}
			</ReactNative.Image>
		);
	};

	render() {
		const { onPress } = this.props;
		if (onPress) {
			return (
				<ReactNative.TouchableWithoutFeedback
					style={this.props.style.touchableWrapper}
					onPress={onPress}
				>
					{this.renderReactNativeImage()}
				</ReactNative.TouchableWithoutFeedback>
			);
		}

		return this.renderReactNativeImage();
	}
}

Image.propTypes = {
	children: PropTypes.node,
	onPress: PropTypes.func,
	onLayout: PropTypes.func,
	onLoad: PropTypes.func,
	source: PropTypes.any.isRequired,
	width: PropTypes.number,
	height: PropTypes.number,
	style: PropTypes.oneOfType([
		PropTypes.object,
		ReactNative.Image.propTypes.style,
	]),
	resizeMode: PropTypes.oneOfType([
		ReactNative.Image.propTypes.resizeMode,
		PropTypes.string,
	]),
	resourceWidth: PropTypes.number,
	resourceHeight: PropTypes.number,
};

Image.defaultProps = {
	style: {},
	resizeMode: 'cover',
};

export default Image;
