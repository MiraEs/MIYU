import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Clipboard,
	StyleSheet,
	View,
} from 'react-native';
import styles from '../../lib/styles';
import {
	Text,
	TouchableOpacity,
} from 'BuildLibrary';
import { connect } from 'react-redux';
import { withNavigation } from '@expo/ex-navigation';
import AtomComponent from '../AtomComponent';
import { HIT_SLOP } from '../../constants/constants';
import CardView from '../../components/CardView';
import TrackingActions from '../../lib/analytics/TrackingActions';
import EventEmitter from '../../lib/eventEmitter';
import ProStamp from '../../components/ProStamp';

const componentStyles = StyleSheet.create({
	imageSection: {
		flex: 1,
		padding: styles.measurements.gridSpace2,
		justifyContent: 'flex-end',
	},
	ctaSection: {
		borderTopColor: styles.colors.greyLight,
		borderTopWidth: styles.dimensions.borderWidth,
		justifyContent: 'space-between',
		flexDirection: 'row',
		padding: styles.measurements.gridSpace2,
	},
	descriptionSection: {
		padding: styles.measurements.gridSpace2,
	},
	promoDetailSection: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
});

const width = styles.dimensions.width - (styles.measurements.gridSpace1 * 2);
const imageDimensions = {
	height: Math.round(width * 9 / 16),
	width,
};

@withNavigation
export class NativePromo extends Component {

	renderCoupon = () => {
		if (this.props.coupon_code && this.props.coupon_code.text.length) {
			return (
				<View style={styles.elements.flexRow}>
					<Text
						syle={componentStyles.proStamp}
						color="accent"
						weight="bold"
					>
						Coupon Code:{' '}
					</Text>
					<TouchableOpacity
						onPress={() => {
							Clipboard.setString(this.props.coupon_code.text);
							EventEmitter.emit('showScreenAlert', {
								message: 'Coupon copied to clipboard',
								type: 'success',
							});
						}}
						trackAction={TrackingActions.NATIVE_PROMO_COUPON_TAP}
						hitSlop={HIT_SLOP}
					>
						<AtomComponent
							{...this.props.coupon_code}
							color="accent"
							weight="bold"
						/>
					</TouchableOpacity>
				</View>
			);
		}
		return <Text>No Coupon Necessary</Text>;
	};

	renderProStamp = () => {
		if (this.props.pro_only.selected) {
			return <ProStamp />;
		}
	};

	render() {
		if (this.props.pro_only.selected && !this.props.isPro) {
			return null;
		}
		return (
			<CardView>
				<AtomComponent
					{...this.props.cta_url}
					trackAction={TrackingActions.NATIVE_PROMO_IMAGE_TAP}
					contentItemId={this.props.contentItemId}
					group={this.props.group}
				>
					<AtomComponent
						style={componentStyles.imageSection}
						{...imageDimensions}
						{...this.props.media_image}
						gradient={true}
						crop="fill"
					>
						<AtomComponent
							color="white"
							size="larger"
							weight="bold"
							{...this.props.headline}
						/>
					</AtomComponent>
				</AtomComponent>
				<View style={componentStyles.descriptionSection}>
					<View style={componentStyles.promoDetailSection}>
						<AtomComponent
							{...this.props.promo_detail}
							size="large"
							weight="bold"
						/>
						{this.renderProStamp()}
					</View>
					<AtomComponent
						style={styles.elements.flexWrap}
						{...this.props.description}
					/>
				</View>
				<View style={componentStyles.ctaSection}>
					{this.renderCoupon()}
					<AtomComponent
						{...this.props.cta_url}
						trackAction={TrackingActions.NATIVE_PROMO_CTA_TAP}
						contentItemId={this.props.contentItemId}
						group={this.props.group}
					>
						<AtomComponent
							color="primary"
							weight="bold"
							{...this.props.cta}
						/>
					</AtomComponent>
				</View>
			</CardView>
		);
	}

}

NativePromo.propTypes = {
	contentItemId: PropTypes.string,
	coupon_code: PropTypes.object,
	cta: PropTypes.object,
	cta_url: PropTypes.object,
	description: PropTypes.object,
	group: PropTypes.object,
	media_image: PropTypes.object,
	headline: PropTypes.object,
	promo_detail: PropTypes.object,
	pro_only: PropTypes.object,
	isPro: PropTypes.bool,
};

export default connect((state) => ({ isPro: state.userReducer.user.isPro }))(NativePromo);
