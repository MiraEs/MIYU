import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import {
	Text,
	Image,
	KeyboardAwareView,
	withScreen,
} from 'BuildLibrary';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import Button from '../components/button';
import {
	addTextPricedOption,
	getProductComposite,
	setSelectedFinish,
} from '../actions/ProductDetailActions';
import productConfigurationsActions from '../actions/ProductConfigurationsActions';
import FinishDetailList from '../components/finishDetailList';
import {
	NO_THANK_YOU,
	I_DONT_NEED_THIS,
	RADIO_OPTION,
	CHECK_BOX_OPTION,
} from '../constants/productDetailConstants';
import EventEmitter from '../lib/eventEmitter';
import PricedOptionRadio from '../components/PricedOptionRadio';
import PricedOptionTextBox from '../components/PricedOptionTextBox';
import Form from '../components/Form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TrackingActions from '../lib/analytics/TrackingActions';
import {
	inputFocused,
	inputBlurred,
} from '../lib/InputAnimations';
import SimpleModal from '../components/SimpleModal';
import NavigationBarIconButton from '../components/navigationBar/NavigationBarIconButton';

const componentStyles = StyleSheet.create({
	singleImage: {
		height: 123,
		width: 123,
		alignSelf: 'center',
	},
	imageContainer: {
		backgroundColor: styles.colors.white,
		borderWidth: styles.dimensions.borderWidth,
		borderStyle: 'solid',
		borderColor: styles.colors.grey,
		marginBottom: styles.measurements.gridSpace2,
	},
	screen: {
		paddingTop: styles.measurements.gridSpace1,
		marginBottom: 0,
		backgroundColor: styles.colors.greyLight,
	},
	row: {
		flexDirection: 'row',
		paddingHorizontal: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace2,
	},
	errorText: {
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingVertical: styles.measurements.gridSpace1,
	},
	scrollView: {
		paddingHorizontal: styles.measurements.gridSpace1,
	},
});

//This non default export is so we can use it for tests
export class ProductCustomizationScreen extends Component {

	constructor() {
		super();
		this.state = {
			isError: false,
		};
	}

	componentDidMount() {
		const {
			actions,
			compositeId,
			hasConfiguration,
			productConfigurationId,
			uniqueId,
		} = this.props;
		if (!hasConfiguration && productConfigurationId) {
			actions.createProductConfiguration({
				compositeId,
				uniqueId,
				productConfigurationId,
			});
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:productcustomization',
		};
	}

	inputFocused = (refName) => {
		inputFocused.call(this, this[refName]);
	};

	inputBlurred = (refName) => {
		inputBlurred.call(this, this[refName]);
	};

	doesUseSameImageForAllItems = (optionGroup) => {
		let isSameImage = true;
		const image = optionGroup.pricedOptions[0].image;
		optionGroup.pricedOptions.map((pricedOption) => {
			if (pricedOption.image !== image) {
				isSameImage = false;
			}
		});
		return isSameImage && image;
	};

	getNextConfigurationName = (currentOptionName) => {
		const {
			selectedPricedOptions,
			selectedFinish,
			pricedOptionGroups,
		} = this.props;
		if (!selectedFinish || !selectedFinish.finish) {
			return 'Finish';
		}
		const optionNames = pricedOptionGroups.map((option) => option.optionName);
		const selectedOptionNames = selectedPricedOptions.map((option) => option.optionName);
		if (!selectedOptionNames.includes(currentOptionName)) {
			selectedOptionNames.push(currentOptionName);
		}
		return optionNames.find((optionName) => !selectedOptionNames.includes(optionName));
	};

	getOptionGroup = (optionName) => {
		const { pricedOptionGroups } = this.props;
		return pricedOptionGroups.find((optionGroup) => optionGroup.optionName === optionName) || {};
	};

	getCurrentOptionGroup = () => {
		const {
			pricedOptionGroups,
			optionName,
		} = this.props;
		return pricedOptionGroups ? pricedOptionGroups.find((optionGroup) => optionGroup.optionName === optionName) : null;
	};

	hasNextButton = (optionGroup) => {
		let hasNextButton = false;
		if (this.props.optionName === 'Finish') {
			return hasNextButton;
		}
		optionGroup.pricedOptions.map((pricedOption) => {
			if (pricedOption.inputType.toUpperCase() !== RADIO_OPTION) {
				hasNextButton = true;
			}
		});
		return hasNextButton;
	};

	onCustomizationFinished = () => {
		const {
			navigator,
			onCustomizationFinished,
			productConfigurationId,
		} = this.props;
		if (typeof onCustomizationFinished === 'function') {
			onCustomizationFinished({ productConfigurationId });
		}
		navigator.pop();
	};

