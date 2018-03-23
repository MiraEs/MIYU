'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import {
	QuantitySelector,
	Text,
	TouchableOpacity,
} from 'BuildLibrary';
import styles from '../../lib/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import helpers from '../../lib/helpers';
import scrollableHelpers from '../../lib/ScrollableHelpers';
import Form from '../Form';
import FormDropDown from '../FormDropDown';
import FormInput from '../FormInput';
import SimplifiedProductInfo from './SimplifiedProductInfo';

const componentStyles = StyleSheet.create({
	errorContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	errorIcon: {
		marginBottom: styles.measurements.gridSpace2,
		marginRight: 4,
	},
	errorText: {
		flex: 1,
		marginBottom: styles.measurements.gridSpace2,
	},
	quantitySelectorRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	quantitySelectorWrapper: {
		marginVertical: styles.measurements.gridSpace1,
		marginRight: styles.measurements.gridSpace2,
		width: 136,
	},
});

const OTHER_REASON_VALUE = 3;

class ItemForReturn extends Component {
	constructor(props) {
		super(props);

		this.quantitySelector;
		this.reasons = [{
			text: 'Don\'t like it',
			value: 1,
		}, {
			text: 'Broken',
			value: 2,
		}, {
			text: 'Other',
			value: 3,
		}];
	}

	componentDidMount() {
		if (!this.props.item.returnQuantity) {
			this.onUpdateQuantity(1);
		}
	}

	componentDidUpdate({ item: oldItem = {} }) {
		const { reason: oldReason } = oldItem;
		const { item: newItem = {} } = this.props;
		const { reason: newReason } = newItem;
		if (newReason === OTHER_REASON_VALUE && newReason !== oldReason) {
			this.reasonText && this.reasonText.focus();
		}
	}

	get valid() {
		const validReason = this.props.item.reason && this.props.item.reason !== OTHER_REASON_VALUE;
		const validOtherReason = this.props.item.reason === OTHER_REASON_VALUE && !!this.props.item.reasonText;
		const validQuantity = this.isQuantityValid();

		return !this.props.item.selected || (
			validQuantity && (
				validReason ||
				validOtherReason
			)
		);
	}

	getItemWrapperStyle = () => {
		let additionalStyles = {};
		if (this.props.item.selected) {
			additionalStyles = {
				borderColor: styles.colors.accent,
			};
		}

		return additionalStyles;
	};

	handleChange = ({ reason: reasonObj = {}, reasonText: reasonTextObj = {} }) => {
		const {
			value: reason = '',
		} = reasonObj;
		const {
			value: reasonText = '',
		} = reasonTextObj;
		const {
			index,
			onUpdateItem,
		} = this.props;
		onUpdateItem(index, {
			reason,
			reasonText,
		});
	};

	isQuantityValid = () => {
		const {
			item: {
				quantity,
				returnQuantity,
			},
		} = this.props;
		return !!returnQuantity && returnQuantity <= quantity;
	}

	onUpdateQuantity = (returnQuantity) => {
		const {
			index,
			onUpdateItem,
		} = this.props;
		onUpdateItem(index, {
			returnQuantity,
		});
	}

	onPressItem = () => {
		const {
			index,
			item: { selected },
			onUpdateItem,
		} = this.props;
		onUpdateItem(index, {
			selected: !selected,
		});
	}

	onQuantityInputFocus = () => {
		const {
			parentScrollHandle,
		} = this.props;

		if (this.quantitySelector && parentScrollHandle) {
			const scrollResponder = parentScrollHandle.getScrollResponder();
			scrollableHelpers.scrollRefToKeyboard(scrollResponder, this.quantitySelector, {
				offset: 330,
			});
		}
	};

	renderQuantityError = () => {
		if (!this.isQuantityValid()) {
			const errorText = this.props.item.returnQuantity ?
				'Sorry you can’t return more than you ordered.' :
				'Sorry the number of returned items must be greater than zero.';
			return (
				<View style={componentStyles.errorContainer}>
					<Icon
						name={helpers.getIcon('close-circle')}
						size={16}
						color={styles.colors.error}
						style={componentStyles.errorIcon}
					/>
					<Text
						color="error"
						lineHeight={false}
						style={componentStyles.errorText}
						size="small"
						weight="bold"
					>
						{errorText}
					</Text>
				</View>
			);
		}
	}

