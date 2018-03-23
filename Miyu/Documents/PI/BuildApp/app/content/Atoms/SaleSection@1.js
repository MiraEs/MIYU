import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import AtomComponent from '../AtomComponent';
import styles from '../../lib/styles';
import BannerGradient from '../../components/BannerGradient';
import { ParallaxScrollView } from 'BuildLibrary';
import helpers from '../../lib/helpers';

const height = 200;

const componentStyles = StyleSheet.create({
	foreground: {
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		flexDirection: 'row',
		padding: styles.measurements.gridSpace1,
		flex: 1,
	},
	gradient: {
		width: styles.dimensions.width,
		height,
	},
	heading: {
		backgroundColor: 'transparent',
	},
});

const overlayHeight = 60;

export default class SaleSection extends Component {

	renderOverlay = () => {
		if (this.props.media_image_overlay && this.props.media_image_overlay.public_id) {
			return (
					<AtomComponent
						{...this.props.media_image_overlay}
						uri={helpers.getOverlayImageUrl(this.props.media_image_overlay.public_id, overlayHeight)}
						resizeMode="contain"
						height={overlayHeight}
					/>
			);
		}
	};

	render() {
		return (
			<ParallaxScrollView
				parallaxHeaderHeight={height}
				contentBackgroundColor={styles.colors.greyLight}
				backgroundColor={styles.colors.greyLight}
				renderBackground={() => {
					return (
						<AtomComponent
							width={styles.dimensions.width}
							height={height}
							crop="fill"
							gravity="custom"
							loadingLogo={true}
							{...this.props.media_image}
						>
							<BannerGradient style={componentStyles.gradient} />
						</AtomComponent>
					);
				}}
				renderForeground={() => {
					return (
						<View style={componentStyles.foreground}>
							<AtomComponent
								{...this.props.heading}
								lineHeight={false}
								style={componentStyles.heading}
								color="white"
								weight="bold"
								textAlign="center"
								size="large"
							/>
							{this.renderOverlay()}
						</View>
					);
				}}
			>
				<AtomComponent
					{...this.props.related_categories}
					categoryIncludes={this.props.categoryIncludes}
					scrollEnabled={false}
				/>
			</ParallaxScrollView>
		);
	}

}

SaleSection.propTypes = {
	media_image: PropTypes.object,
	media_image_overlay: PropTypes.object,
	heading: PropTypes.object,
	related_categories: PropTypes.object,
	categoryIncludes: PropTypes.object,
};
