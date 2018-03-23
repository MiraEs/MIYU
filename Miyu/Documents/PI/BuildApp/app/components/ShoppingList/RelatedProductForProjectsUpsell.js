'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	TouchableWithoutFeedback,
} from 'react-native';
import {
	Button,
	Image,
	LinkButton,
	QuantitySelector,
	Text,
} from 'BuildLibrary';
import { withNavigation } from '@expo/ex-navigation';
import helpers from '../../lib/helpers';
import styles from '../../lib/styles';
import OptionSelectButton from '../OptionSelectButton';
import { PRODUCT_SECTION, IMAGE_95 } from '../../constants/CloudinaryConstants';
import EventEmitter from '../../lib/eventEmitter';
import SimpleModal from '../SimpleModal';
import TrackingActions from '../../lib/analytics/TrackingActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProductRootCategory } from '../../actions/ProductDetailActions';
import { trackAction } from '../../actions/AnalyticsActions';
import { addSubItemToShoppingList } from '../../actions/ProjectActions';
import { showAlert } from '../../actions/AlertActions';
import {
	MAIN,
	LISTS,
} from '../../constants/constants';
import router from '../../router';

const componentStyles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
	},
	leftColumn: {
		margin: styles.measurements.gridSpace1,
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	rightColumn: {
		flex: 1,
		paddingVertical: styles.measurements.gridSpace1,
		paddingRight: styles.measurements.gridSpace1,
	},
	quantityAndAddToCart: {
		flexDirection: 'row',
		padding: styles.measurements.gridSpace1,
	},
	addToCartButton: {
		flex: 1,
		borderLeftWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.white,
	},
	quantitySelectorsHidden: {
		width: 44,
	},
	quantitySelectorsShown: {
		width: 132,
	},
});

@withNavigation
export class RelatedProductForProjectsUpsell extends Component {

	constructor(props) {
		super(props);
		this.state = {
			quantity: this.props.neededQuantity,
			isQuantitySelectorsVisible: false,
			showQuantitySelectorView: true,
			isAddToProjectEnabled: true,
		};
	}

	onWhyTextPress = (title, content) => {
		EventEmitter.emit('showScreenOverlay', (
			<SimpleModal title={title}>
				<View>
					<Text>{helpers.removeHTML(content)}</Text>
				</View>
			</SimpleModal>
		));
	};

	onFinishButtonPress = () => {
		const { id, selectedFinish } = this.props;
		this.props.navigator.push('upsellFinishSelection', {
			optionId: id,
			prevSelectedFinish: selectedFinish,
		});
	};

	onModelDetailPress = () => {
		this.props.navigator.push('modelDetailPickerScreen', {
			finish: this.props.selectedFinish.finish,
			optionId: this.props.id,
			optionProducts: this.getOptionProducts(),
			productFriendlyName: this.props.friendlyName,
		});
	};

	onProductTap = () => {
		this.setState({ isQuantitySelectorsVisible: false }, () => {
			// if we're adding to the cart, the quantitySelector isn't on the screen
			if (this.quantitySelector && typeof this.quantitySelector.onHideSelectors === 'function') {
				this.quantitySelector.onHideSelectors();
			}
		});
	};

	/**
	 * Swaps the selected product to top of the list
	 */
	getOptionProducts = () => {
		const { optionProducts, selectedDrop } = this.props;
		const selectedModelProductCompositeId = selectedDrop.productCompositeId;
		if (optionProducts.length > 1) {
			const index = optionProducts
				.findIndex(({productDrop}) => productDrop.productCompositeId === selectedModelProductCompositeId);
			const selectedProduct = optionProducts[index];
			optionProducts[index] = optionProducts[0];
			optionProducts[0] = selectedProduct;
		}
		return optionProducts;
	};

