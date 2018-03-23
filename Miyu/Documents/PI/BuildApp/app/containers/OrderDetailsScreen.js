import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import styles from '../lib/styles';
import {
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadOrderDetails } from '../actions/OrderActions';
import ListHeader from '../components/listHeader';
import {
	ScrollView,
	Button,
	IconButton,
	withScreen,
	Text,
} from 'BuildLibrary';
import Address from '../components/Address';
import OrderSummary from '../components/OrderSummary';
import helpers from '../lib/helpers';
import pluralize from 'pluralize';
import CartItemList from '../components/CartItemList';
import CreditCardInfo from '../components/CreditCardInfo';
import PayPalInfo from '../components/PayPalInfo';
import ApplePayInfo from '../components/ApplePayInfo';
import { parseCardTypeName } from '../lib/CreditCard';
import EventEmitter from '../lib/eventEmitter';
import TrackingActions from '../lib/analytics/TrackingActions';
import { addOrderToProject } from '../actions/ProjectEventActions';
import { getProjects } from '../actions/ProjectActions';
import {
	CREDIT_CARD,
	PAYPAL,
	APPLE_PAY,
} from '../constants/CheckoutConstants';
import { showAlert } from '../actions/AlertActions';
import { setOrderToReturn } from '../actions/ReturnsActions';
import PhoneHelper from '../lib/PhoneHelper';
import ReturnPolicyLink from '../components/Returns/ReturnPolicyLink';

const componentStyles = StyleSheet.create({
	billingAddress: {
		paddingBottom: styles.measurements.gridSpace2,
		borderBottomColor: styles.colors.greyLight,
		borderBottomWidth: styles.dimensions.borderWidth,
	},
	cartItemList: {
		paddingBottom: styles.measurements.gridSpace1,
	},
	container: {
		backgroundColor: styles.colors.greyLight,
	},
	borderBottom: {
		paddingBottom: styles.measurements.gridSpace2,
		borderBottomWidth: styles.measurements.borderWidth,
		borderBottomColor: styles.colors.greyLight,
	},
	buttonWrapper: {
		flex: 1,
	},
	orderDetails: {
		flexDirection: 'row',
	},
	paymentLabel: {
		paddingHorizontal: styles.measurements.gridSpace1,
		marginTop: styles.measurements.gridSpace2,
	},
	section: {
		backgroundColor: styles.colors.white,
		padding: styles.measurements.gridSpace1,
	},
	logo: {
		marginTop: styles.measurements.gridSpace1,
		width: 80,
		height: 40,
	},
	returnTextContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: styles.measurements.gridSpace2,
	},
	shippingAddress: {
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingBottom: styles.measurements.gridSpace1,
	},
	button: {
		marginTop: styles.measurements.gridSpace1,
	},
	returnPolicy: {
		paddingBottom: styles.measurements.gridSpace1,
	},
});

export class OrderDetailsScreen extends Component {

	setScreenTrackingInformation() {
		return {
			name: 'build:app:orderdetails',
		};
	}

	getScreenData = () => {
		const {
			actions,
			user: { customerId },
			orderNumber,
		} = this.props;
		actions.getProjects().catch(helpers.noop).done();
		actions.loadOrderDetails(customerId, orderNumber).catch(helpers.noop).done();
	};

	isCanceled = () => {
		const { orderStatus } = this.props.orderDetails;
		return !orderStatus || orderStatus.toLowerCase() === 'cancelled';
	}

	onAddToProjectPress = () => {
		const {
			actions,
			user: { customerId },
			order: { projectName },
			orderNumber,
			projects,
		} = this.props;

		const activeProjects = projects.active ? projects.active.myProjects.concat(projects.active.sharedProjects) : [];
		const archivedProjects = projects.archived ? projects.archived.myProjects.concat(projects.archived.sharedProjects) : [];
		if (projectName) {
			const project = activeProjects.concat(archivedProjects).find((current) => current.name === projectName);
			if (project) {
				this.props.navigator.push('feed', {
					order: { orderNumber },
					projectId: project.projectId,
				});
			}
			return;
		}
		const options = [
			{
				text: 'Create a New Project...',
				onPress: () => this.props.navigator.push('newProject', {
					orderNumber,
				}),
			},
		].concat(
			activeProjects.map((project) => {
				return {
					text: project.name,
					onPress: () => {
						actions.addOrderToProject({
							projectId: project.id,
							order: {
								orderNumber,
							},
							customerId,
						}).then(() => {
							this.props.actions.showAlert('Order Added to Project');
						}).done();
					},
				};
			}));
		EventEmitter.emit('showActionSheet', {
			title: 'Select Project',
			options,
		});
	};

