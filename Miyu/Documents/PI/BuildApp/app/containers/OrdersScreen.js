import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import styles from '../lib/styles';
import {
	FlatList,
	StyleSheet,
	View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	withScreen,
	Text,
} from 'BuildLibrary';
import helpers from '../lib/helpers';
import { loadOrders } from '../actions/OrderActions';
import pluralize from 'pluralize';
import {
	PRODUCT_SECTION,
	IMAGE_75,
} from '../constants/CloudinaryConstants';
import OrderListItem from '../components/OrderListItem';

const componentStyles = StyleSheet.create({
	list: {
		backgroundColor: styles.colors.lightGray,
		paddingHorizontal: styles.measurements.gridSpace1,
	},
	topBar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
});

export class OrdersScreen extends Component {

	getScreenData = () => {
		const { actions, customerId } = this.props;
		actions.loadOrders(customerId).catch(helpers.noop).done();
	};

	setScreenTrackingInformation() {
		return {
			name: 'build:app:more:orders',
		};
	}

	orderKeyExtractor(order) {
		return order.orderNumber;
	}

	viewOrder = (order) => {
		this.props.navigator.push('orderDetails', {
			orderNumber: order.orderNumber,
		});
	};

	renderOrderHeader = (order) => {
		return (
			<View style={componentStyles.topBar}>
				<Text
					capitalize="first"
					weight="bold"
				>
					{order.friendlyStatus.status}
				</Text>
			</View>
		);
	};

	renderOrder = ({ item: order }) => {
		const details = [
			`Order #${order.orderNumber}`,
			pluralize('item', order.itemCount, true),
		];
		if (order.total) {
			details.push(`Total: ${helpers.toUSD(order.total)}`);
		}
		details.push(helpers.getDateStrictFormat(order.orderDate));
		const imageUri = helpers.getCloudinaryImageUrl({
			...IMAGE_75,
			section: PRODUCT_SECTION,
			name: order.productImage,
		});

		return (
			<OrderListItem
				renderHeader={() => this.renderOrderHeader(order)}
				image={{ uri: imageUri }}
				title={order.orderStatus}
				details={details}
				projectName={order.projectName}
				onPress={() => this.viewOrder(order)}
			/>
		);
	};

	render() {
		const { error, orders } = this.props;
		let content;
		if (!orders && error) {
			content = (
				<Text
					textAlign="center"
					color="error"
				>
					{error}
				</Text>
			);
		} else {
			content = (
				<FlatList
					data={this.props.orders}
					ListEmptyComponent={<Text textAlign="center">There are no orders to display.</Text>}
					keyExtractor={this.orderKeyExtractor}
					renderItem={this.renderOrder}
					style={componentStyles.list}
				/>
			);
		}

		return (
			<View style={styles.elements.flex1}>
				{content}
			</View>
		);
	}
}

OrdersScreen.propTypes = {
	loading: PropTypes.bool,
	customerId: PropTypes.number,
	error: PropTypes.string,
	orders: PropTypes.array,
	actions: PropTypes.object,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
};

OrdersScreen.route = {
	navigationBar: {
		title: 'Orders',
	},
};

const mapStateToProps = (state) => {
	return {
		loading: state.ordersReducer.loadingOrders && !state.ordersReducer.orders.length,
		error: state.ordersReducer.loadOrders,
		customerId: state.userReducer.user.customerId,
		orders: state.ordersReducer.orders,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			loadOrders,
		}, dispatch),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withScreen(OrdersScreen));