	onNextPress = () => {
		const currentOptionName = this.props.optionName;
		const optionName = this.getNextConfigurationName(currentOptionName);
		const isOptionalGroup = this.isOptionalPricedOptionGroup(this.getOptionGroup(currentOptionName));
		const {
			compositeId,
			selectedPricedOptions,
			productConfigurationId,
			onCustomizationFinished,
		} = this.props;
		const { helpText } = this.getOptionGroup(optionName);
		const selectedOption = selectedPricedOptions.find((option) => option.optionName === currentOptionName);
		const selectedOptions = selectedOption && selectedOption.pricedOptions ? selectedOption.pricedOptions : [];
		if (!selectedOptions.length && !isOptionalGroup) {
			this.setState({
				isError: true,
			});
			return;
		}
		if (!selectedOptions.length && isOptionalGroup) {
			const {
				optionName,
				compositeId,
			} = this.props;
			const { setProductConfigurationPricedOption } = this.props.actions;
			if (this.state.isError) {
				this.setState({
					isError: false,
				});
			}
			setProductConfigurationPricedOption({ optionName, compositeId, productConfigurationId });
		}
		if (optionName) {
			return this.props.navigator.replace('productCustomizationScreen', {
				compositeId,
				optionName,
				helpText,
				onCustomizationFinished,
				productConfigurationId,
			});
		}
		this.onCustomizationFinished();
	};

	onSelectionPress = (option) => {
		const currentOptionName = this.props.optionName;
		this.setSelection(option);
		if (!this.hasNextButton(this.getOptionGroup(currentOptionName))) {
			const optionName = this.getNextConfigurationName(currentOptionName);
			const {
				compositeId,
				onCustomizationFinished,
				productConfigurationId,
			} = this.props;
			const { helpText } = this.getOptionGroup(optionName);
			if (optionName) {
				return this.props.navigator.replace('productCustomizationScreen', {
					compositeId,
					optionName,
					helpText,
					onCustomizationFinished,
					productConfigurationId,
				});
			}
			this.onCustomizationFinished();
		}
	};

	setSelection = (option) => {
		const {
			compositeId,
			optionName,
			productConfigurationId,
		} = this.props;
		const { setProductConfigurationPricedOption } = this.props.actions;
		if (this.state.isError) {
			this.setState({
				isError: false,
			});
		}
		setProductConfigurationPricedOption({
			pricedOptionId: option.pricedOptionId,
			keyCode: option.text,
			name: option.value,
			productConfigurationId,
			optionName,
			compositeId,
		});
	};

	setTextPriceOption = (option) => {
		const {
			compositeId,
			hasConfiguration,
			optionName,
			productConfigurationId,
		} = this.props;
		const {
			addTextPricedOption,
			addProductConfigurationTextPricedOption,
		} = this.props.actions;
		if (this.state.isError) {
			this.setState({
				isError: false,
			});
		}
		if (hasConfiguration) {
			return addProductConfigurationTextPricedOption({
				keyCode: option.text,
				name: option.value,
				pricedOptionId: option.pricedOptionId,
				optionName,
				compositeId,
				productConfigurationId,
			});
		} else {
			return addTextPricedOption({
				keyCode: option.text,
				name: option.value,
				pricedOptionId: option.pricedOptionId,
				compositeId,
				optionName,
			});
		}
	};

	addSelection = (option) => {
		const {
			optionName,
			compositeId,
			productConfigurationId,
		} = this.props;
		const { addToOrSetProductConfigurationPricedOption } = this.props.actions;
		if (this.state.isError) {
			this.setState({
				isError: false,
			});
		}
		return addToOrSetProductConfigurationPricedOption({
			pricedOptionId: option.pricedOptionId,
			keyCode: option.text,
			name: option.value,
			compositeId,
			optionName,
			productConfigurationId,
		});
	};

	renderLargePicture = (optionGroup) => {
		const { optionName } = this.props;
		if (optionName !== 'Finish' && this.doesUseSameImageForAllItems(optionGroup)) {
			const image = optionGroup.pricedOptions[0].image;
			return (
				<View
					style={componentStyles.imageContainer}
				>
					<Image
						source={{ uri: helpers.getPricedOptionUrl(image) }}
						resizeMode="contain"
						style={componentStyles.singleImage}
					/>
				</View>
			);
		}
	};

	onFinishSelected = (uniqueId) => {
		const optionName = this.getNextConfigurationName('Finish');
		const {
			compositeId,
			favoriteId,
			favoriteProductId,
			hasConfiguration,
			productComposite,
			productConfigurationId,
			navigator,
			continueToNextStep,
		} = this.props;
		const {
			setSelectedFinish,
			setProductConfigurationFinish,
		} = this.props.actions;

		if (hasConfiguration) {
			// the new way based on product configuration
			setProductConfigurationFinish({
				productComposite,
				productConfigurationId,
				uniqueId,
			});
		} else {
			// go back and remove this way of doing things later
			setSelectedFinish({ uniqueId, compositeId, favoriteId, favoriteProductId });
		}

		if (optionName && continueToNextStep) {
			return navigator.replace('productPricedOptions', {
				productConfigurationId,
			});
		}
		this.onCustomizationFinished();
	};