	onSetupReturnPress = () => {
		this.props.actions.setOrderToReturn(this.props.orderDetails.cartItems);
		this.props.navigator.push('selectItemsForReturn');
	};

	onTrackOrderPress = () => {
		const { orderNumber } = this.props;
		this.props.navigator.push('orderTracking', {
			title: 'Tracking Details',
			orderNumber,
		});
	};

	renderAddToProjectButton = () => {
		const { order: { projectName }} = this.props;
		return (
			<IconButton
				accessibilityLabel="Project Button"
				color="white"
				iconName="md-folder"
				onPress={this.onAddToProjectPress}
				style={componentStyles.button}
				text={projectName ? projectName : 'Add to Project'}
				textColor="secondary"
				trackAction={TrackingActions.ORDER_DETAILS_ADD_TO_PROJECT}
			/>
		);
	};

	renderBillingAddress = () => {
		const { orderDetails } = this.props;
		if (orderDetails && orderDetails.billingAddress) {
			return (
				<View>
					<Address
						address={orderDetails.billingAddress}
						style={[componentStyles.shippingAddress, componentStyles.billingAddress]}
					/>
					<Text
						weight="bold"
						style={componentStyles.paymentLabel}
					>
						Payment
					</Text>
				</View>
			);
		}
	};

	renderCreditCardInfo = () => {
		const { orderDetails } = this.props;
		const { payment } = orderDetails || {};

		if (payment && payment.paymentType === CREDIT_CARD) {
			return (
				<CreditCardInfo
					name={payment.name}
					cardType={parseCardTypeName(payment.cardType)}
					lastFour={payment.cardLastFour}
					expDate={payment.cardExpiration}
				/>
			);
		}

		if (payment && payment.paymentType === PAYPAL) {
			return <PayPalInfo paid={true}/>;
		}

		if (payment && payment.paymentType === APPLE_PAY) {
			return (
				<ApplePayInfo paid={true}/>
			);
		}

		return <View style={componentStyles.section}/>;
	};

	renderHeaderDetails = (order) => {
		return (
			<View>
				<Text
					selectable={true}
					size="large"
					weight="bold"
				>
					Order #{order.orderNumber}
				</Text>
				<Text weight="bold">{order.orderStatus || 'Unknown'}</Text>
				<Text>Placed On: {helpers.getDateStrictFormat(order.orderDate)}</Text>
				<Text>{pluralize('Item', order.itemCount, true)}</Text>
				<Text>Total: {helpers.toUSD(order.total)}</Text>
				{this.renderPurchaseInfo()}
			</View>
		);
	};

	renderPaymentInformation = () => {
		const { orderDetails } = this.props;
		if (orderDetails && (orderDetails.billingAddress || orderDetails.payment)) {
			return (
				<View>
					<ListHeader
						text="BILLING INFORMATION"
						background={false}
						border={false}
					/>
					<View style={componentStyles.section}>
						{this.renderBillingAddress()}
						{this.renderCreditCardInfo()}
					</View>
				</View>
			);
		}
	};

	renderPurchaseInfo = () => {
		const { orderDetails: { purchasedFrom } } = this.props;
		if (purchasedFrom) {
			return <Text>Purchased On: {purchasedFrom}</Text>;
		}
	}

	renderReturnsButton = () => {
		if (this.props.returnsFeature && !this.isCanceled()) {
			return (
				<Button
					style={componentStyles.button}
					color="white"
					textColor="secondary"
					text="Setup Return"
					onPress={this.onSetupReturnPress}
					trackAction="Test"
					accessibilityLabel="Setup Return"
				/>
			);
		}
	}

