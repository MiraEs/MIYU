import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	WebView,
} from 'react-native';
import { Text } from 'BuildLibrary';
import styles from '../lib/styles';

const videoWidth = styles.dimensions.width;
const videoHeight = styles.dimensions.width * (9 / 16);

export default class Video extends Component {

	reload = () => {
		this.webview.reload();
	};

	render() {
		const {
			hashKey,
			streamProviderCode,
		} = this.props;
		const width = this.props.width || videoWidth;
		const height= this.props.height || videoHeight;
		const style = {
			margin: 0,
			padding: 0,
			width,
			height,
		};


		switch (streamProviderCode) {
			case 1:
				// wistia
				return (
					<View style={style}>
						<WebView
							ref={(ref) => {
								if (ref) {
									this.webview = ref;
								}
							}}
							source={{
								html: `<body style="margin:0;"><iframe src="http://fast.wistia.net/embed/iframe/${hashKey}?version=v1&videoHeight=${height}&videoWidth=${width}" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" width="${width}" height="${height}"></iframe></body>`,
							}}
							style={style}
						/>
					</View>
				);
			case 2:
				// youtube
				return (
					<View style={style}>
						<WebView
							ref={(ref) => {
								if (ref) {
									this.webview = ref;
								}
							}}
							source={{
								html: `<body style="margin:0;"><iframe width="${width}" height="${height}" src="https://www.youtube.com/embed/${hashKey}" frameborder="0" allowfullscreen></iframe></body>`,
							}}
							style={style}
						/>
					</View>
				);
			default:
				return (
					<View>
						<Text>Could not load video.</Text>
					</View>
				);
		}
	}

}

Video.propTypes = {
	hashKey: PropTypes.string.isRequired,
	height: PropTypes.number,
	width: PropTypes.number,
	streamProviderCode: PropTypes.number.isRequired,
};
