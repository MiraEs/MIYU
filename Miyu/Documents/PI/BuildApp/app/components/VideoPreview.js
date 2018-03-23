import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	PixelRatio,
	StyleSheet,
	View,
} from 'react-native';
import { Image } from 'BuildLibrary';
import LoadingView from '../components/LoadingView';
import httpClient from '../services/httpClient';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../lib/styles';

const componentStyles = StyleSheet.create({
	playButton: {
		height: 40,
		width: 64,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 6,
	},
	playIcon: {
		backgroundColor: styles.colors.none,
	},
});

export default class VideoPreview extends Component {

	constructor(props) {
		super(props);
		this.state = {
			uri: null,
		};
	}

	componentDidMount() {
		if (this.props.video.streamProviderCode === 1) {
			httpClient.get(`https://fast.wistia.net/oembed?url=https://home.wistia.com/medias/${this.props.video.hashKey}?videoWidth=${this.props.width * PixelRatio.get()}`)
			.then((response) => {
				this.setState({ uri: response.thumbnail_url});
			});
		} else {
			this.setState({ uri: `https://i.ytimg.com/vi/${this.props.video.hashKey}/sddefault.jpg` });
		}
	}

	getLoadingViewStyle = () => {
		return {
			width: this.props.width,
			height: this.props.height,
		};
	};

	render() {
		const { uri } = this.state;
		if (uri) {
			return (
				<Image
					style={styles.elements.centering}
					source={{ uri }}
					width={this.props.width}
					height={this.props.height}
				>
					<LinearGradient
						start={{ x: 0.0, y: 0.0 }}
						end={{ x: 0.0, y: 1.0 }}
						colors={['#666666E8', '#333333E8']}
						style={componentStyles.playButton}
					>
						<Icon
							style={componentStyles.playIcon}
							color={styles.colors.white}
							name="ios-play"
							size={30}
						/>
					</LinearGradient>
				</Image>
			);
		} else {
			return (
				<View style={this.getLoadingViewStyle()}>
					<LoadingView />
				</View>
			);
		}
	}

}

VideoPreview.propTypes = {
	video: PropTypes.object.isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
};