	renderTrackingButton = () => {
		if (!this.isCanceled()) {
			return (
				<Button
					style={componentStyles.button}
					color="primary"
					text="Track Shipment"
					onPress={this.onTrackOrderPress}
					trackAction={TrackingActions.ORDER_DETAILS_TRACK_ORDER}
					accessibilityLabel="Track Shipment"
				/>
			);
		}
	};

	renderReturnText = () => {
		const { user } = this.props;
		if (!this.isCanceled()) {
			if (this.props.returnsFeature) {
				return (
					<ReturnPolicyLink style={componentStyles.returnPolicy} />
				);
			}

			const phone = PhoneHelper.getPhoneNumberByUserType(user);
			return (
				<View style={componentStyles.returnTextContainer}>
					<Text
						size="small"
						lineHeight={false}
					>
						Call{' '}
					</Text>
					<TouchableOpacity onPress={() => EventEmitter.emit('onCallUs', phone)}>
						<Text
							size="small"
							lineHeight={false}
							color="primary"
						>
							{PhoneHelper.formatPhoneNumber(phone)}
						</Text>
					</TouchableOpacity>
					<Text
						size="small"
						lineHeight={false}
					>
						{' '}to setup a return
					</Text>
				</View>
			);
		}
	};

	render() {
		const {
			error,
			orderDetails,
			user: { tierInfo = {} },
		} = this.props;

		if (!orderDetails && error) {
			return (
				<Text
					color="error"
					textAlign="center"
				>
					There was an error loading this order.
				</Text>
			);
		}

		return (
			<ScrollView
				style={componentStyles.container}
				scrollsToTop={true}
			>
				<View style={componentStyles.section}>
					{this.renderHeaderDetails(orderDetails)}
					<View style={componentStyles.buttonWrapper}>
						{this.renderTrackingButton()}
						{this.renderReturnsButton()}
						{this.renderAddToProjectButton()}
					</View>
					{this.renderReturnText()}
				</View>

				<ListHeader
					text="ITEM DETAILS"
					background={false}
					border={false}
				/>
				<View style={componentStyles.section}>
					<CartItemList items={orderDetails.cartItems}/>
				</View>

				<ListHeader
					text="SHIPPING ADDRESS"
					background={false}
					border={false}
				/>
				<View style={componentStyles.section}>
					<Address
						address={orderDetails.shippingAddress}
						style={componentStyles.shippingAddress}
					/>
				</View>

				{this.renderPaymentInformation()}

				<ListHeader
					text="ORDER SUMMARY"
					background={false}
					border={false}
				/>
				<View style={componentStyles.section}>
					<OrderSummary
						order={orderDetails}
						rewardTierName={tierInfo.topTierName}
					/>
				</View>
			</ScrollView>
		);
	}

}

OrderDetailsScreen.route = {
	navigationBar: {
		title: 'Order Summary',
	},
};

OrderDetailsScreen.propTypes = {
	actions: PropTypes.object,
	error: PropTypes.string,
	loading: PropTypes.bool,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
	order: PropTypes.object,
	orderDetails: PropTypes.object,
	orderNumber: PropTypes.number.isRequired,
	projects: PropTypes.object,
	returnsFeature: PropTypes.bool,
	user: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
	const { orders } = state.ordersReducer;
	const order = orders.find((order) => order.orderNumber === ownProps.orderNumber) || {};

	return {
		order,
		error: state.ordersReducer.errors.loadOrderDetails,
		loading: !state.ordersReducer.orderDetails[ownProps.orderNumber] && !state.ordersReducer.errors.loadOrderDetails,
		orderDetails: state.ordersReducer.orderDetails[ownProps.orderNumber] || {},
		projects: state.projectsReducer.projects,
		returnsFeature: state.featuresReducer.features.returns,
		user: state.userReducer.user,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			addOrderToProject,
			getProjects,
			loadOrderDetails,
			setOrderToReturn,
			showAlert,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(OrderDetailsScreen));
