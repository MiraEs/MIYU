import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import styles from '../lib/styles';
import {
	loadOrderDetails,
	getShippingInfo,
} from '../actions/OrderActions';
import {
	ListView,
	Button,
	withScreen,
	Text,
} from 'BuildLibrary';
import { connect } from 'react-redux';
import { NavigationStyles } from '@expo/ex-navigation';
import { bindActionCreators } from 'redux';
import PurchaseOrder from '../components/PurchaseOrder';
import { BACK_TO_ORDER_DETAILS } from '../lib/analytics/TrackingActions';
import helpers from '../lib/helpers';

const componentStyles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: styles.colors.greyLight,
		paddingHorizontal: styles.measurements.gridSpace1,
	},
	header: {
		paddingVertical: styles.measurements.gridSpace1,
	},
	emptyHeader: {
		paddingVertical: styles.measurements.gridSpace2,
	},
	row: {
		padding: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
	},
	backButton: {
		marginTop: styles.measurements.gridSpace1,
		alignSelf: 'center',
	},
});

export class OrderTrackingScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2,
			}).cloneWithRows(props.shippingInfo ? props.shippingInfo.items || [] : []),
		};
	}

	componentWillReceiveProps({ shippingInfo }) {
		if (shippingInfo !== this.props.shippingInfo) {
			this.setState({ dataSource: this.state.dataSource.cloneWithRows(shippingInfo.items || []) });
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:orderTracking',
		};
	}

	getScreenData = () => {
		const { actions, customerId, orderNumber } = this.props;
		if (!this.props.orderDetails) {
			actions.loadOrderDetails(customerId, orderNumber)
			.then(actions.getShippingInfo(customerId, orderNumber).catch(helpers.noop).done())
			.catch(helpers.noop)
			.done();
		} else {
			actions.getShippingInfo(customerId, orderNumber).catch(helpers.noop).done();
		}
	};

	renderPurchaseOrder = (purchaseOrder) => {
		let itemCount = 0;
		const { orderDetails } = this.props;
		purchaseOrder.cartItems.forEach((item) => {
			itemCount += item.quantity;
		});
		return (
			<PurchaseOrder
				purchaseOrder={purchaseOrder}
				orderDetails={orderDetails}
				itemCount={itemCount}
			/>
		);
	};

	renderHeader = () => {
		if (this.props.shippingInfo.items.length === 0) {
			return (
				<View style={componentStyles.header}>
					<Text
						style={componentStyles.emptyHeader}
						lineHeight={false}
						textAlign="center"
					>
						No tracking information available for this order.
					</Text>
					<Button
						style={componentStyles.backButton}
						text="Go Back"
						onPress={() => this.props.navigator.pop()}
						accessibilityLabel="Go Back Button"
						trackAction={BACK_TO_ORDER_DETAILS}
					/>
				</View>
			);
		} else {
			return (
				<Text
					style={componentStyles.header}
					lineHeight={false}
					family="archer"
					weight="bold"
				>
					ORDER #{this.props.orderNumber}
				</Text>
			);
		}
	};

	renderScreenContent = () => {
		const { error, shippingInfo } = this.props;
		if (!shippingInfo && error) {
			return (
				<Text
					color="error"
					textAlign="center"
				>
					There was an error loading the shipping details for this order.
				</Text>
			);
		}
		return (
			<ListView
				dataSource={this.state.dataSource}
				enableEmptySections={true}
				renderRow={this.renderPurchaseOrder}
				renderHeader={this.renderHeader}
				scrollsToTop={true}
			/>
		);
	};

	render() {
		return (
			<View
				style={[styles.elements.screenWithHeader, componentStyles.screen]}
			>
				{this.renderScreenContent()}
			</View>
		);
	}
}

OrderTrackingScreen.route = {
	styles: {
		...NavigationStyles.SlideVertical,
		gestures: null,
	},
	navigationBar: {
		title: 'Order Tracking',
	},
};

OrderTrackingScreen.propTypes = {
	actions: PropTypes.object,
	customerId: PropTypes.number,
	loading: PropTypes.bool,
	orderNumber: PropTypes.number.isRequired,
	shippingInfo: PropTypes.object,
	error: PropTypes.string,
	title: PropTypes.string,
	navigator: PropTypes.object,
	orderDetails: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
	return {
		customerId: state.userReducer.user.customerId,
		loading: !state.ordersReducer.shippingInfo[ownProps.orderNumber] && !state.ordersReducer.errors.loadShippingInfo,
		shippingInfo: state.ordersReducer.shippingInfo[ownProps.orderNumber] || { items: [] },
		orderDetails: state.ordersReducer.orderDetails[ownProps.orderNumber],
		error: state.ordersReducer.errors.loadShippingInfo,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			loadOrderDetails,
			getShippingInfo,
		}, dispatch),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withScreen(OrderTrackingScreen));
