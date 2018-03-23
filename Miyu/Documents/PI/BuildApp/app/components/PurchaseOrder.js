import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import {
	ListView,
	Image,
	Text,
} from 'BuildLibrary';
import { withNavigation } from '@expo/ex-navigation';
import {
	IMAGE_75,
	PRODUCT_SECTION,
} from '../constants/CloudinaryConstants';
import ShippingTrackingDetails from '../components/ShippingTrackingDetails';
import styles from '../lib/styles';
import pluralize from 'pluralize';
import helpers from '../lib/helpers';

const componentStyles = StyleSheet.create({
	borderTop: {
		borderTopColor: styles.colors.greyLight,
		borderTopWidth: styles.dimensions.borderWidth,
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingVertical: styles.measurements.gridSpace2,
	},
	cartItem: {
		paddingHorizontal: styles.measurements.gridSpace1,
		alignItems: 'center',
	},
	smallSection: {
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.greyLight,
		padding: styles.measurements.gridSpace1,
	},
	sectionNoBorder: {
		paddingVertical: styles.measurements.gridSpace2,
	},
	paddingHorizontal: {
		paddingHorizontal: styles.measurements.gridSpace1,
	},
	row: {
		backgroundColor: styles.colors.white,
		marginBottom: styles.measurements.gridSpace1,
	},
});

@withNavigation
export default class PurchaseOrder extends Component {

	constructor(props) {
		super(props);
		this.state = {
			itemListWidth: 0,
			ds: new ListView.DataSource({
				rowHasChanged: () => true,
			}),
		};
	}

	renderFinish = (cartItem) => {
		if (cartItem.finish.toLowerCase() !== 'n/a') {
			return (
				<View style={styles.elements.centeredFlexRow}>
					<Text
						size="small"
						weight="bold"
					>
						Finish:
					</Text>
					<Text size="small"> {cartItem.finish}</Text>
				</View>
			);
		}
	};

	renderCartItem = (cartItem) => {
		const { orderDetails } = this.props;
		const imageUri = helpers.getCloudinaryImageUrl({
			name: cartItem.image,
			manufacturer: cartItem.manufacturer,
			section: PRODUCT_SECTION,
			...IMAGE_75,
		});
		const itemInfo = orderDetails.cartItems.find((item) => {
			return item.productCompositeId === cartItem.productCompositeId;
		});
		return (
			<View style={componentStyles.cartItem}>
				<TouchableOpacity
					style={styles.elements.centeredFlexColumn}
					onPress={() => {
						this.props.navigator.push('productDetail', {
							compositeId: itemInfo.productCompositeId,
							uniqueId: itemInfo.productUniqueId,
						});
					}}
				>
					<Image
						source={imageUri}
						{...IMAGE_75}
					/>
					<Text
						color="primary"
						weight="bold"
					>
						{itemInfo.manufacturer} {itemInfo.productId}
					</Text>
				</TouchableOpacity>
				{this.renderFinish(cartItem)}
				<View style={styles.elements.centeredFlexRow}>
					<Text
						size="small"
						weight="bold"
					>
						Qty:
					</Text>
					<Text size="small"> {cartItem.quantity}</Text>
				</View>
			</View>
		);
	};

	renderShippingTrackingDetails = (tracking) => {
		return (
			<ShippingTrackingDetails shippingTrackingDetails={tracking}/>
		);
	};

	render() {
		const { itemCount, purchaseOrder } = this.props;
		const { ds } = this.state;
		const { cartItems, shippingTrackingDetails } = purchaseOrder;
		return (
			<View style={componentStyles.row}>
				<View style={componentStyles.smallSection}>
					<Text
						size="small"
						lineHeight={false}
					>
						{pluralize('item', itemCount, true)} included
						in {pluralize('this', shippingTrackingDetails.length || 1, false)} {pluralize('shipment', shippingTrackingDetails.length || 1, false)}
					</Text>
				</View>

				<View style={componentStyles.sectionNoBorder}>
					<ListView
						enableEmptySections={true}
						dataSource={ds.cloneWithRows(cartItems)}
						renderRow={this.renderCartItem}
						horizontal={true}
						showsHorizontalScrollIndicator={false}
					/>
				</View>

				<View>
					<ListView
						enableEmptySections={true}
						dataSource={ds.cloneWithRows(purchaseOrder.shippingTrackingDetails)}
						renderRow={this.renderShippingTrackingDetails}
						scrollEnabled={false}
					/>
				</View>
			</View>
		);
	}

}

PurchaseOrder.propTypes = {
	purchaseOrder: PropTypes.object,
	itemCount: PropTypes.number,
	orderDetails: PropTypes.object,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
};