	isOptional = (pricedOption) => {
		return (pricedOption.value.toUpperCase() === NO_THANK_YOU || pricedOption.value.toUpperCase() === I_DONT_NEED_THIS);
	};

	isOptionalPricedOptionGroup = (pricedOptionGroup) => {
		return pricedOptionGroup.pricedOptions.filter((pricedOption) => this.isOptional(pricedOption) || pricedOption.inputType.toUpperCase() === CHECK_BOX_OPTION).length > 0;
	};

	renderOptions = (optionGroup) => {
		const { optionName, manufacturer, finishes, selectedPricedOptions, selectedFinish } = this.props;
		if (optionName === 'Finish') {
			return (
				<FinishDetailList
					finishes={finishes}
					manufacturer={manufacturer}
					onFinishPress={this.onFinishSelected}
					prevSelectedFinish={selectedFinish}
				/>
			);
		}

		const selectedOptionGroup = selectedPricedOptions.find((optionGroup) => optionGroup.optionName === optionName),
			currentPricedOptions = selectedOptionGroup && selectedOptionGroup.pricedOptions ? selectedOptionGroup.pricedOptions : [];

		return optionGroup.pricedOptions.map((pricedOption, index) => {
			const isSelected = !!currentPricedOptions.find((option) => option.pricedOptionId === pricedOption.pricedOptionId);
			if (pricedOption.inputType.toUpperCase() === RADIO_OPTION) {
				return (
					<PricedOptionRadio
						key={index}
						onPress={() => this.onSelectionPress(pricedOption)}
						image={!pricedOption.image || this.doesUseSameImageForAllItems(optionGroup) ? '' : helpers.getPricedOptionUrl(pricedOption.image)}
						optionText={pricedOption.value}
						isSelected={isSelected}
						cost={pricedOption.calculatedPrice}
					/>
				);
			} else if (pricedOption.inputType.toUpperCase() === CHECK_BOX_OPTION) {
				if (this.isOptional(pricedOption)) {
					return;
				}
				return (
					<PricedOptionRadio
						key={index}
						onPress={() => this.addSelection(pricedOption)}
						image={!pricedOption.image || this.doesUseSameImageForAllItems(optionGroup) ? '' : helpers.getPricedOptionUrl(pricedOption.image)}
						optionText={pricedOption.value}
						isSelected={isSelected}
						cost={pricedOption.calculatedPrice}
					/>
				);
			} else {
				const defaultValue = isSelected ? currentPricedOptions.find((option) => option.pricedOptionId === pricedOption.pricedOptionId).keyCode : '';
				return (
					<PricedOptionTextBox
						key={index + defaultValue}
						labelText={pricedOption.value}
						placeholderText={pricedOption.value}
						ref={(ref) => this[pricedOption.value] = ref}
						onSelect={this.setTextPriceOption}
						pricedOptionId={pricedOption.pricedOptionId}
						cost={pricedOption.calculatedPrice}
						defaultValue={defaultValue}
					/>
				);
			}
		});
	};

	renderNext = (optionGroup) => {
		if (this.hasNextButton(optionGroup)) {
			return (
				<KeyboardAwareView>
					<Button
						accessibilityLabel="Done Button"
						text="Done"
						onPress={this.onNextPress}
						trackAction={TrackingActions.PRODUCT_CUSTOMIZATION_DONE}
					/>
				</KeyboardAwareView>
			);
		}
	};

	renderError = () => {
		const { optionName, selectedPricedOptions } = this.props;
		const selectedOption = selectedPricedOptions.find((option) => option.optionName === optionName);
		const selectedOptions = selectedOption && selectedOption.pricedOptions ? selectedOption.pricedOptions : [];
		if (!selectedOptions.length && this.state.isError) {
			return (
				<Text
					color="error"
					style={componentStyles.errorText}
				>
					Please select an option.
				</Text>
			);
		}
	};

	renderIsOptional = (optionGroup) => {
		if (optionGroup && this.isOptionalPricedOptionGroup(optionGroup)) {
			return (
				<View
					style={componentStyles.row}
				>
					<Text>Select any options you may need</Text>
				</View>
			);
		}
	};

	renderTitle = () => {
		const { optionName } = this.props;

		if (optionName !== 'Finish') {
			return (
				<View
					style={componentStyles.row}
				>
					<Text size="large">Select </Text>
					<Text
						size="large"
						weight="bold"
					>
						{optionName}
					</Text>
				</View>
			);
		}
	};