	onAddToProjectPress = () => {
		if (this.state.isAddToProjectEnabled) {
			const {
				actions,
				parentKey,
				selectedFinish: {
					uniqueId,
				} = {},
				selectedSessionCartIDs,
			} = this.props;
			const { quantity } = this.state;
			const sessionCartItem = {
				parentKey,
				uniqueId,
				quantity,
			};

			const addItemCalls = [];
			const projectIds = Object.keys(selectedSessionCartIDs);
			projectIds.forEach((projectId) => {
				selectedSessionCartIDs[projectId].forEach((sessionCartId) => {
					if (sessionCartId) {
						addItemCalls.push(
							actions.addSubItemToShoppingList({
								...sessionCartItem,
								sessionCartId,
							})
						);
					}
				});
			});
			Promise.all(addItemCalls)
				.then(() => {
					const hasMultipleProjects = projectIds.length > 1;
					const button = {
						text: hasMultipleProjects ? 'Go to Projects' : 'Go to Project',
						onPress: () => {
							if (hasMultipleProjects) {
								this.props.navigation.performAction(({ tabs }) => tabs(MAIN).jumpToTab(LISTS));
							} else {
								this.props.navigation.getNavigatorByUID(MAIN).jumpToTab(LISTS);
								requestAnimationFrame(() => this.props.navigation.performAction(({ stacks }) => {
									stacks(LISTS).push(router.getRoute('projectDetails', { projectId: Number(projectIds[0]) }));
								}));
							}
							this.props.navigator.pop();
						},
					};
					const msg = hasMultipleProjects ? 'Item Added To Projects!' : 'Item Added To Project!';
					this.props.actions.showAlert(msg, 'success', button);
				})
				.catch(() => {
					this.props.actions.showAlert('Failed to add item. Try again.', 'error');
				})
				.done();
		}
	};

	onUpdateQuantity = (quantity) => {
		this.setState({
			quantity,
		});
	};

	getTrackAction = () => {
		const { optionType } = this.props;
		if (this.isMatchOptionType(optionType, 'Required')) {
			return TrackingActions.RELATED_PRODUCT_REQUIRED_ADD_TO_PROJECT;
		} else if (this.isMatchOptionType(optionType, 'Recommended')) {
			return TrackingActions.RELATED_PRODUCT_RECOMMENDED_ADD_TO_PROJECT;
		} else {
			return TrackingActions.RELATED_PRODUCT_MAY_WE_SUGGEST_ADD_TO_PROJECT;
		}
	};

	getTrackContextData = () => {
		return {};
	}

	isMatchOptionType = (left, right) => {
		return left.toLowerCase() === right.toLowerCase();
	};

	renderWhyLink = () => {
		const { optionType, titlePrimary, whyText } = this.props;
		let text;
		if (this.isMatchOptionType(optionType, 'Required')) {
			text = 'Why is this Required?';
		} else if (this.isMatchOptionType(optionType, 'Recommended')) {
			text = 'Why would I need this?';
		}
		if (text) {
			return (
				<LinkButton
					accessibilityLabel={`relatedProduct${titlePrimary.replace(/\s/g, '')}`}
					onPress={() => this.onWhyTextPress(text, whyText)}
				>
					{text}
				</LinkButton>
			);
		}
	};

	renderQuantitySelector = () => {
		const wrapStyle = this.state.isQuantitySelectorsVisible ? componentStyles.quantitySelectorsShown : componentStyles.quantitySelectorsHidden;

		if (this.state.showQuantitySelectorView) {
			return (
				<View style={wrapStyle}>
					<QuantitySelector
						theme="primary"
						ref={(ref) => this.quantitySelector = ref}
						allowZero={false}
						quantity={this.state.quantity}
						onUpdateQuantity={this.onUpdateQuantity}
						disableDelete={true}
						onToggleSelectors={(visible) => this.setState({isQuantitySelectorsVisible: visible})}
						onInputFocus={() => this.props.onQuantityInputFocus(this.quantitySelector)}
					/>
				</View>
			);
		}
	};

	renderOptionProducts = () => {
		const { selectedDrop, titleSecondary } = this.props;
		const boldText = `${selectedDrop.manufacturer} ${selectedDrop.productId}`;

		if (this.getOptionProducts() && this.getOptionProducts().length > 1) {
			return (
				<OptionSelectButton
					onPress={this.onModelDetailPress}
					text="Model: "
					boldText={boldText}
					isConfigured={true}
					style={componentStyles.horizontalMargin}
					accessibilityLabel={`Related${boldText}`}
				/>
			);
		}

		if (!titleSecondary) {
			return (
				<Text>Model: <Text weight="bold">{boldText}</Text></Text>
			);
		}
	};

