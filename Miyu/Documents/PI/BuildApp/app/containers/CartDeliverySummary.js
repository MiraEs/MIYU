import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import styles from '../lib/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	IconButton,
	ListView,
	Text,
	withScreen,
} from 'BuildLibrary';
import CartItemInfo from '../components/CartItemInfo';
import { getSessionCartErrors } from '../actions/CartActions';
import {
	getDateStrictFormat,
	getIcon,
} from '../lib/helpers';
import productHelpers from '../lib/productHelpers';
import pluralize from 'pluralize';
import TrackingActions from '../lib/analytics/TrackingActions';

const componentStyles = StyleSheet.create({
	listHeader: {
		backgroundColor: styles.colors.greyLight,
		borderBottomColor: styles.colors.iOSDivider,
		borderBottomWidth: styles.dimensions.borderWidth,
		padding: styles.measurements.gridSpace1,
	},
});

export class CartDeliverySummary extends Component {

	constructor(props) {
		super(props);
		this.sectionHeaders = {
			available: () => {
				const { requestedDeliveryDate } = this.props.cart;
				return (
					<View style={componentStyles.listHeader}>
						<Text
							size="large"
							weight="bold"
							family="archer"
							lineHeight={false}
						>
							Items requiring a scheduled delivery
						</Text>
						<View style={{ paddingTop: styles.measurements.gridSpace1 }}>
							<IconButton
								accessibilityLabel="Select Delivery Date"
								testID="SelectDeliveryDate"
								trackAction={TrackingActions.CART_DELIVERY_SUMMARY_SELECT_DATE}
								textColor="white"
								text={requestedDeliveryDate ? `Requested Delivery: ${getDateStrictFormat(requestedDeliveryDate)}` : 'Select Delivery Date'}
								iconName={getIcon('calendar')}
								onPress={() => props.navigator.push('datePicker', {
									zipCode: props.cart.zipCode,
									itemIds: this.state.available.map((item) => item.id),
									requestedDeliveryDate,
								})}
							/>
						</View>
					</View>
				);
			},
			backordered: () => {
				return (
					<View style={componentStyles.listHeader}>
						<Text
							size="large"
							weight="bold"
							family="archer"
							lineHeight={false}
						>
							Items where delivery cannot be scheduled
						</Text>
						<Text family="archer">When the item is in stock, the vendor will contact you to arrange
							delivery.</Text>
					</View>
				);
			},
			errors: () => {
				const { errors } = this.state;
				return (
					<View style={componentStyles.listHeader}>
						<Text
							size="large"
							weight="bold"
							family="archer"
							lineHeight={false}
						>
							Cart Errors
						</Text>
						<Text family="archer">{`The following ${pluralize('item', errors.length, false)} ${pluralize('has', errors.length, false)} errors. Please call if you need assistance.`}</Text>
					</View>
				);
			},
		};
		this.state = {
			available: [],
			backordered: [],
			errors: [],
			dataSource: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2,
				sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
			}).cloneWithRowsAndSections({}),
		};
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:deliverysummary',
		};
	}

	getScreenData = () => {
		const {
			actions,
			cart: {
				sessionCartId,
				sessionCartItems,
				zipCode,
			},
		} = this.props;

		// Filter out the GE items from the session cart
		const geItems = sessionCartItems.filter((item) => item.product.manufacturer.toLowerCase() === 'ge');

		// Fetch session cart errors, and then use the errors to divide the session cart items into three categories:
		// available, backordered, and error
		const available = [];
		const backordered = [];
		const errors = [];
		actions.getSessionCartErrors(sessionCartId, zipCode).then((sessionCartErrors) => {
			geItems.forEach((item) => {
				if (Array.isArray(sessionCartErrors)) {
					const error = sessionCartErrors.find((error) => error.item.id === item.id);
					if (error) {
						if (error.error === 'IN_TRANSIT') {
							backordered.push(item);
						} else {
							errors.push({
								...item,
								error: productHelpers.parseGeError(error, zipCode),
							});
						}
					} else {
						available.push(item);
					}
				} else {
					available.push(item);
				}
			});
			this.setState({
				available,
				backordered,
				errors,
				dataSource: this.state.dataSource.cloneWithRowsAndSections({
					available,
					backordered,
					errors,
				}),
			});
		});
	};

	renderRow = (item) => {
		return (
			<CartItemInfo
				key={item.itemKey}
				cartItem={item}
			/>
		);
	};

	render() {
		return (
			<ListView
				dataSource={this.state.dataSource}
				renderRow={this.renderRow}
				renderSectionHeader={(data, sectionId) => this.state[sectionId].length ? this.sectionHeaders[sectionId]() : <View />}
				enableEmptySections={true}
			/>
		);
	}

}

CartDeliverySummary.route = {
	navigationBar: {
		visible: true,
		title: 'Schedule Delivery',
	},
};

CartDeliverySummary.propTypes = {
	actions: PropTypes.object,
	cart: PropTypes.object,
	navigator: PropTypes.object,
};

const mapStateToProps = (state) => {
	const { cart } = state.cartReducer;
	return {
		loading: cart.checkingErrors,
		cart,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getSessionCartErrors,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(CartDeliverySummary));
