import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	LayoutAnimation,
	StyleSheet,
	TouchableOpacity,
	View,
	ViewPropTypes,
} from 'react-native';
import {
	Image,
	Text,
} from 'BuildLibrary';
import {
	IMAGE_75,
	PRODUCT_SECTION,
} from '../constants/CloudinaryConstants';
import LoadingView from './LoadingView';
import ProductShortDescription from './productDetail/ProductShortDescription';
import StarRating from 'react-native-star-rating';
import SwatchList from './SwatchList';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import { connect } from 'react-redux';
import productsActions from '../actions/ProductsActions';
import { bindActionCreators } from 'redux';

const componentStyles = StyleSheet.create({
	image: {
		marginRight: styles.measurements.gridSpace1,
		alignSelf: 'center',
	},
	loading: {
		alignItems: 'center',
		justifyContent: 'center',
		height: styles.measurements.gridSpace9,
	},
	expandedHeader: {
		paddingHorizontal: styles.measurements.gridSpace1,
		justifyContent: 'space-between',
		flexDirection: 'row',
	},
	mainContent: {
		flexDirection: 'row',
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingBottom: styles.measurements.gridSpace1,
	},
	row: {
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingTop: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
	},
	rating: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	shortDescription: {
		paddingBottom: 0,
	},
	subItem: {
		backgroundColor: styles.colors.greyLight,
		borderColor: styles.colors.greyDark,
		borderLeftWidth: 2,
		paddingRight: 0,
		marginBottom: styles.measurements.gridSpace1,
	},
});

class ExpandableCartItem extends Component {

	constructor(props) {
		super(props);
		this.state = {
			expanded: false,
			swatchListWidth: 0,
		};
	}

	componentWillReceiveProps({ productDetails }) {
		if (this.props.productDetails !== productDetails) {
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		}
	}

	renderExpandedView = (product) => {
		const { productDetails } = this.props;
		if (this.state.expanded) {
			if (!productDetails) {
				return (
					<View style={componentStyles.loading}>
						<LoadingView backgroundColor={styles.colors.none}/>
					</View>
				);
			} else {
				return (
					<View>
						<View style={componentStyles.expandedHeader}>
							<View
								style={styles.elements.flex1}
								onLayout={(event) => {
									this.setState({
										swatchListWidth: event.nativeEvent.layout.width,
									});
								}}
							>
								<SwatchList
									selectedFinishId={product.uniqueId}
									finishes={productDetails.finishes}
									width={this.state.swatchListWidth}
								/>
							</View>
							<View style={componentStyles.rating}>
								<StarRating
									disabled={true}
									maxStars={5}
									emptyStar="ios-star-outline"
									fullStar="ios-star"
									halfStar="ios-star-half"
									iconSet="Ionicons"
									rating={productDetails.reviewRating.avgRating || 0}
									starColor={styles.colors.accent}
									starSize={14}
									selectedStar={helpers.noop}
								/>
								<Text size="small"> ({productDetails.reviewRating.numReviews})</Text>
							</View>
						</View>
						<ProductShortDescription
							style={componentStyles.shortDescription}
							series={productDetails.series}
							specifications={productDetails.topProductSpecs}
							title={productDetails.title}
							freeShipping={product.freeShipping === 'Y'}
						/>
					</View>
				);
			}
		}
		return null;
	};

	renderSubItems = (item) => {
		if (item.hasSubItems) {
			return item.subItems.map((subItem, index) => {
				return (
					<ExpandableCartItem
						hidePricing={this.props.hidePricing}
						item={subItem}
						isSubItem={true}
						productDetails={this.props.products[subItem.product.productCompositeId]}
						key={index}
						actions={this.props.actions}
						style={componentStyles.subItem}
					/>
				);
			});
		}
	};

	onRowTap = (product) => {
		const { actions, productDetails } = this.props;
		const { expanded } = this.state;
		if (!expanded && !productDetails) {
			const { productCompositeId, uniqueId } = product;
			actions.getProductComposite({
				compositeId: productCompositeId,
				uniqueId,
			})
			.catch(helpers.noop)
			.done();
		}
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		this.setState({ expanded: !expanded });
	};

	renderQuantity = (item) => {
		if (!this.props.hidePricing) {
			return (
				<Text size="small">{helpers.toUSD(item.unitPrice)} (Qty. {item.quantity})</Text>
			);
		} else {
			return (
				<Text size="small">(Qty. {item.quantity})</Text>
			);
		}
	};

	renderTotal = (item) => {
		if (!this.props.hidePricing) {
			return (
				<Text
					weight="bold"
					color="primary"
					textAlign="right"
				>
					{helpers.toUSD(item.unitPrice * item.quantity)}
				</Text>
			);
		}
	};

	render() {
		const { item } = this.props, { product } = item;
		const uri = helpers.getCloudinaryImageUrl({
			section: PRODUCT_SECTION,
			manufacturer: product.manufacturer,
			name: product.image,
			...IMAGE_75,
		});
		return (
			<View style={[componentStyles.row, this.props.style]}>
				<TouchableOpacity
					onPress={() => this.onRowTap(product)}
					activeOpacity={0.8}
				>
					<View style={componentStyles.mainContent}>
						<Image
							style={componentStyles.image}
							source={{ uri }}
							{...IMAGE_75}
						/>
						<View style={styles.elements.flex1}>
							<Text weight="bold">{product.displayName}</Text>
							<Text size="small">Finish: <Text
								size="small"
								weight="bold"
							>{product.finish}</Text></Text>
							{this.renderQuantity(item)}
							{this.renderTotal(item)}
						</View>
					</View>
					{this.renderExpandedView(product)}
				</TouchableOpacity>
				{this.renderSubItems(item)}
			</View>
		);
	}

}

ExpandableCartItem.propTypes = {
	actions: PropTypes.object,
	hidePricing: PropTypes.bool,
	item: PropTypes.object.isRequired,
	isSubItem: PropTypes.bool,
	productDetails: PropTypes.object,
	products: PropTypes.object,
	style: ViewPropTypes.style,
};

ExpandableCartItem.defaultProps = {
	hidePricing: false,
};

const mapStateToProps = (state, ownProps) => {
	const { productCompositeId } = ownProps.item.product;
	return {
		products: state.productsReducer,
		productDetails: state.productsReducer[productCompositeId],
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getProductComposite: productsActions.getProductComposite,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpandableCartItem);
