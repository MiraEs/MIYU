'use strict';

import {
	View,
	TouchableHighlight,
	StyleSheet,
} from 'react-native';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import { withNavigation } from '@expo/ex-navigation';
import {
	Image,
	ListView,
	Text,
} from 'BuildLibrary';
import SwatchImage from './SwatchImage';
import StarRating from 'react-native-star-rating';
import {
	SEARCH_GALLERY,
	SEARCH_GRID,
	SEARCH_LIST,
} from '../constants/searchConstants';
import { HOME } from '../constants/constants';
import {
	PRODUCT_SECTION,
	IMAGE_300,
	IMAGE_100,
} from '../constants/CloudinaryConstants';
import FavoriteButton from './FavoriteButton';
import ArIcon from './ArIcon';

const galleryWidth = styles.dimensions.width - styles.measurements.gridSpace1 * 2;

const componentStyles = StyleSheet.create({
	list: {
		flex: 1,
		padding: styles.measurements.gridSpace1,
		height: 137,
	},
	galleryBox: {
		backgroundColor: styles.colors.white,
		marginTop: styles.measurements.gridSpace1,
		marginHorizontal: styles.measurements.gridSpace1,
		padding: styles.measurements.gridSpace1,
	},
	galleryPrice: {
		flex: 1,
		textAlign: 'right',
		alignSelf: 'flex-start',
	},
	galleryTextContainer: {
		paddingTop: styles.measurements.gridSpace2,
		paddingBottom: styles.measurements.gridSpace1,
	},
	gridTextContainer: {
		height: 75,
	},
	rowStyle: {
		backgroundColor: styles.colors.white,
		marginTop: styles.measurements.gridSpace1,
		marginHorizontal: styles.measurements.gridSpace1,
		height: 140,
	},
	gridStyle: {
		backgroundColor: styles.colors.white,
		padding: styles.measurements.gridSpace1,
		flex: 1,
		marginLeft: styles.measurements.gridSpace1,
		marginTop: styles.measurements.gridSpace1,
	},
	gridImage: {
		height: 136,
		width: galleryWidth / 2 - styles.measurements.gridSpace1 / 2,
		marginBottom: styles.measurements.gridSpace1,
		alignSelf: 'center',
		flex: 1,
	},
	galleryImage: {
		height: 300,
		width: galleryWidth,
		alignSelf: 'center',
	},
	rowImage: {
		margin: styles.measurements.gridSpace1,
		height: 100,
		width: 100,
	},
	starStyle: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	favoriteButton1: {
		marginRight: styles.measurements.gridSpace1,
	},
	favoriteButton2: {
		alignSelf: 'flex-start',
		marginTop: styles.measurements.gridSpace1,
		marginRight: styles.measurements.gridSpace1,
	},
	arIcon: {
		position: 'absolute',
		left: styles.measurements.gridSpace1,
		top: styles.measurements.gridSpace1,
	},
});

@withNavigation
export default class ProductDrop extends Component {

	constructor(props) {
		super(props);

		const swatchWidth = 35;
		this.swatchesPerScreen = Math.floor((galleryWidth / swatchWidth) - 1);

		const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		const finishes = (props.productDrop.finishes && props.productDrop.finishes.slice(0, this.swatchesPerScreen)) || [];

		this.state = {
			dataSource: ds.cloneWithRows(finishes),
		};
		this.views = this.getViewStyle();
	}