	render() {
		const optionGroup = this.getCurrentOptionGroup();

		return (
			<View
				style={[styles.elements.screenWithHeader, componentStyles.screen]}
			>
				<Form
					style={componentStyles.scrollView}
					accessibilityLabel="Priced Option"
				>
					{this.renderTitle(optionGroup)}
					{this.renderIsOptional(optionGroup)}
					{this.renderError()}
					{this.renderLargePicture(optionGroup)}
					{this.renderOptions(optionGroup)}
				</Form>
				<View>
					{this.renderNext(optionGroup)}
				</View>
			</View>
		);
	}
}

ProductCustomizationScreen.route = {
	navigationBar: {
		visible: true,
		title(props) {
			return props.title || '';
		},
		renderRight(route) {
			if (route.params.helpText === null || route.params.optionName === 'Finish') {
				return null;
			}
			return (
				<NavigationBarIconButton
					onPress={() => {
						EventEmitter.emit('showScreenOverlay', (
							<SimpleModal title={route.params.optionName}>
								<Text>{helpers.removeHTML(route.params.helpText)}</Text>
							</SimpleModal>
						));
					}}
					iconName="ios-help-circle-outline"
					trackAction={TrackingActions.PRODUCT_CUSTOMIZATION_NAV_TAP_INFO}
				/>
			);
		},
	},
};

ProductCustomizationScreen.propTypes = {
	actions: PropTypes.object.isRequired,
	compositeId: PropTypes.number.isRequired,
	continueToNextStep: PropTypes.bool,
	favoriteId: PropTypes.string,
	favoriteProductId: PropTypes.number,
	finishes: PropTypes.array.isRequired,
	hasConfiguration: PropTypes.bool,
	hasProduct: PropTypes.bool,
	manufacturer: PropTypes.string,
	navigator: PropTypes.shape({
		pop: PropTypes.func,
		push: PropTypes.func,
		replace: PropTypes.func,
	}),
	onCustomizationFinished: PropTypes.func,
	optionName: PropTypes.string.isRequired,
	pricedOptionGroups: PropTypes.array.isRequired,
	productComposite: PropTypes.shape({}),
	productConfigurationId: PropTypes.string,
	selectedFinish: PropTypes.object.isRequired,
	selectedPricedOptions: PropTypes.array.isRequired,
	uniqueId: PropTypes.number,
};

ProductCustomizationScreen.defaultProps = {
	optionName: 'Finish',
	continueToNextStep: true,
};

const mapStateToProps = (state, ownProps) => {
	let hasConfiguration = false;

	let selectedFinish = {};
	let selectedPricedOptions = [];
	if (ownProps.productConfigurationId && state.productConfigurationsReducer[ownProps.productConfigurationId]) {
		const configuration = state.productConfigurationsReducer[ownProps.productConfigurationId];
		hasConfiguration = true;
		selectedFinish = configuration.selectedFinish;
		selectedPricedOptions = configuration.selectedPricedOptions;
	}

	const product = state.productsReducer[ownProps.compositeId];
	if (!product) {
		return {
			finishes: [],
			hasConfiguration: false,
			hasProduct: false,
			pricedOptionGroups: [],
			productComposite: {},
			selectedPricedOptions: [],
			selectedFinish,
		};
	}
	if (hasConfiguration) {
		return {
			finishes: product.finishes,
			hasProduct: true,
			manufacturer: product.manufacturer,
			pricedOptionGroups: product.pricedOptionGroups,
			productComposite: product,
			hasConfiguration,
			selectedFinish,
			selectedPricedOptions,
		};
	}
	// this is the old way of doing things where we don't have a product configuration instance
	// this needs to be removed in a follow up JIRA
	return {
		finishes: product.finishes,
		hasProduct: true,
		manufacturer: product.manufacturer,
		pricedOptionGroups: product.pricedOptionGroups,
		productComposite: product,
		selectedFinish: ownProps.selectedFinish || product.selectedFinish,
		selectedPricedOptions: [],
		hasConfiguration,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			addProductConfigurationTextPricedOption: productConfigurationsActions.addProductConfigurationTextPricedOption,
			addToOrSetProductConfigurationPricedOption: productConfigurationsActions.addToOrSetProductConfigurationPricedOption,
			createProductConfiguration: productConfigurationsActions.createProductConfiguration,
			setProductConfigurationFinish: productConfigurationsActions.setProductConfigurationFinish,
			setProductConfigurationPricedOption: productConfigurationsActions.setProductConfigurationPricedOption,
			getProductComposite,
			addTextPricedOption,
			setSelectedFinish,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(ProductCustomizationScreen));
