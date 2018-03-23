import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	InteractionManager,
	TextInput,
} from 'react-native';
import {
	Text,
	ScrollView,
	TouchableOpacity,
	withScreen,
} from 'BuildLibrary';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import uuid from 'uuid';
import Icon from 'react-native-vector-icons/Ionicons';
import productConfigurationHelpers from '../../lib/ProductConfigurationHelpers';
import productHelpers from '../../lib/productHelpers';
import ProductConfigurationOptionButton from './ProductConfigurationOptionButton';
import helpers from '../../lib/helpers';
import styles from '../../lib/styles';
import FixedBottomButton from '../FixedBottomButton';
import TrackingActions from '../../lib/analytics/TrackingActions';
import EventEmitter from '../../lib/eventEmitter';
import productConfigurationActions from '../../actions/ProductConfigurationsActions';
import ProductConfigurationHeader from './ProductConfigurationHeader';
import SimpleModal from '../SimpleModal';
import scrollableHelpers from '../../lib/ScrollableHelpers';
import {
	RADIO_OPTION,
	CHECK_BOX_OPTION,
} from '../../constants/productDetailConstants';
import {
	inputBlurred,
	inputFocused,
} from '../../lib/InputAnimations';

const componentStyles = StyleSheet.create({
	optionsContainer: {
		flex: 1,
		paddingBottom: styles.measurements.gridSpace1,
	},
	optionGroup: {
		flexDirection: 'row',
	},
	optionGroupContent: {
		paddingLeft: styles.measurements.gridSpace1,
	},
	optionGroupName: {
		marginBottom: styles.measurements.gridSpace1,
		marginTop: styles.measurements.gridSpace2,
	},
	helpIconContainer: {
		marginTop: styles.measurements.gridSpace2,
		marginLeft: styles.measurements.gridSpace1,
	},
	helpIcon: {
		width: 16,
		height: 16,
	},
});

class ProductPricedOptionsScreen extends Component {

