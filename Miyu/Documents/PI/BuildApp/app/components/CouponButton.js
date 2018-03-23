import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Alert,
	View,
	ViewPropTypes,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import helpers from '../lib/helpers';
import EventEmitter from '../lib/eventEmitter';
import { IconButton } from 'BuildLibrary';
import {
	addCoupon,
	removeCoupon,
} from '../actions/CartActions';
import {
	hideAccessories,
	showAccessories,
} from '../actions/KeyboardActions';
import CouponButtonModal from './CouponButtonModal';

export class CouponButton extends Component {

	constructor(props) {
		super(props);
		const { cart: { couponTotal }, addTrackAction, editTrackAction } = props;

		this.state = {
			trackAction: couponTotal ? editTrackAction : addTrackAction,
			isLoading: false,
		};
	}

	onCouponModal = () => {
		const { actions: { hideAccessories }, cart: {sessionCouponDiscounts}, modal, removeTrackAction } = this.props;

		hideAccessories();

		modal.show({
			showNavBar: false,
			renderContent: () => {
				return (
					<CouponButtonModal
						coupons={sessionCouponDiscounts}
						onAddCoupon={this.onAddCoupon}
						onRemoveCoupon={this.onRemoveCoupon}
						removeTrackAction={removeTrackAction}
					/>
				);
			},
		});
	};

	onAddCoupon = (couponCode) => {
		const { actions: { addCoupon, showAccessories }, cart: { sessionCartId }, modal } = this.props;

		modal.hide().then(() => {
			if (couponCode) {
				this.setState({ couponCode, isLoading: true }, () => {
					addCoupon({
						sessionCartId,
						couponCode,
					})
						.then(() => this.showAlert('Coupon Applied!'))
						.catch((error) => {
							const message = error.message ? error.message.replace('Error: ', '') : 'Invalid Coupon Code';
							this.showAlert(message, 'error');
						})
						.done(() => this.setState({isLoading: false}));
				});
			}
		});

		showAccessories();
	};

	onRemoveCoupon = (couponCode) => {
		const { actions: { removeCoupon }, cart: { sessionCartId }, modal } = this.props;

		Alert.alert(
			'Remove Coupon',
			'Are you sure you want to remove the coupon?',
			[
				{ text: 'No' },
				{
					text: 'Yes',
					onPress: () => {
						this.setState({ isLoading: true }, () => {
							modal.hide();
							removeCoupon({couponCode, sessionCartId, recalculatePrice: true})
								.then(() => this.showAlert('Coupon Removed'))
								.catch(() => this.showAlert('Unable to remove Coupon Code', 'error'))
								.done(() => this.setState({ couponCode: null, isLoading: false }));
						});
					},
				},
			]
		);
	};

	onCouponAction = () => {
		const { cart: { couponTotal }, addTrackAction, editTrackAction } = this.props;

		this.setState({
			trackAction: couponTotal ? editTrackAction : addTrackAction,
		}, () => {
			this.onCouponModal();
		});
	};

	showAlert = (message, type = 'success') => {
		EventEmitter.emit('showScreenAlert', { message, type });
	};

	render() {
		const { cart: { couponTotal }, size, style } = this.props;
		const { isLoading, trackAction } = this.state;

		return (
			<View style={style}>
				<IconButton
					accessibilityLabel="Coupon Edit"
					iconName={helpers.getIcon('pricetag')}
					size={size}
					color="white"
					text={couponTotal ? 'Edit Coupons' : 'Coupon Code'}
					textColor={couponTotal ? 'accent' : 'secondary'}
					onPress={this.onCouponAction}
					trackAction={trackAction}
					isLoading={isLoading}
				/>
			</View>
		);
	}
}

CouponButton.propTypes = {
	actions: PropTypes.object.isRequired,
	addTrackAction: PropTypes.string,
	cart: PropTypes.object,
	editTrackAction: PropTypes.string,
	removeTrackAction: PropTypes.string,
	modal: PropTypes.object,
	size: PropTypes.oneOf([
		'small',
		'regular',
	]),
	style: ViewPropTypes.style,
};

CouponButton.defaultProps = {
	size: 'regular',
};

const mapStateToProps = (state) => {
	return {
		cart: state.cartReducer.cart,
		modal: state.referenceReducer.modal,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			addCoupon,
			removeCoupon,
			hideAccessories,
			showAccessories,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CouponButton);
