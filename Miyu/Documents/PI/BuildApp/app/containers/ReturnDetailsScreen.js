import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from '../lib/styles';
import {
	ScrollView,
	withScreen,
	Text,
} from 'BuildLibrary';
import { loadReturnDetails } from '../actions/OrderActions';
import ListHeader from '../components/listHeader';
import CreditCardInfo from '../components/CreditCardInfo';
import Address from '../components/Address';
import helpers from '../lib/helpers';
import CartItemList from '../components/CartItemList';
import { parseCardTypeName } from '../lib/CreditCard';

const componentStyles = StyleSheet.create({
	billingAddress: {
		paddingBottom: styles.measurements.gridSpace2,
		borderBottomColor: styles.colors.greyLight,
		borderBottomWidth: styles.dimensions.borderWidth,
	},
	container: {
		backgroundColor: styles.colors.greyLight,
	},
	section: {
		backgroundColor: styles.colors.white,
		padding: styles.measurements.gridSpace1,
	},
	spacedRow: {
		paddingHorizontal: styles.measurements.gridSpace1,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	total: {
		marginTop: styles.measurements.gridSpace2,
		padding: styles.measurements.gridSpace1,
		borderTopColor: styles.colors.greyLight,
		borderTopWidth: 1,
	},
	detailsView: {
		paddingBottom: styles.measurements.gridSpace2,
	},
	shippingAddress: {
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingBottom: styles.measurements.gridSpace1,
	},
});

export class ReturnDetailsScreen extends Component {

	setScreenTrackingInformation() {
		return {
			name: 'build:app:returndetails',
		};
	}

	getScreenData = () => {
		const { actions, customerId, returnId } = this.props;
		actions.loadReturnDetails(customerId, returnId).catch(helpers.noop).done();
	};

	renderIfDefined = (label, value) => {
		if (value) {
			return <Text>{label}: {value}</Text>;
		}
	};

	renderHeaderDetails = (returnDetails) => {
		return (
			<View style={componentStyles.detailsView}>
				<Text
					selectable={true}
					size="large"
					weight="bold"
				>
					Return #{returnDetails.returnId}
				</Text>
				<Text weight="bold">{returnDetails.status}</Text>
				{this.renderIfDefined('RGA Number', returnDetails.rgaNumber)}
				<Text>Submitted: {helpers.getDateStrictFormat(returnDetails.dateRequested)}</Text>
				{this.renderIfDefined('Issued', helpers.getDateStrictFormat(returnDetails.dateIssued))}
				<Text>Order #: {returnDetails.orderNumber}</Text>
			</View>
		);
	};

	renderCreditCardInfo = () => {
		const { payment } = this.props.returnDetails;
		if (payment) {
			return (
				<CreditCardInfo
					name={payment.name}
					cardType={parseCardTypeName(payment.cardType)}
					lastFour={payment.cardLastFour}
					expDate={payment.cardExpiration}
				/>
			);
		} else {
			return null;
		}
	};

	render() {
		const { error, returnDetails } = this.props;
		if (!returnDetails && error) {
			return (
				<Text
					color="error"
					textAlign="center"
				>
					There was an error loading this return.
				</Text>
			);
		}
		return (
			<ScrollView
				style={componentStyles.container}
				scrollsToTop={true}
			>
				<View style={componentStyles.section}>
					{this.renderHeaderDetails(returnDetails)}
				</View>

				<ListHeader
					text="ITEMS BEING RETURNED"
					background={false}
					border={false}
				/>
				<View style={componentStyles.section}>
					<CartItemList items={returnDetails.cartItems}/>
				</View>

				<ListHeader
					text="SHIPPING ADDRESS"
					background={false}
					border={false}
				/>
				<View style={componentStyles.section}>
					<Address
						address={returnDetails.shippingAddress}
						style={componentStyles.shippingAddress}
					/>
				</View>

				<ListHeader
					text="BILLING INFORMATION"
					background={false}
					border={false}
				/>
				<View style={componentStyles.section}>
					<Address
						address={returnDetails.billingAddress}
						style={[componentStyles.shippingAddress, componentStyles.billingAddress]}
					/>
					{this.renderCreditCardInfo()}
				</View>

				<ListHeader
					text="RETURN SUMMARY"
					background={false}
					border={false}
				/>
				<View style={componentStyles.section}>
					<View style={componentStyles.spacedRow}>
						<Text>Credit Subtotal</Text>
						<Text>{helpers.toUSD(returnDetails.subTotal)}</Text>
					</View>
					<View style={componentStyles.spacedRow}>
						<Text>Tax Credit:</Text>
						<Text>{helpers.toUSD(returnDetails.taxTotal)}</Text>
					</View>
					<View style={componentStyles.spacedRow}>
						<Text>Restocking Fee:</Text>
						<Text>{helpers.toUSD(returnDetails.restockingPercent * returnDetails.subTotal)}</Text>
					</View>
					<View style={[componentStyles.total, componentStyles.spacedRow]}>
						<Text weight="bold">Credit Total:</Text>
						<Text
							weight="bold"
							color="primary"
						>
							{helpers.toUSD(returnDetails.creditTotal)}
						</Text>
					</View>
				</View>
			</ScrollView>
		);
	}

}

ReturnDetailsScreen.route = {
	navigationBar: {
		title: 'Return Summary',
	},
};

ReturnDetailsScreen.propTypes = {
	returnDetails: PropTypes.object,
	actions: PropTypes.object,
	error: PropTypes.string,
	returnId: PropTypes.number.isRequired,
	customerId: PropTypes.number,
	loadingDetails: PropTypes.bool,
	refresh: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
	return {
		loading: !state.ordersReducer.returnDetails[ownProps.returnId] && !state.ordersReducer.errors.loadReturnDetails,
		customerId: state.userReducer.user.customerId,
		error: state.ordersReducer.loadReturnDetails,
		returnDetails: state.ordersReducer.returnDetails[ownProps.returnId] || {},
		refresh: state.errorReducer.refresh,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			loadReturnDetails,
		}, dispatch),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withScreen(ReturnDetailsScreen));