	renderSelectedFinishes = () => {
		const { selectedFinish, selectedDrop } = this.props;
		const boldText = selectedFinish.finish ? selectedFinish.finish : 'Choose Finish';
		const text = selectedFinish.finish ? 'Finish: ' : '';

		if (selectedDrop.finishes && selectedDrop.finishes.length > 1) {
			return (
				<OptionSelectButton
					onPress={this.onFinishButtonPress}
					boldText={boldText}
					text={text}
					isConfigured={true}
					accessibilityLabel={`${boldText}Finish`}
				/>
			);
		}

		return (
			<Text>{text} <Text weight="bold">{boldText}</Text></Text>
		);
	};

	renderTitle = () => {
		const { titlePrimary, titleSecondary } = this.props;
		return <Text><Text weight="bold">{titlePrimary}</Text> {titleSecondary}</Text>;
	};

	render() {
		const { selectedFinish: { cost, image }, selectedDrop: { manufacturer } } = this.props;
		const imageSource = helpers.getCloudinaryImageUrl({
			name: image,
			...IMAGE_95,
			manufacturer,
			section: PRODUCT_SECTION,
		});
		return (
			<TouchableWithoutFeedback onPress={this.onProductTap}>
				<View>
					<View style={componentStyles.container}>
						<View style={componentStyles.leftColumn}>
							<Image
								source={imageSource}
								style={componentStyles.image}
								{...IMAGE_95}
							/>
							<View>
								<Text
									textAlign="center"
									size="small"
									color="greyDark"
								>
									{this.state.quantity} @ {helpers.toUSD(cost)}
								</Text>
								<Text
									color="primary"
									weight="bold"
									textAlign="center"
								>
									{helpers.toUSD(cost * this.state.quantity)}
								</Text>
							</View>
						</View>
						<View style={componentStyles.rightColumn}>
							{this.renderTitle()}
							{this.renderWhyLink()}
							{this.renderOptionProducts()}
							{this.renderSelectedFinishes()}
						</View>
					</View>
					<View style={componentStyles.quantityAndAddToCart}>
						{this.renderQuantitySelector()}
						<Button
							accessibilityLabel="Add To Project"
							onPress={this.onAddToProjectPress}
							style={componentStyles.addToCartButton}
							text="Add To Project"
							trackAction={this.getTrackAction()}
							trackContextData={this.getTrackContextData}
						/>
					</View>
				</View>
			</TouchableWithoutFeedback>
		);
	}
}

RelatedProductForProjectsUpsell.propTypes = {
	actions: PropTypes.object,
	compositeId: PropTypes.number.isRequired,
	friendlyName: PropTypes.string,
	id: PropTypes.string,
	isSuggestedItem: PropTypes.bool,
	navigation: PropTypes.shape({
		performAction: PropTypes.func,
		getNavigatorByUID: PropTypes.func,
	}),
	navigator: PropTypes.shape({
		pop: PropTypes.func,
		push: PropTypes.func,
	}),
	neededQuantity: PropTypes.number.isRequired,
	onQuantityInputFocus: PropTypes.func,
	optionType: PropTypes.string,
	optionProducts: PropTypes.array,
	parentKey: PropTypes.number.isRequired,
	selectedDrop: PropTypes.object,
	selectedFinish: PropTypes.object,
	selectedSessionCartIDs: PropTypes.object,
	titlePrimary: PropTypes.string,
	titleSecondary: PropTypes.string,
	whyText: PropTypes.string,
};

RelatedProductForProjectsUpsell.defaultProps = {
	friendlyName: '',
	optionProducts: [],
	selectedDrop: {},
	selectedFinish: {},
	titlePrimary: '',
	titleSecondary: '',
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			addSubItemToShoppingList,
			getProductRootCategory,
			showAlert,
			trackAction,
		}, dispatch),
	};
};

export default connect(undefined, mapDispatchToProps)(RelatedProductForProjectsUpsell);
