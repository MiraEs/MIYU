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
	Text,
	Image,
	Button,
} from 'BuildLibrary';
import EventEmitter from '../../lib/eventEmitter';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';
import {
	IMAGE_75,
	PRODUCT_SECTION,
} from '../../constants/CloudinaryConstants';
import {
	AVAILABLE_BY_LOCATION,
	SQUARE_FOOTAGE_BASED,
	HAS_OPTION_GROUPS,
} from '../../constants/CartConstants';
import TrackingActions from '../../lib/analytics/TrackingActions';
import AddToCartSelector from '../../components/AddToCartSelector';

const componentStyles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		padding: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
	},
	content: {
		flex: 1,
		marginLeft: styles.measurements.gridSpace1,
	},
	addToCart: {
		flex: 1,
		marginLeft: styles.dimensions.borderWidth,
	},
	buttons: {
		flexDirection: 'row',
	},
	price: {
		marginVertical: styles.measurements.gridSpace1,
	},
	selectorModeOn: {
		flex: 0.7,
	},
	selectorModeOff: {
		width: 44,
	},
});

export default class FavoritesRow extends Component {

	constructor(props) {
		super(props);
		this.state = {
			quantity: props.product.squareFootageBased ? 0 : 1,
			selectorMode: false,
		};
	}

	onUpdateQuantity = (quantity) => {
		this.setState({ quantity });
	};

	isDiscontinuedProduct = (product) => {
		// Check if the product has any finish in stock
		const inStockFinish = product.finishes.find((finish) => {
			return finish.status && finish.status.toLowerCase() !== 'discontinued';
		});
		return !inStockFinish;
	};

	renderAddToCartSelector = (product, onSelectRow, finish) => {
		if (this.isDiscontinuedProduct(product)) {
			return (
				<Text color="error">DISCONTINUED</Text>
			);
		} else {
			if (finish === undefined || finish.status.toLowerCase() === 'discontinued') {
				return (
					<View>
						<Text color="error">DISCONTINUED FINISH</Text>
						<Button
							textColor="secondary"
							color="white"
							onPress={this.props.onChangeFinish}
							text="Change Finish"
							accessibilityLabel="Change Finish Button"
							style={styles.elements.noFlex}
							trackAction={TrackingActions.FAVORITE_CHANGE_FINISH}
						/>
					</View>
				);
			} else if (product.type && product.type.toLowerCase() === 'paint') {
				return (
					<View>
						<Button
							text="Call to Order"
							color="primary"
							onPress={() => EventEmitter.emit('onCallUs')}
							accessibilityLabel="Call To Order Button"
							trackAction={TrackingActions.PDP_CALL_TO_ORDER_ITEM}
							trackContextData={this.state.addToCartTrackData}
						/>
					</View>
				);
			} else {
				return (
					<AddToCartSelector
						productConfigurationId={this.props.productConfigurationId}
						onOptionsNotValid={onSelectRow}
						hideQuantitySelector={product.squareFootageBased}
						onSquareFootageBased={() => onSelectRow({ requirement: SQUARE_FOOTAGE_BASED })}
						onHasOptionGroups={(requiredSelectedOptions) => onSelectRow({
							requirement: HAS_OPTION_GROUPS,
							quantity: this.state.quantity,
							requiredSelectedOptions,
						})}
						onUpdateQuantity={this.onUpdateQuantity}
						quantity={this.state.quantity}
						trackAction={TrackingActions.FAVORITE_ADD_TO_CART}
						selectedFinish={finish}
						onAvailableByLocation={() => onSelectRow({ requirement: AVAILABLE_BY_LOCATION })}
					/>
				);
			}
		}
	};

	render() {
		const { onSelectRow, product } = this.props;
		const finish = product.finishes.find((cur) => {
			return product.uniqueId === cur.uniqueId;
		});
		let fallbackFinish;
		if (!finish) {
			fallbackFinish = product.finishes[0];
		}
		const uri = helpers.getCloudinaryImageUrl({
			section: PRODUCT_SECTION,
			manufacturer: product.manufacturer,
			name: finish ? finish.image : fallbackFinish.image,
			...IMAGE_75,
		});
		return (
			<View style={componentStyles.row}>
				<TouchableOpacity onPress={onSelectRow}>
					<Image
						source={{ uri }}
						{...IMAGE_75}
					/>
				</TouchableOpacity>
				<View style={componentStyles.content}>
					<TouchableOpacity
						onPress={onSelectRow}
						accessibilityLabel={product.productId}
					>
						<Text
							weight="bold"
							lineHeight={false}
						>
							{product.manufacturer} {product.productId}
						</Text>
						<Text>{product.title}</Text>
						<Text
							weight="bold"
							color="primary"
							style={componentStyles.price}
							lineHeight={false}
						>
							{finish ? helpers.toUSD(finish.cost) : 'Unavailable'}
						</Text>
					</TouchableOpacity>
					{this.renderAddToCartSelector(product, onSelectRow, finish)}
				</View>
			</View>
		);
	}
}

FavoritesRow.propTypes = {
	product: PropTypes.object,
	sessionCartId: PropTypes.number,
	actions: PropTypes.object,
	onDelete: PropTypes.func.isRequired,
	onSelectRow: PropTypes.func.isRequired,
	productConfigurationId: PropTypes.string,
	onChangeFinish: PropTypes.func.isRequired,
};
