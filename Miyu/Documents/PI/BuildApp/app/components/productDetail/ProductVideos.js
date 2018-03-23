'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	Platform,
} from 'react-native';
import styles from '../../lib/styles';
import Pager from '../Library/Pager/Pager';
import Video from '../Video';
import { Text } from 'BuildLibrary';
import { trackState } from '../../actions/AnalyticsActions';
import store from '../../store/configStore';

const {
	width,
} = styles.dimensions;

const componentStyles = StyleSheet.create({
	screen: {
		padding: 0,
	},
	videoPage: {
		width,
		flex: 1,
	},
	titleAndDescription: {
		flex: 1,
		marginHorizontal: styles.measurements.gridSpace2,
	},
	title: {
		marginVertical: styles.measurements.gridSpace2,
	},
	markerStyle: {
		...Platform.select({
			ios: {
				marginVertical: styles.measurements.gridSpace2,
			},
			android: {
				marginVertical: styles.measurements.gridSpace2,
			},
		}),
	},
});

class ProductVideos extends Component {

	componentDidMount() {
		store.dispatch(trackState('build:app:productvideos'));
	}

	onPageChanged = (index, previousIndex) => {
		if (Platform.OS === 'android') {
			this[`webview${previousIndex}`].reload();
		}
	};

	renderVideos = () => {
		const { videos } = this.props;
		return videos.map((video, index) => {
			return (
				<View
					key={index}
					style={componentStyles.videoPage}
				>
					<Video
						ref={(ref) => {
							if (ref) {
								this[`webview${index}`] = ref;
							}
						}}
						{...video}
					/>
					<View style={componentStyles.titleAndDescription}>
						<View style={componentStyles.title}>
							<Text weight="bold">{video.title}</Text>
						</View>
						<Text>{video.description}</Text>
					</View>
				</View>
			);
		});
	};

	render() {
		return (
			<View style={[styles.elements.screenWithHeader, componentStyles.screen]}>
				<Pager
					onPageChanged={this.onPageChanged}
					style={componentStyles.videoPage}
					markerStyle={componentStyles.markerStyle}
				>
					{this.renderVideos()}
				</Pager>
			</View>
		);
	}

}

ProductVideos.route = {
	navigationBar: {
		title: 'Videos',
		visible: true,
	},
};

ProductVideos.propTypes = {
	videos: PropTypes.arrayOf(PropTypes.shape({
		videoId: PropTypes.number,
		hashKey: PropTypes.string.isRequired,
		streamProviderCode: PropTypes.number.isRequired,
		title: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
		screenshotId: PropTypes.number,
	})),
};

export default ProductVideos;
