import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import {
	ListView,
	Image,
} from 'BuildLibrary';
import { Text } from 'build-library';
import {
	IMAGE_75,
	PRODUCT_SECTION,
} from '../constants/CloudinaryConstants';
import { withNavigation } from '@expo/ex-navigation';

const componentStyles = StyleSheet.create({
	border: {
		borderBottomColor: styles.colors.greyLight,
		borderBottomWidth: styles.dimensions.borderWidth,
	},
	detailsContainer: {
		flex: 1,
		paddingHorizontal: styles.measurements.gridSpace1,
	},
	itemContainer: {
		flexDirection: 'row',
		paddingVertical: styles.measurements.gridSpace1,
	},
});

@withNavigation
export default class CartItemList extends Component {

	getRowStyle = (item) => {
		const styles = [componentStyles.itemContainer];
		const { items } = this.props;
		if (item !== items[items.length - 1]) {
			styles.push(componentStyles.border);
		}
		return styles;
	};

	goToProduct = (item) => {
		this.props.navigator.push('productDetail', {
			compositeId: item.productCompositeId,
			uniqueId: item.productUniqueId,
			manufacturer: item.manufacturer,
			finish: item.finish,
			sku: item.sku,
		});
	};

	renderCartItem = (item) => {
		const imageUri = helpers.getCloudinaryImageUrl({
			name: item.image,
			manufacturer: item.manufacturer,
			section: PRODUCT_SECTION,
			...IMAGE_75,
		});
		return (
			<TouchableOpacity
				style={this.getRowStyle(item)}
				onPress={() => this.goToProduct(item)}
			>
				<Image
					source={imageUri}
					{...IMAGE_75}
				/>
				<View style={componentStyles.detailsContainer}>
					<Text
						weight="bold"
						lineHeight={Text.sizes.regular}
					>
						{item.manufacturer} {item.productId} {item.title}
					</Text>
					<Text>{helpers.toUSD(item.unitPrice)}</Text>
					<Text>(Qty. {item.quantity})</Text>
					<Text
						weight="bold"
						size="small"
						textAlign="right"
					>
						{'Item Total: '}
						<Text
							color="primary"
							size="regular"
						>
							{helpers.toUSD(item.extendedPrice)}
						</Text>
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	render() {
		const ds = new ListView.DataSource({
			rowHasChanged: () => true,
		});
		return (
			<ListView
				enableEmptySections={true}
				renderRow={this.renderCartItem}
				dataSource={ds.cloneWithRows(this.props.items)}
				scrollEnabled={false}
			/>
		);
	}

}

CartItemList.propTypes = {
	items: PropTypes.array.isRequired,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
};

CartItemList.defaultProps = {
	items: [],
};
