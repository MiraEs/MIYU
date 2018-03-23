'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	findNodeHandle,
} from 'react-native';
import {
	Button,
	ListView,
	withScreen,
} from 'BuildLibrary';
import { NavigationStyles } from '@expo/ex-navigation';
import RelatedProduct from '../components/productDetail/RelatedProduct';
import ListHeader from '../components/listHeader';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import TrackingActions from '../lib/analytics/TrackingActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getRelatedUpsellProducts } from '../actions/UpsellActions';
import {
	addSessionCartSubItem,
	addSessionCartItems,
} from '../actions/CartActions';
import { ANIMATION_TIMEOUT_200 } from '../constants/AnimationConstants';
import NavigationBarIconButton from '../components/navigationBar/NavigationBarIconButton';
import { navigatorPop } from '../actions/NavigatorActions';

const componentStyles = StyleSheet.create({
	separator: {
		height: styles.dimensions.borderWidthLarge,
		backgroundColor: styles.colors.grey,
	},
});

export class ProductUpsell extends Component {

	constructor(props) {
		super(props);
		this.state = {
			upsellAdded: false,
		};
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:productupsell',
		};
	}

	getScreenData = () => {
		const { compositeId, actions, finish, productConfigurationId } = this.props;
		actions.getRelatedUpsellProducts(compositeId, finish, productConfigurationId);
	};

	onContinueToCartPress = () => {
		this.props.navigator.replace('cartScreen', {
			title: 'Shopping Cart',
		});
	};

	onRelatedProductAddToCart = (sessionCartItem, button, callback) => {
		button.queueChange({ text: 'Adding...' });
		const { sessionCartId, parentKey, actions } = this.props;

		const suggestedItem = {
			sessionCartItems: [{
				pricedOptions: [],
				productUniqueId: sessionCartItem.productUniqueId,
				quantity: sessionCartItem.quantity,
			}],
			sessionCartId,
		};
		const relatedItem = {
			uniqueId: sessionCartItem.productUniqueId,
			quantity: sessionCartItem.quantity,
			sessionCartId,
			parentKey,
		};
		const payload = sessionCartItem.isSuggestedItem ? suggestedItem : relatedItem;
		const action = !sessionCartItem.isSuggestedItem ? actions.addSessionCartSubItem : actions.addSessionCartItems;

		action(payload)
			.then(() => {
				button.queueChange({
					text: 'Added To Cart',
					itemAdded: true,
				});
				this.setState({ upsellAdded: true });
				button.reset(callback);
			})
			.catch(() => {
				button.queueChange({
					text: 'Unable To Add',
					itemAdded: false,
				});
				button.reset(callback);
			})
			.done();
	};

	onQuantityInputFocus = (ref) => {
		setTimeout(() => {
			const scrollResponder = this.listView.getScrollResponder();

			scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
				findNodeHandle(ref),
				120,
				true
			);
		}, ANIMATION_TIMEOUT_200);
	};

	getDataSource = () => {
		const { recommendedOptions, accessories } = this.props;
		const data = {};
		const required = recommendedOptions.filter((option) => option.optionType.toLowerCase() === 'required');
		const recommended = recommendedOptions.filter((option) => option.optionType.toLowerCase() === 'recommended');
		const suggestions = accessories.filter((option) => option.crossSellType.toLowerCase() === 'accessory');

		if (required.length) {
			data['REQUIRED FOR INSTALL'] = required;
		}
		if (recommended.length) {
			data['YOU MAY NEED'] = recommended;
		}
		if (suggestions.length) {
			data['MAY WE SUGGEST'] = suggestions;
		}
		return new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
		}).cloneWithRowsAndSections(data);
	};

	renderRow = (option) => {
		let { productConfiguration } = option;
		// sometimes productConfiguration is null
		if (!productConfiguration) {
			productConfiguration = {};
		}
		const isSuggestedItem = !option.application;

		let titlePrimary;
		let titleSecondary;
		let friendlyName;
		let whyText;

		if (isSuggestedItem) {
			titlePrimary = `${option.productDrop.manufacturer} ${option.productDrop.productId}`;
			titleSecondary = option.productDrop.title;
			friendlyName = option.productDrop.manufacturer;
		} else {
			titlePrimary = option.application;
			friendlyName = productConfiguration.friendlyName;
			whyText = productConfiguration.whyText;
		}

		return (
			<RelatedProduct
				titlePrimary={titlePrimary}
				titleSecondary={titleSecondary}
				friendlyName={friendlyName}
				whyText={whyText}
				id={option.id}
				selectedDrop={option.selectedDrop || option.productDrop}
				selectedFinish={option.selectedFinish}
				optionType={option.optionType || option.crossSellType}
				optionProducts={option.optionProducts}
				onAddToCartPress={this.onRelatedProductAddToCart}
				compositeId={this.props.compositeId}
				neededQuantity={this.props.addedProductQuantity}
				onQuantityInputFocus={this.onQuantityInputFocus}
				isSuggestedItem={isSuggestedItem}
			/>
		);
	};

	renderSectionHeader = (data, sectionId) => {
		return (
			<ListHeader
				text={sectionId}
				accessibilityLabel={`productUpsellHeader${sectionId.replace(/\s/g, '')}`}
			/>
		);
	};

	renderSeparator = (sectionId, rowId) => {
		return (
			<View
				key={`${sectionId}${rowId}`}
				style={componentStyles.separator}
			/>);
	};

	render() {
		const { upsellAdded } = this.state;
		const continueButtonText = (upsellAdded) ? 'Continue to Cart' : 'I Don\'t Need Any of These Items, Continue to Cart';

		return (
			<View style={styles.elements.screen}>
				<ListView
					ref={(ref) => this.listView = ref}
					dataSource={this.getDataSource()}
					enableEmptySections={true}
					style={styles.elements.flex}
					keyboardShouldPersistTaps="always"
					renderRow={this.renderRow}
					renderSeparator={this.renderSeparator}
					renderSectionHeader={this.renderSectionHeader}
					accessibilityLabel="Related Products"
				/>
				<Button
					textColor="secondary"
					color="white"
					onPress={this.onContinueToCartPress}
					text={continueButtonText}
					accessibilityLabel="Add To CartButton"
					style={styles.elements.noFlex}
					trackAction={TrackingActions.PRODUCT_UPSELL_CONTINUE_TO_CART}
				/>
			</View>
		);
	}

}

