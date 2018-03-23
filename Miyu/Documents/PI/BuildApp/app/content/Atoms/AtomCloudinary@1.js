import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import ReactNative, {
	Animated,
	View,
	ViewPropTypes,
} from 'react-native';
import styles from '../../lib/styles';
import { Image } from 'BuildLibrary';
import helpers, {
	getCloudinaryImageUrl,
} from '../../lib/helpers';
import BannerGradient from '../../components/BannerGradient';

export default class AtomCloudinary extends Component {

	constructor(props) {
		super(props);
		const {
			crop,
			gravity,
			height,
			width,
		} = props;
		this.uri = props.uri || getCloudinaryImageUrl({
			name: props.public_id || 'content-tool/zxsxsghibgai4igoarul',
			width,
			height,
			crop,
			gravity,
		});
		this.state = {
			width,
			height,
			fadeAnim: new Animated.Value(0),
		};
		if ((width && !height) || (!width && height)) {
			ReactNative.Image.getSize(this.uri, (imgWidth, imgHeight) => {
				this.setState({ width: Math.round(imgWidth/2), height: Math.round(imgHeight/2)});
			});
		}
	}

	renderChildren = () => {
		if (this.props.gradient) {
			return (
				<BannerGradient style={this.props.style}>
					{this.props.children}
				</BannerGradient>
			);
		} else {
			return (
				<View style={this.props.style}>
					{this.props.children}
				</View>
			);
		}
	};

	render() {
		if (this.props.children) {
			const imageTree = (
				<Animated.View style={{ opacity: this.state.fadeAnim }}>
					<Image
						onLoad={() => {
							if (this.props.children) {
								Animated.timing(this.state.fadeAnim, {
									toValue: 1,
									duration: 200,
								}).start();
							}
						}}
						width={this.state.width}
						height={this.state.height}
						onLayout={this.props.onLayout}
						resizeMode={this.props.resizeMode}
						source={{ uri: this.uri }}
					>
						{this.renderChildren()}
					</Image>
				</Animated.View>
			);
			if (this.props.loadingLogo) {
				return (
					<Image
						resizeMode="center"
						onLoad={this.props.onLoad}
						source={require('../../images/logo-drawer.png')}
						style={{ width: this.props.width, height: this.props.height }}
					>
						{imageTree}
					</Image>
				);
			}
			return imageTree;
		} else {
			return (
				<Image
					width={this.state.width}
					height={this.state.height}
					onLayout={this.props.onLayout}
					resizeMode={this.props.resizeMode}
					source={{ uri: this.uri }}
					style={this.props.style}
				/>
			);
		}
	}

}

AtomCloudinary.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	crop: PropTypes.string,
	gravity: PropTypes.string,
	public_id: PropTypes.string,
	gradient: PropTypes.bool,
	onLayout: PropTypes.func,
	children: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.string,
		PropTypes.element,
		PropTypes.number,
	]),
	onLoad: PropTypes.func,
	resizeMode: PropTypes.string,
	loadingLogo: PropTypes.bool,
	style: ViewPropTypes.style,
	uri: PropTypes.string,
};

AtomCloudinary.defaultProps = {
	gravity: 'custom',
	width: styles.dimensions.width,
	resizeMode: 'cover',
};

AtomCloudinary.defaultProps = {
	onLayout: helpers.noop,
};