	constructor(props) {
		super(props);
		this.orignialProductConfigurationId = props.productConfigurationId;
		this.optionGroups = {};
		this.selectedOptions = {};
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			const { navigator, actions, productConfigurationId } = this.props;
			const nextProductConfigurationId = uuid.v4();
			actions.cloneProductConfiguration({
				sourceId: productConfigurationId,
				destinationId: nextProductConfigurationId,
			});
			navigator.updateCurrentRouteParams({
				productConfigurationId: nextProductConfigurationId,
			});
			Object.keys(this.selectedOptions).forEach((optionGroupName) => {
				const container = this.optionGroups[optionGroupName];
				const child = this.selectedOptions[optionGroupName];
				if (container && child) {
					scrollableHelpers.scrollChildToCenter(container, child);
				}
			});
		});
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:pricedoptions',
		};
	}

	onPressContinue = () => {
		const { actions, navigator, productConfigurationId } = this.props;
		actions.cloneProductConfiguration({
			sourceId: productConfigurationId,
			destinationId: this.orignialProductConfigurationId,
		});
		navigator.pop();
	};

	onPressProductConfigurationOptionButton = (pricedOption, optionName, props = this.props) => {
		const { actions, compositeId, productConfigurationId } = props;
		actions.setProductConfigurationPricedOption({
			pricedOptionId: pricedOption.pricedOptionId,
			keyCode: pricedOption.text,
			name: pricedOption.value,
			productConfigurationId,
			optionName,
			compositeId,
		});
	};

	onSetProductConfigurationTextOption = (keyCode, pricedOption, optionName) => {
		const { actions, compositeId, productConfigurationId } = this.props;
		actions.addProductConfigurationTextPricedOption({
			name: pricedOption.value,
			pricedOptionId: pricedOption.pricedOptionId,
			keyCode,
			optionName,
			compositeId,
			productConfigurationId,
		});
	};

	onPressHelpIcon = (helpTitle, helpText) => {
		EventEmitter.emit('showScreenOverlay', (
			<SimpleModal title={helpTitle}>
				<Text>{helpers.removeHTML(helpText)}</Text>
			</SimpleModal>
		));
	};

	requiredSelectionsAreComplete = () => {
		const { pricedOptionGroups, selectedPricedOptions } = this.props;
		let isComplete = true;
		pricedOptionGroups.forEach((optionGroup) => {
			const matchingSelection = selectedPricedOptions.find(({ optionName }) => optionGroup.optionName === optionName);
			const isOptional = productHelpers.isOptionalPricedOptionGroup(optionGroup);
			if (!isOptional && !matchingSelection) {
				isComplete = false;
			}
		});
		return isComplete;
	};

	isOptionSelected = (pricedOption, optionName) => {
		return (this.props.selectedPricedOptions || []).find((selectedOption) => selectedOption.optionName === optionName && selectedOption.name === pricedOption.value) !== undefined;
	};

	getSelectedValueForOptionGroupName = (name) => {
		const selectedOption = (this.props.selectedPricedOptions || []).find((option) => option.optionName === name);
		return selectedOption && selectedOption.name || '';
	};

	renderOptionGroup = (pricedOptionGroup, index) => {
		const selectedValue = this.getSelectedValueForOptionGroupName(pricedOptionGroup.optionName) || '';
		return (
			<View key={index}>
				<View style={componentStyles.optionGroup}>
					<Text style={[componentStyles.optionGroupContent, componentStyles.optionGroupName]}>
						{pricedOptionGroup.optionName}:{' '}
						<Text weight="bold">{selectedValue}{' '}</Text>
					</Text>
					{
						pricedOptionGroup &&
						pricedOptionGroup.helpText &&
						(
							<TouchableOpacity
								onPress={() => this.onPressHelpIcon(pricedOptionGroup.helpTitle, pricedOptionGroup.helpText)}
								trackAction={TrackingActions.PRICED_OPTION_GROUP_HELP}
								hitSlop={{
									top: styles.measurements.gridSpace2,
									right: styles.measurements.gridSpace2,
									bottom: styles.measurements.gridSpace2,
									left: styles.measurements.gridSpace2,
								}}
								style={[componentStyles.helpIcon, componentStyles.helpIconContainer]}
							>
								<View>
									<Icon
										name="ios-help-circle-outline"
										size={16}
										style={componentStyles.helpIcon}
									/>
								</View>
							</TouchableOpacity>
						)
					}
				</View>
				<ScrollView
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={componentStyles.optionGroupContent}
					accessibilityLabel={pricedOptionGroup.optionName}
					ref={(ref) => this.optionGroups[pricedOptionGroup.optionName] = ref || this.optionGroups[pricedOptionGroup.optionName]}
				>
					{
						pricedOptionGroup.pricedOptions
							.filter(({ inputType }) => inputType.toUpperCase() === RADIO_OPTION || inputType.toUpperCase() === CHECK_BOX_OPTION)
							.map((pricedOption, index) => {
								const isSelected = this.isOptionSelected(pricedOption, pricedOptionGroup.optionName);
								return (
									<View
										key={index}
										accessibilityLabel={`Option ${index}`}
										ref={(ref) => {
											if (ref && isSelected) {
												this.selectedOptions[pricedOptionGroup.optionName] = ref;
											}
										}}
									>
										<ProductConfigurationOptionButton
											imageURI={helpers.getPricedOptionUrl(pricedOption.image)}
											price={pricedOption.calculatedPrice}
											onPress={() => this.onPressProductConfigurationOptionButton(pricedOption, pricedOptionGroup.optionName)}
											text={pricedOption.value}
											isSelected={isSelected}
										/>
									</View>
								);
							})
					}
				</ScrollView>
				{
					pricedOptionGroup.pricedOptions
						.filter(({ inputType }) => inputType.toUpperCase() !== RADIO_OPTION && inputType.toUpperCase() !== CHECK_BOX_OPTION)
						.map((pricedOption, index) => {
							const refId = pricedOption.pricedOptionId;
							return (
								<TextInput
									key={index}
									placeholder={pricedOption.value}
									ref={(ref) => this[refId] = ref || this[refId]}
									onBlur={(event) => {
										inputBlurred(this[refId], this.scrollView);
										this.onSetProductConfigurationTextOption(event.nativeEvent.text, pricedOption, pricedOptionGroup.optionName);
									}}
									onFocus={() => inputFocused(this[refId], this.scrollView, 200)}
									style={{
										marginTop: styles.measurements.gridSpace1,
										marginHorizontal: styles.measurements.gridSpace1,

										height: styles.dimensions.tapSizeMedium,
										backgroundColor: styles.colors.white,
										paddingHorizontal: styles.measurements.gridSpace1,
										borderWidth: styles.dimensions.borderWidth,
										borderColor: styles.colors.grey,
									}}
								/>
							);
						})
				}
			</View>
		);
	};

	renderOptionGroups = () => {
		return this.props.pricedOptionGroups.map(this.renderOptionGroup);
	};

	render() {
		const { pricedOptionGroups } = this.props;
		const selectedFinish = productConfigurationHelpers.getSelectedFinish(this.props.productConfigurationId);
		if (!pricedOptionGroups || (Array.isArray(pricedOptionGroups) && !pricedOptionGroups.length)) {
			return null;
		}
		return (
			<View style={[styles.elements.flex1, styles.elements.screenWithFixedBottomButton]}>
				<ProductConfigurationHeader
					productConfigurationId={this.props.productConfigurationId}
					hasSelectedFinish={!!selectedFinish}
				/>
				<ScrollView ref={(ref) => this.scrollView = ref || this.scrollView}>
					<View style={componentStyles.optionsContainer}>
						{this.renderOptionGroups()}
					</View>
				</ScrollView>
				<FixedBottomButton
					buttonText="Continue"
					disabled={!this.requiredSelectionsAreComplete()}
					onPress={this.onPressContinue}
					trackAction={TrackingActions.VARIATION_CONTINUE}
					accessibilityLabel="Continue Button"
				/>
			</View>
		);
	}

}

ProductPricedOptionsScreen.propTypes = {
	actions: PropTypes.shape({
		setProductConfigurationPricedOption: PropTypes.func,
	}),
	navigator: PropTypes.shape({
		pop: PropTypes.func,
		updateCurrentRouteParams: PropTypes.func,
	}),
	compositeId: PropTypes.number,
	productConfigurationId: PropTypes.string,
	pricedOptionGroups: PropTypes.array,
	selectedPricedOptions: PropTypes.array,
};

ProductPricedOptionsScreen.route = {
	navigationBar: {
		visible: true,
		title: 'Configure Product',
	},
};

const mapStateToProps = (state, { productConfigurationId }) => {
	const productComposite = productConfigurationHelpers.getProductComposite(productConfigurationId) || {};
	const productConfiguration = productConfigurationHelpers.getProductConfiguration(productConfigurationId) || {};
	return {
		pricedOptionGroups: productComposite.pricedOptionGroups,
		selectedPricedOptions: productConfiguration.selectedPricedOptions || [],
		compositeId: productComposite.productCompositeId,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			cloneProductConfiguration: productConfigurationActions.cloneProductConfiguration,
			addProductConfigurationTextPricedOption: productConfigurationActions.addProductConfigurationTextPricedOption,
			setProductConfigurationPricedOption: productConfigurationActions.setProductConfigurationPricedOption,
		}, dispatch),
	};
};


export default connect(mapStateToProps, mapDispatchToProps)(withScreen(ProductPricedOptionsScreen));

