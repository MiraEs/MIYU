import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import AtomComponent from '../AtomComponent';
import TrackingActions from '../../lib/analytics/TrackingActions';
import Video from '../../components/Video';
import { connect } from 'react-redux';
import styles from '../../lib/styles';

const componentStyles = StyleSheet.create({
	cta: {
		padding: styles.measurements.gridSpace1,
		alignSelf: 'flex-start',
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.greyDark,
	},
});

export class EditorialBlob extends Component {

	renderMedia = () => {
		if (this.props.media_image && this.props.media_image.public_id && this.props.media_image.public_id.length) {
			return (
				<View style={styles.elements.paddingTop}>
					<AtomComponent
						{...this.props.media_image}
						width={styles.dimensions.width}
						crop="fill"
					/>
				</View>
			);
		} else if (this.props.media_video) {
			const video = this.props.videoIncludes[this.props.media_video.selected[0]];
			return (
				<View style={styles.elements.paddingTop}>
					<Video
						hashKey={video.hashKey}
						streamProviderCode={video.streamProviderCode}
					/>
				</View>
			);
		}
	};

	renderCTA = () => {
		if (this.props.section_cta && this.props.section_cta.text && this.props.section_cta.text.length) {
			return (
				<View style={[styles.elements.paddingTop, styles.elements.paddingHorizontal]}>
					<AtomComponent
						{...this.props.section_cta_url}
						group={this.props.group}
						contentItemId={this.props.contentItemId}
						trackAction={TrackingActions.EDITORIAL_SECTION_CTA}
					>
						<AtomComponent
							{...this.props.section_cta}
							style={componentStyles.cta}
							weight="bold"
							color="secondary"
						/>
					</AtomComponent>
				</View>
			);
		}
	};

	render() {
		return (
			<View>
				<View style={styles.elements.paddingHorizontal}>
					<AtomComponent
						style={styles.elements.paddingTop}
						weight="bold"
						{...this.props.heading}
					/>
					<AtomComponent
						style={styles.elements.paddingTop}
						{...this.props.body_copy}
					/>
				</View>
				{this.renderMedia()}
				<AtomComponent
					{...this.props.media_caption}
					textAlign="center"
				/>
				{this.renderCTA()}
			</View>
		);
	}

}

EditorialBlob.propTypes = {
	body_copy: PropTypes.object,
	contentItemId: PropTypes.string,
	group: PropTypes.object.isRequired,
	heading: PropTypes.object,
	media_caption: PropTypes.object,
	media_image: PropTypes.object,
	media_video: PropTypes.object,
	section_cta: PropTypes.object,
	section_cta_url: PropTypes.object,
	videoIncludes: PropTypes.object,
};

export default connect((state) => ({ videoIncludes: state.contentReducer.videoIncludes }), null)(EditorialBlob);