ProductUpsell.route = {
	styles: {
		...NavigationStyles.SlideVertical,
		gestures: null,
	},
	navigationBar: {
		visible: true,
		title: 'Related Products',
		renderLeft() {
			return (
				<NavigationBarIconButton
					iconName={helpers.getIcon('close')}
					onPress={() => navigatorPop('root')}
					trackAction={TrackingActions.PRODUCT_UPSELL_NAV_TAP_CLOSE}
				/>
			);
		},
	},
};

ProductUpsell.propTypes = {
	actions: PropTypes.object.isRequired,
	accessories: PropTypes.array,
	compositeId: PropTypes.number.isRequired,
	finish: PropTypes.object,
	recommendedOptions: PropTypes.array.isRequired,
	sessionCartId: PropTypes.number.isRequired,
	addedProductQuantity: PropTypes.number.isRequired,
	productConfigurationId: PropTypes.string.isRequired,
	parentKey: PropTypes.string.isRequired,
	navigator: PropTypes.shape({
		replace: PropTypes.func,
	}),
};

ProductUpsell.defaultProps = {
	accessories: [],
	recommendedOptions: [],
	addedProductQuantity: 1,
};

const mapStateToProps = ({ upsellReducer, cartReducer }) => {
	return {
		sessionCartId: cartReducer.cart.sessionCartId,
		recommendedOptions: upsellReducer.recommendedOptions,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			addSessionCartSubItem,
			addSessionCartItems,
			getRelatedUpsellProducts,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(ProductUpsell));
