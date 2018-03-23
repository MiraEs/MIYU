import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	TextInput,
	View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
	IconButton,
	KeyboardSpacer,
	Text,
} from 'BuildLibrary';
import styles from '../lib/styles';
import helpers from '../lib/helpers';

const componentStyles = StyleSheet.create({
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: styles.colors.white,
		borderTopWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
		paddingHorizontal: styles.measurements.gridSpace2,
	},
	input: {
		flex: 1,
		color: styles.colors.secondary,
		fontSize: styles.fontSize.regular,
		padding: styles.measurements.gridSpace1,
		height: styles.buttons.regular.height,
	},
	spacer: {
		height: styles.measurements.gridSpace2,
	},
	couponRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: styles.dimensions.tapSizeMedium,
		paddingLeft: styles.measurements.gridSpace2,
	},
	icon: {
		padding: 0,
		alignItems: 'flex-end',
	},
});

export default class CouponButtonModal extends Component {

	constructor(props) {
		super(props);

		this.state = {
			couponCode: '',
		};
	}

	renderCoupons() {
		const {coupons, onRemoveCoupon, removeTrackAction} = this.props;

		return coupons.map((coupon, index) => (
			<View
				key={index}
				style={componentStyles.couponRow}
			>
				<Text
					color="accent"
					size="large"
				>
					{coupon.couponCode}
				</Text>
				<IconButton
					accessibilityLabel="Remove Coupon"
					color="white"
					borders={false}
					iconName={helpers.getIcon('close')}
					iconSize="large"
					onPress={() => onRemoveCoupon(coupon.couponCode)}
					style={componentStyles.icon}
					textColor="accent"
					trackAction={removeTrackAction}
				/>
			</View>
		));
	}

	render() {
		const { onAddCoupon } = this.props;
		const { couponCode } = this.state;

		return (
			<View>
				{this.renderCoupons()}
				<View style={componentStyles.content}>
					<Icon
						color={styles.colors.secondary}
						name={helpers.getIcon('pricetag')}
						size={25}
					/>
					<View style={componentStyles.spacer}/>
					<TextInput
						ref={(ref) => this.input = ref}
						autoCapitalize="characters"
						autoCorrect={false}
						autoFocus={true}
						style={componentStyles.input}
						clearButtonMode="always"
						onChangeText={(couponCode) => this.setState({ couponCode })}
						onSubmitEditing={() => onAddCoupon(couponCode)}
						placeholder="Enter Coupon"
						value={couponCode}
						returnKeyType="go"
						underlineColorAndroid="transparent"
						blurOnSubmit={false}
					/>
				</View>
				<KeyboardSpacer />
			</View>
		);
	}
}

CouponButtonModal.propTypes = {
	coupons: PropTypes.array,
	onAddCoupon: PropTypes.func.isRequired,
	onRemoveCoupon: PropTypes.func.isRequired,
	removeTrackAction: PropTypes.string.isRequired,
};