	componentWillReceiveProps({ productDrop }) {
		const { productDrop: prevProductDrop } = this.props;
		if (productDrop && prevProductDrop && productDrop.finishes !== prevProductDrop.finishes) {
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(productDrop.finishes.slice(0, this.swatchesPerScreen)),
			});
		}
	}

	shouldComponentUpdate(nextProps) {
		const {
			productDrop,
			selectedFinish,
			viewStyle,
		} = this.props;
		return productDrop.productId !== nextProps.productDrop.productId ||
			viewStyle !== nextProps.viewStyle ||
			selectedFinish.uniqueId !== nextProps.selectedFinish.uniqueId;
	}

	goToProduct = () => {
		const { onPress, productDrop, selectedFinish } = this.props;
		onPress(productDrop);

		this.props.navigation.getNavigator(HOME).push('productDetail', {
			compositeId: productDrop.productCompositeId,
			uniqueId: selectedFinish.uniqueId,
			manufacturer: productDrop.manufacturer,
			sku: selectedFinish.sku,
			finish: selectedFinish.finish,
		});
	};

	getPrePriceText = () => {
		if (!this.props.productDrop.squareFootageBased) {
			return 'Starting at';
		}
	};

	getPostPriceText = () => {
		if (this.props.productDrop.squareFootageBased) {
			return '/ sq ft';
		}
	};

	getPrice = () => {
		const { productDrop } = this.props;
		if (this.props.productDrop.squareFootageBased) {
			return helpers.toUSD(productDrop.minPrice / productDrop.squareFootagePerCarton);
		}
		return helpers.toUSD(productDrop.minPrice);
	};

	getViewStyle = () => {
		return {
			[SEARCH_GRID]: {
				headStyle: styles.elements.flex1,
				touchableStyle: componentStyles.gridStyle,
				imageStyle: componentStyles.gridImage,
				cloudinaryImageSpecs: {
					...IMAGE_100,
				},
				text: this.renderProductDropGrid,
			},
			[SEARCH_GALLERY]: {
				headStyle: {},
				touchableStyle: componentStyles.galleryBox,
				imageStyle: componentStyles.galleryImage,
				cloudinaryImageSpecs: {
					...IMAGE_300,
				},
				text: this.renderProductDropGallery,
			},
			[SEARCH_LIST]: {
				headStyle: styles.elements.centeredFlexRow,
				touchableStyle: componentStyles.rowStyle,
				imageStyle: componentStyles.rowImage,
				cloudinaryImageSpecs: {
					...IMAGE_100,
				},
				text: this.renderProductDropRow,
			},
		};
	};

	renderFavoritesButton = () => {
		const { productDrop, selectedFinish, showFavorite, viewStyle } = this.props;
		let favoriteButton1 = null, favoriteButton2 = null;

		if ((viewStyle === SEARCH_GALLERY || viewStyle === SEARCH_GRID) && showFavorite) {
			favoriteButton1 = (
				<FavoriteButton
					compositeId={productDrop.productCompositeId}
					finishes={productDrop.finishes}
					productUniqueId={selectedFinish.uniqueId}
					style={componentStyles.favoriteButton1}
					product={{
						...productDrop,
						selectedFinish,
					}}
				/>
			);
		} else if (showFavorite) {
			favoriteButton2 = (
				<FavoriteButton
					compositeId={productDrop.productCompositeId}
					finishes={productDrop.finishes}
					productUniqueId={selectedFinish.uniqueId}
					style={componentStyles.favoriteButton2}
					product={{
						...productDrop,
						selectedFinish,
					}}
				/>
			);
		}

		return { favoriteButton1, favoriteButton2 };
	};

	renderPriceText = (props) => {
		if (this.props.productDrop.minPrice) {
			return (
				<Text
					size="small"
					color="primary"
					weight="bold"
					{...props}
				>
					{this.getPrePriceText()} {this.getPrice()} {this.getPostPriceText()}
				</Text>
			);
		}

		return null;
	};

	renderProductDropGallery = () => {
		const numberOfLines = 2;

		return (
			<View>
				<View style={[styles.elements.centeredFlexRow, componentStyles.galleryTextContainer]}>
					{this.renderProductName({ numberOfLines, style: styles.elements.flex1 })}
					{this.renderPriceText({ numberOfLines, style: componentStyles.galleryPrice })}
				</View>
				<ListView
					automaticallyAdjustContentInsets={false}
					dataSource={this.state.dataSource}
					renderRow={this.renderSwatchImage}
					renderFooter={this.renderSwatchFooter}
					horizontal={true}
					scrollEnabled={false}
					showsHorizontalScrollIndicator={false}
				/>
			</View>
		);
	};

	renderProductDropGrid = () => {
		const { productDrop: { reviewRating } } = this.props;
		const numberOfLines = reviewRating && reviewRating.numReviews < 1 ? 2 : 1;

		return (
			<View style={componentStyles.gridTextContainer}>
				{this.renderProductName({ numberOfLines })}
				{this.renderTitle()}
				{this.renderStars()}
				{this.renderPriceText()}
			</View>
		);
	};

	renderProductDropRow = () => {
		const { productDrop } = this.props;

		return (
			<View style={componentStyles.list}>
				<Text
					numberOfLines={3}
					size="small"
					style={styles.elements.flex1}
				>
					{this.renderProductName()}
					{' '}{helpers.removeHTML(productDrop.title)}
				</Text>
				{this.renderStars()}
				{this.renderPriceText()}
			</View>
		);
	};

	renderProductName = (props) => {
		const { productDrop } = this.props;
		return (
			<Text
				size="small"
				weight="bold"
				{...props}
			>
				{productDrop.manufacturer} {productDrop.productId}
			</Text>
		);
	};

	renderStars = () => {
		const { reviewRating } = this.props.productDrop;
		if (reviewRating && reviewRating.numReviews > 0) {
			return (
				<View style={componentStyles.starStyle}>
					<StarRating
						disabled={true}
						maxStars={5}
						emptyStar="ios-star-outline"
						fullStar="ios-star"
						halfStar="ios-star-half"
						iconSet="Ionicons"
						rating={reviewRating.avgRating}
						selectedStar={helpers.noop}
						starColor={styles.colors.accent}
						starSize={17}
					/>
					<Text size="small">
						({reviewRating.numReviews})
					</Text>
				</View>
			);
		}
	};

	renderSwatchImage = (finish) => {
		return <SwatchImage finish={finish}/>;
	};

	renderSwatchFooter = () => {
		const lengthDifference = this.props.productDrop.finishes.length - this.swatchesPerScreen;
		if (lengthDifference > 0) {
			return <SwatchImage moreCount={lengthDifference}/>;
		}
	};

	renderTitle = () => {
		const { minPrice, reviewRating, title } = this.props.productDrop;
		if (title && !reviewRating && !minPrice) {
			return <Text numberOfLines={2}>{helpers.removeHTML(title)}</Text>;
		}
	};

	render() {
		const { productDrop, selectedFinish, viewStyle } = this.props;

		const view = this.views[viewStyle];
		const imageUrl = helpers.getCloudinaryImageUrl({
			width: view.cloudinaryImageSpecs ? view.cloudinaryImageSpecs.width : view.imageStyle.width,
			height: view.cloudinaryImageSpecs ? view.cloudinaryImageSpecs.height : view.imageStyle.height,
			section: PRODUCT_SECTION,
			manufacturer: productDrop.manufacturer,
			name: selectedFinish.image,
		});
		const { favoriteButton1, favoriteButton2 } = this.renderFavoritesButton();

		return (
			<TouchableHighlight
				style={view.touchableStyle}
				onPress={() => this.goToProduct()}
				underlayColor={styles.colors.white}
			>
				<View style={view.headStyle}>
					<Image
						resizeMode="contain"
						source={imageUrl}
						style={view.imageStyle}
					>
						{favoriteButton1}
					</Image>
					{view.text()}
					{favoriteButton2}
					<ArIcon
						compositeId={productDrop.productCompositeId}
						style={viewStyle === SEARCH_LIST ? componentStyles.arIcon : null}
					/>
				</View>
			</TouchableHighlight>
		);
	}
}

ProductDrop.propTypes = {
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
	onPress: PropTypes.func,
	productDrop: PropTypes.shape({
		finishes: PropTypes.array,
		manufacturer: PropTypes.string,
		minPrice: PropTypes.number,
		productCompositeId: PropTypes.number.isRequired,
		productId: PropTypes.string.isRequired,
		reviewRating: PropTypes.object,
		squareFootageBased: PropTypes.bool,
		title: PropTypes.string,
	}),
	selectedFinish: PropTypes.shape({
		finish: PropTypes.string,
		image: PropTypes.string,
		sku: PropTypes.string,
		uniqueId: PropTypes.number.isRequired,
	}),
	showFavorite: PropTypes.bool,
	viewStyle: PropTypes.string,
};

ProductDrop.defaultProps = {
	onPress: helpers.noop,
	selectedFinish: {},
	showFavorite: true,
	viewStyle: SEARCH_LIST,
};
