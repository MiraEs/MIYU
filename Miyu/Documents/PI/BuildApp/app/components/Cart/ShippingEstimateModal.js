import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	Text,
	Button,
} from 'BuildLibrary';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';
import EventEmitter from '../../lib/eventEmitter';
import Form from '../Form';
import FormInput from '../FormInput';
import LoadingView from '../LoadingView';
import { FREE_SHIPPING } from '../../constants/constants';
import TrackingActions from '../../lib/analytics/TrackingActions';
import {
	updateSessionCart,
	setSelectedShippingIndex,
} from '../../actions/CartActions';
import { showAlert } from '../../actions/AlertActions';
import PhoneHelper from '../../lib/PhoneHelper';

const componentStyles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: 'flex-start',
	},
	contentWithInput: {
		backgroundColor: styles.colors.white,
		paddingHorizontal: styles.measurements.gridSpace1,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
	},
	contentWithList: {
		flex: 1,
		backgroundColor: styles.colors.greyLight,
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingTop: styles.measurements.gridSpace2,
		paddingBottom: styles.measurements.gridSpace1,
	},
	border: {
		padding: styles.dimensions.borderWidth,
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
	},
	borderSelected: {
		borderWidth: styles.dimensions.borderWidthLarge,
		borderColor: styles.colors.accent,
	},
	shippingOption: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: styles.colors.white,
		marginBottom: styles.measurements.gridSpace1,
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingTop: styles.measurements.gridSpace1,
		paddingBottom: styles.measurements.gridSpace2,
	},
	shippingCost: {
		flexDirection: 'row',
	},
});

export class ShippingEstimateModal extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			selectedShippingIndex: props.selectedShippingIndex,
			shippingOptions: props.cart.shippingOptions || [],
			zipCode: props.cart.zipCode,
		};
	}

	componentWillReceiveProps(nextProps) {
		const { cart } = nextProps;

		this.setState({
			shippingOptions: cart.shippingOptions || [],
			zipCode: cart.zipCode,
		});
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:shippingestimatemodal',
		};
	}

	onChange = (shippingForm) => {
		const zipCode = shippingForm['zipCode'].value || null;

		this.setState({
			noResults: false,
			zipCode,
		}, () => {
			if (!zipCode) {
				this.onEnterZipcode();
			}
		});
	};

	onEnterZipcode = () => {
		const { actions: { showAlert, updateSessionCart }, cart } = this.props;
		const { zipCode } = this.state;

		this.setState({
			isLoading: true,
			noResults: false,
			selectedShippingIndex: -1,
		}, () => {
			updateSessionCart({
				sessionCartId: cart.sessionCartId,
				cart: { zipCode },
			})
			.then(() => {
				this.setState((prevState) => {
					return {
						noResults: prevState.shippingOptions.length === 0,
						isLoading: false,
					};
				});
			})
			.catch(() => {
				showAlert('Invalid ZIP Code', 'error');
				this.setState((prevState) => {
					return {
						zipCode: cart.zipCode,
						noResults: prevState.shippingOptions.length === 0,
						isLoading: false,
					};
				});
			})
			.done();
		});
	};

	onSelectShippingOption = (selectedShippingIndex) => {
		const { actions: { setSelectedShippingIndex }, onClose } = this.props;

		this.setState({ selectedShippingIndex }, () => {
			setSelectedShippingIndex(selectedShippingIndex);
			onClose();
		});
	};

	renderShippingOptions = () => {
		const { shippingOptions } = this.state;
		const { onClose } = this.props;
		const filtered = (shippingOptions) ? shippingOptions.filter((option) => option.customerAvailable) : [];

		if (this.state.isLoading) {
			return <LoadingView backgroundColor={styles.colors.greyLight}/>;
		}

		if (this.state.noResults) {
			return <Text>ZIP Code not found.</Text>;
		}

		if (shippingOptions.length > 0 !== filtered.length > 0) {
			const phone = PhoneHelper.getPhoneNumberByUserType(this.props.user);
			return (
				<View>
					<Text>
						Please contact us at{' '}
						<Text
							color="primary"
							onPress={() => {
								EventEmitter.emit('onCallUs', phone, true);
								onClose();
							}}
						>
							{PhoneHelper.formatPhoneNumber(phone)}
						</Text>
						{' '}for a shipping estimate.{'\n'}
					</Text>
					<Button
						onPress={this.props.onClose}
						text="Back to Cart"
						accessibilityLabel="Back to Cart Button"
						trackAction={TrackingActions.BACK_TO_CART}
					/>
				</View>
			);
		} else {
			return shippingOptions.map((option, index) => {
				const border = index === this.state.selectedShippingIndex ? componentStyles.borderSelected : componentStyles.border;
				let cost = (
					<Text
						color="primaryDark"
						weight="bold"
					>
						{helpers.toUSD(option.shippingCost)}
					</Text>);

				if (option.shippingCost === 0) {
					cost = (
						<View style={componentStyles.shippingCost}>
							<Text decoration="line-through">{helpers.toUSD(FREE_SHIPPING)} </Text>
							<Text
								color="accent"
								weight="bold"
							>
								FREE
							</Text>
						</View>
					);
				}

				return (
					<TouchableOpacity
						key={index}
						onPress={() => this.onSelectShippingOption(index)}
						accessibilityLabel={option.shippingName}
					>
						<View style={[componentStyles.shippingOption, border]}>
							<View>
								<Text>{option.shippingName}</Text>
								{cost}
							</View>
						</View>
					</TouchableOpacity>
				);
			});
		}
	};

	render() {
		return (
			<View style={componentStyles.screen}>
				<View style={componentStyles.contentWithInput}>
					<Form
						ref={(ref) => this.shippingForm = ref}
						onChange={this.onChange}
					>
						<FormInput
							autoCapitalize="characters"
							autoCorrect={false}
							name="zipCode"
							clearButtonMode="always"
							label="ZIP Code:"
							inlineLabel={true}
							onSubmitEditing={this.onEnterZipcode}
							placeholder="Enter Shipping ZIP Code"
							returnKeyType="go"
							value={this.state.zipCode}
							scrollToOnFocus={false}
							keyboardType="numbers-and-punctuation"
							accessibilityLabel="Zip Code Input"
						/>
					</Form>
				</View>
				<View style={componentStyles.contentWithList}>
					{this.renderShippingOptions()}
				</View>
			</View>
		);
	}
}

ShippingEstimateModal.propTypes = {
	actions: PropTypes.object.isRequired,
	cart: PropTypes.object.isRequired,
	selectedShippingIndex: PropTypes.number.isRequired,
	onClose: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
	return {
		cart: state.cartReducer.cart,
		selectedShippingIndex: state.cartReducer.selectedShippingIndex,
		user: state.userReducer.user,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			setSelectedShippingIndex,
			showAlert,
			updateSessionCart,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ShippingEstimateModal);