	renderQuantitySelector = () => {
		const {
			item: {
				quantity: maxQuantity,
				returnQuantity: quantity = 1,
			},
		} = this.props;

		if (maxQuantity > 1) {
			return (
				<View>
					<Text
						style={{
						}}
						weight="bold"
					>
						How many do you want to return?
					</Text>
					<View style={componentStyles.quantitySelectorRow}>
						<View style={componentStyles.quantitySelectorWrapper}>
							<QuantitySelector
								ref={(ref) => {
									if (ref) {
										this.quantitySelector = ref;
									}
								}}
								allowZero={true}
								disableDelete={true}
								maxQuantity={maxQuantity}
								quantity={quantity}
								onInputFocus={this.onQuantityInputFocus}
								onUpdateQuantity={this.onUpdateQuantity}
								theme="mini"
							/>
						</View>
						<Text>of {maxQuantity}</Text>
					</View>
					{this.renderQuantityError()}
				</View>
			);
		}
	}

	renderReasonText = () => {
		const {
			item: {
				reason,
				reasonText,
			},
		} = this.props;
		if (reason === OTHER_REASON_VALUE) {
			return (
				<FormInput
					name="reasonText"
					ref={(ref) => this.reasonText = ref}
					isRequired={true}
					isRequiredError="Required."
					label="Explanation*"
					value={reasonText}
					componentStyle={[styles.elements.flex, componentStyles.inputMargin]}
					accessibilityLabel="Explanation"
				/>
			);
		}
	}

	renderReturnForm = () => {
		const {
			item: {
				reason,
				selected,
			},
			parentScrollHandle,
		} = this.props;
		if (selected) {
			// place holder is using an mdash; not a hyphen
			return (
				<Form
					ref={(c) => this.reasonForm = c}
					alternateScrollHandle={parentScrollHandle}
					onChange={this.handleChange}
					scrollsToTop={true}
				>
					{this.renderQuantitySelector()}
					<FormDropDown
						name="reason"
						isRequired={true}
						isRequiredError="Required."
						modalDescription="Select Reason for Return"
						options={this.reasons}
						label="Reason*"
						placeholder="— Please select reason —"
						value={reason}
						accessibilityLabel="Reason"
					/>
					{this.renderReasonText()}
				</Form>
			);
		}
	};

	render() {
		const {
			item,
			item: {
				productCompositeId,
				productId,
				productUniqueId,
			},
		} = this.props;

		return (
				<TouchableOpacity
					onPress={this.onPressItem}
					trackAction="test"
					trackContextData={{
						productCompositeId,
						productId,
						productUniqueId,
					}}
				>
					<SimplifiedProductInfo
						{...item}
						style={this.getItemWrapperStyle()}
					>
						{this.renderReturnForm()}
					</SimplifiedProductInfo>
				</TouchableOpacity>
		);
	}
}

ItemForReturn.propTypes = {
	index: PropTypes.number.isRequired,
	item: PropTypes.shape({
		finish: PropTypes.string,
		image: PropTypes.string,
		manufacturer: PropTypes.string,
		productCompositeId: PropTypes.number,
		productId: PropTypes.number,
		productUniqueId: PropTypes.number,
		quantity: PropTypes.number,
		reason: PropTypes.number,
		reasonText: PropTypes.string,
		returnQuantity: PropTypes.number,
		selected: PropTypes.bool,
		sku: PropTypes.string,
		title: PropTypes.string,
		unitPrice: PropTypes.number,
	}),
	parentScrollHandle: PropTypes.object.isRequired,
	onUpdateItem: PropTypes.func.isRequired,
};

ItemForReturn.defaultProps = {
	onUpdateItem: helpers.noop,
};

export default ItemForReturn;
