'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Image,
	TouchableHighlight,
	StyleSheet,
} from 'react-native';
import { Text } from 'BuildLibrary';
import styles from '../../lib/styles';
import { withNavigation } from '@expo/ex-navigation';

const ITEMS_TO_SHOW = 3;

const componentStyles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	productItem: {
		borderColor: styles.colors.mediumGray,
		borderWidth: styles.dimensions.borderWidth,
		width: (styles.dimensions.width / 2) - (styles.measurements.gridSpace2 * 2),
		height: 172,
		padding: styles.measurements.gridSpace1,
		marginTop: styles.measurements.gridSpace1,
	},
	productImage: {
		width: 90,
		height: 90,
		alignSelf: 'center',
	},
	productTitle: {
		marginVertical: styles.measurements.gridSpace1,
	},
	moreButton: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: styles.colors.lightGray,
	},
});

@withNavigation
class ProductList extends Component {

	constructor(props) {
		super(props);

		this.state = {
			showProducts: true,
		};
	}

	componentWillMount() {
		if (!this.props.products) {
			this.setState({
				showProducts: false,
			});
		}
	}

	getExtraProductCount = () => {
		return this.props.products.length - ITEMS_TO_SHOW;
	};

	navigateToProduct = (product) => {
		this.props.navigator.push('productDetail', {
			compositeId: product.productCompositeId,
			manufacturer: product.manufacturer,
			finish: product.finish,
			sku: product.sku,
			uniqueId: product.uniqueId,
		});
	};

	navigateToMore = () => {
		const { event } = this.props;
		if (event && event.orderNumber) {
			this.props.navigator.push('orderDetails', {
				orderNumber: event.orderNumber,
			});
		} else if (event && event.favoriteId) {
			this.props.navigator.push('favoritesList', {
				favoriteId: event.favoriteId,
			});
		}
	};

	renderProductItem = () => {
		return this.props.products.map((product, index, products) => {
			if (index < ITEMS_TO_SHOW || (index === ITEMS_TO_SHOW && products.length - 1 === ITEMS_TO_SHOW)) {
				return (
					<TouchableHighlight
						key={`product-tile-${index}`}
						onPress={this.navigateToProduct.bind(this, product)}
					>
						<View
							key={index}
							style={componentStyles.productItem}
						>
							<Image
								resizeMode="contain"
								source={{ uri: product.image }}
								style={componentStyles.productImage}
							/>
							<Text
								numberOfLines={1}
								weight="bold"
							>
								{product.manufacturer} {product.productId}
							</Text>
							<Text
								numberOfLines={2}
								size="small"
							>
								{product.title}
							</Text>
						</View>
					</TouchableHighlight>
				);
			} else if (index === ITEMS_TO_SHOW) {
				return (
					<TouchableHighlight
						onPress={this.navigateToMore}
						key={`more-${index}`}
						style={[componentStyles.productItem, componentStyles.moreButton]}
						underlayColor={styles.colors.mediumGray}
					>
						<View>
							<Text
								weight="bold"
								textAlign="center"
							>
								+ {this.getExtraProductCount()}
							</Text>
							<Text
								weight="bold"
								textAlign="center"
							>
								More
							</Text>
						</View>
					</TouchableHighlight>
				);
			}
		});
	};

	render() {

		if (!this.state.showProducts) {
			return null;
		}

		return (
			<View style={componentStyles.container}>
				{this.renderProductItem()}
			</View>
		);
	}

}

ProductList.propTypes = {
	products: PropTypes.array.isRequired,
	event: PropTypes.object.isRequired,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
};

module.exports = ProductList;
