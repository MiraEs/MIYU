import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import { Text } from 'BuildLibrary';
import { withNavigation } from '@expo/ex-navigation';
import AtomComponent from '../AtomComponent';
import styles from '../../lib/styles';
import TrackingActions from '../../lib/analytics/TrackingActions';
import helpers from '../../lib/helpers';

const componentStyles = StyleSheet.create({
	bannerB: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'space-between',
		padding: styles.measurements.gridSpace2,
		flex: 1,
	},
	bannerC: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
	},
	bannerD: {
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: styles.measurements.gridSpace2,
		flex: 1,
	},
	couponB: {
		borderLeftWidth: styles.measurements.gridSpace1,
		borderLeftColor: styles.colors.accent,
		paddingHorizontal: styles.measurements.gridSpace1,
	},
	couponD: {
		backgroundColor: 'transparent',
	},
	ctaPrimary: {
		backgroundColor: styles.colors.primary,
		padding: styles.measurements.gridSpace2,
	},
	ctaAccent: {
		backgroundColor: styles.colors.accent,
		padding: styles.measurements.gridSpace2,
	},
	headline: {
		padding: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
		borderLeftWidth: styles.measurements.gridSpace1,
		borderLeftColor: styles.colors.secondary,
	},
	headlineA: {
		marginTop: 0,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	shadow: {
		textShadowColor: '#00000080',
		textShadowRadius: 3,
		textShadowOffset: {
			width: 1,
			height: 1,
		},
	},
});

@withNavigation
export default class SharedPromo extends Component {

	renderCouponB = (couponCode) => {
		if (couponCode.text) {
			return (
				<View style={componentStyles.couponB}>
					<Text size="small">Coupon Code:{' '}
						<AtomComponent
							{...couponCode}
							size="small"
							color="accent"
							lineHeight={false}
						/>
					</Text>
				</View>
			);
		}
	};

	renderCouponC = (couponCode) => {
		if (couponCode.text) {
			return (
				<Text size="small">Coupon Code:{' '}
					<AtomComponent
						{...couponCode}
						size="small"
						color="accent"
					/>
				</Text>
			);
		} else {
			return <View />;
		}
	};

	renderCouponD = (couponCode) => {
		if (couponCode.text) {
			return (
				<Text
					style={[componentStyles.couponD, componentStyles.shadow]}
					color="white"
				>Coupon Code: <AtomComponent
					{...couponCode}
					weight="bold"
					color="white"
				/></Text>
			);
		} else {
			return <View />;
		}
	};

	renderOverlayImage = () => {
		const { content } = this.props.contentItem;
		if (content.media_image_overlay && content.media_image_overlay.public_id && content.media_image_overlay.public_id.length) {
			const overlayImageHeight = 75;
			const overlayImageUri = helpers.getOverlayImageUrl(content.media_image_overlay.public_id, overlayImageHeight);
			return (
				<AtomComponent
					{...content.media_image_overlay}
					uri={overlayImageUri}
					height={overlayImageHeight}
				/>
			);
		}
	};

	render() {
		const { content, group, id } = this.props.contentItem;
		switch (content.variation ? content.variation.selected : 'a') {
			case 'a':
			case 'b':
				return (
					<View>
						<View style={componentStyles.headline}>
							<AtomComponent
								{...content.headline}
								color="primary"
								weight="bold"
								family="archer"
								size="large"
								lineHeight={false}
							/>
							{this.renderCouponB(content.coupon_code)}
						</View>
						<AtomComponent
							{...content.media_image}
							style={componentStyles.bannerB}
							width={styles.dimensions.width}
							height={180}
							gravity="custom"
							crop="lfill"
						>
							{this.renderOverlayImage()}
							<AtomComponent
								{...content.cta_url}
								contentItemId={id}
								group={group}
								trackAction={TrackingActions.SHARED_PROMO_CTA}
							>
								<AtomComponent
									{...content.cta}
									style={content.media_image.public_id ? componentStyles.ctaPrimary : componentStyles.ctaAccent}
									weight="bold"
									color="white"
									lineHeight={false}
								/>
							</AtomComponent>
						</AtomComponent>
					</View>
				);
			case 'c':
				return (
					<View>
						<AtomComponent
							{...content.media_image}
							style={componentStyles.bannerC}
							width={styles.dimensions.width}
							height={180}
							gravity="custom"
							crop="lfill"
						>
							<AtomComponent
								{...content.headline}
								shadow={true}
								lineHeight={false}
								family="archer"
								size="xlarge"
								color="white"
							/>
							{this.renderOverlayImage()}
						</AtomComponent>
						<View style={[componentStyles.headline, componentStyles.row]}>
							{this.renderCouponC(content.coupon_code)}
							<AtomComponent
								{...content.cta_url}
								contentItemId={id}
								group={group}
								trackAction={TrackingActions.SHARED_PROMO_CTA}
							>
								<AtomComponent
									{...content.cta}
									style={content.media_image.public_id ? componentStyles.ctaPrimary : componentStyles.ctaAccent}
									weight="bold"
									color="white"
									lineHeight={false}
								/>
							</AtomComponent>
						</View>
					</View>
				);
			case 'd':
				return (
					<AtomComponent
						{...content.media_image}
						style={componentStyles.bannerD}
						width={styles.dimensions.width}
						height={200}
						gravity="custom"
						crop="lfill"
					>
						{this.renderCouponD(content.coupon_code)}
						<AtomComponent
							{...content.headline}
							shadow={true}
							size="larger"
							color="white"
							weight="bold"
						/>
						{this.renderOverlayImage()}
						<AtomComponent
							{...content.cta_url}
							contentItemId={id}
							group={group}
							trackAction={TrackingActions.SHARED_PROMO_CTA}
						>
							<AtomComponent
								{...content.cta}
								style={content.media_image.public_id ? componentStyles.ctaPrimary : componentStyles.ctaAccent}
								weight="bold"
								color="white"
								lineHeight={false}
							/>
						</AtomComponent>
					</AtomComponent>
				);
		}
		return null;
	}

}

SharedPromo.propTypes = {
	navigator: PropTypes.object,
	contentItem: PropTypes.object,
};

SharedPromo.defaultProps = {};
