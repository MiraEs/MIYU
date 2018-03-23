import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	ViewPropTypes,
} from 'react-native';
import AtomComponent from '../AtomComponent';
import VideoPreview from '../../components/VideoPreview';
import Video from '../../components/Video';
import { connect } from 'react-redux';

export class HeroMedia extends Component {

	render() {
		const {
			media_type: { value },
			media_image,
			media_video,
			videoIncludes,
			width,
			height,
		} = this.props;
		switch (value) {
			case 'media_image':
				return (
					<View style={this.props.style}>
						<AtomComponent
							{...media_image}
							width={width}
							height={height}
							gravity="custom"
							crop="fill"
						>
							{this.props.children}
						</AtomComponent>
					</View>
				);
			case 'media_video':
				const video = videoIncludes[media_video.selected[0]];
				if (this.props.preview) {
					return (
						<View style={this.props.style}>
							<VideoPreview
								style={this.props.style}
								video={video}
								width={width}
								height={height}
							/>
						</View>
					);
				} else {
					return (
						<View style={this.props.style}>
							<Video
								hashKey={video.hashKey}
								streamProviderCode={video.streamProviderCode}
							/>
						</View>
					);
				}
			default:
				return null;
		}
	}

}

HeroMedia.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.string,
		PropTypes.element,
		PropTypes.number,
	]),
	media_type: PropTypes.object.isRequired,
	media_image: PropTypes.object,
	media_video: PropTypes.object,
	fillWidth: PropTypes.bool,
	width: PropTypes.number,
	height: PropTypes.number,
	preview: PropTypes.bool,
	style: ViewPropTypes.style,
	videoIncludes: PropTypes.object,
};

export default connect((state) => ({ videoIncludes: state.contentReducer.videoIncludes }), null)(HeroMedia);
