import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Animated,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import styles from '../../lib/styles';
import productsActions, {
	AVAILABILITY,
} from '../../actions/ProductsActions';
const {
	getAvailability,
	setAvailability,
} = productsActions;
import Icon from 'react-native-vector-icons/Ionicons';
import Triangle from '../Triangle';
import { isValidZipcode } from '../../lib/Validations';
import LoadingView from '../../components/LoadingView';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Text } from 'BuildLibrary';
import helpers from '../../lib/helpers';

const componentStyles = StyleSheet.create({
	barWrapper: {
		flex: 1,
		backgroundColor: styles.colors.white,
		paddingHorizontal: styles.measurements.gridSpace1,
		flexDirection: 'row',
		height: 48,
		alignItems: 'center',
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
	},
	container: {
		flexDirection: 'row',
		padding: styles.measurements.gridSpace1,
	},
	label: {
		paddingVertical: styles.measurements.gridSpace2,
		marginRight: styles.measurements.gridSpace1,
	},
	textInput: {
		flex: 1,
		alignSelf: 'center',
		height: 48,
		fontSize: styles.fontSize.regular,
		color: styles.colors.secondary,
		fontFamily: styles.fonts.mainRegular,
	},
	tooltip: {
		backgroundColor: styles.colors.white,
		borderWidth: styles.dimensions.borderWidth,
		borderTopWidth: 0,
		borderColor: styles.colors.grey,
		padding: styles.measurements.gridSpace1,
	},
	triangle: {
		position: 'absolute',
		left: 30,
	},
});

export class ZipChecker extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			bounceText: new Animated.Value(styles.fontSize.regular),
			value: '',
			error: '',
		};
	}

	bounce = () => {
		Animated.timing(
			this.state.bounceText,
			{ toValue: styles.fontSize.regular + 2 },
		).start(() => {
			Animated.timing(
				this.state.bounceText,
				{ toValue: styles.fontSize.regular },
			).start();
		});
	};

	renderClearButton = () => {
		if (this.state.value.length && !this.state.loading) {
			return (
				<TouchableOpacity
					onPress={() => {
						this.clearAvailability('', () => {
							if (this.input) {
								this.input.focus();
							}
						});
					}}
					hitSlop={{
						top: 5,
						bottom: 5,
						left: 20,
						right: 10,
					}}
				>
					<Icon
						name="ios-close-circle"
						size={22}
						color={styles.colors.grey}
					/>
				</TouchableOpacity>
			);
		}
	};

	renderTooltip = () => {
		const { availability } = this.props, { status } = availability;
		if (this.state.loading) {
			return <LoadingView />;
		} else if (this.state.error) {
			return (
				<Text
					lineHeight={false}
					textAlign="center"
					color="error"
				>
					{this.state.error}
				</Text>
			);
		} else if (availability.zipCodeAvailability && !availability.zipCodeAvailability.isAvailable) {
			const sorry = (
				<Text
					weight="bold"
					color="error"
				>
					We're sorry
				</Text>
			);
			return (
				<Text
					textAlign="center"
					color="error"
				>
					{sorry} but this is not an available shipping location for Build.com.
				</Text>
			);
		} else if (status !== AVAILABILITY.UNKNOWN) {
			switch (status) {
				case AVAILABILITY.OUT_OF_STOCK:
					return (
						<Text
							textAlign="center"
							color="accent"
							weight="bold"
						>
							Out of Stock
						</Text>
					);
				case AVAILABILITY.IN_STOCK:
					return (
						<Text textAlign="center">
							Available:{' '}
							<Text
								weight="bold"
								color="accent"
							>
								{availability.quantityAvailable} in Stock
							</Text>
						</Text>
					);
				case AVAILABILITY.INSUFFICIANT_QUANTITY:
					return (
						<Text
							color="accent"
							textAlign="center"
						>
							Sorry, but this product is not available in the quantity you selected. Please call{' '}
							<Text
								weight="bold"
								color="accent"
								onPress={() => console.warn('CLICK')}
							>
								(855) 484-3292
							</Text>
							{' '}for assistance.
						</Text>
					);
				case AVAILABILITY.BACKORDERED:
					return (
						<Text
							textAlign="center"
							color="accent"
							weight="bold"
						>
							Backordered
						</Text>
					);
				default:
					return null;
			}
		}
		const bounceStyle = {
			fontSize: this.state.bounceText,
			color: styles.colors.secondary,
		};
		return (
			<Animated.Text
				style={bounceStyle}
				textAlign="center"
				lineHeight={false}
			>
				Please enter ZIP code for availability
			</Animated.Text>
		);
	};

	validate = () => {
		const {
			actions,
			compositeId,
			quantity,
			selectedFinish,
		} = this.props;
		if (isValidZipcode(this.state.value)) {
			this.setState({ loading: true }, () => {
				actions.getAvailability(compositeId, selectedFinish.uniqueId, this.state.value, quantity)
				.catch((error) => {
					this.setState({
						isLoading: false,
						error,
					});
				})
				.done(() => {
					this.setState({ loading: false });
				});
			});
		} else {
			this.setState({ error: 'Please enter a valid ZIP code' });
		}
	};

	clearAvailability = (value = '', callback = helpers.noop) => {
		const { actions, availability, compositeId } = this.props;
		if (availability.status !== AVAILABILITY.UNKNOWN) {
			actions.setAvailability(compositeId, { status: AVAILABILITY.UNKNOWN });
		}
		this.setState({
			error: '',
			loading: false,
			value,
		}, callback);
	};

	focus = () => {
		if (this.input) {
			this.input.focus();
		}
	};

	render() {
		return (
			<View style={componentStyles.container}>
				<Text style={componentStyles.label}>Zip Code:</Text>
				<View style={styles.elements.flex1}>
					<View style={componentStyles.barWrapper}>
						<TextInput
							ref={(ref) => {
								if (ref) {
									this.input = ref;
								}
							}}
							onFocus={this.props.onFocus}
							onBlur={this.validate}
							style={componentStyles.textInput}
							autoCorrect={false}
							keyboardType="numeric"
							placeholder="Enter ZIP Code"
							maxLength={10}
							returnKeyType="done"
							value={this.state.value}
							onChangeText={(value) => {
								this.clearAvailability(value);
							}}
							onSubmitEditing={this.validate}
						/>
						{this.renderClearButton()}
					</View>
					<Triangle style={componentStyles.triangle}/>
					<View style={componentStyles.tooltip}>
						{this.renderTooltip()}
					</View>
				</View>
			</View>
		);
	}

}

ZipChecker.propTypes = {
	actions: PropTypes.object,
	availability: PropTypes.object,
	onFocus: PropTypes.func,
	compositeId: PropTypes.number.isRequired,
	selectedFinish: PropTypes.object.isRequired,
	quantity: PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => {
	return {
		availability: state.productsReducer[ownProps.compositeId].availability,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getAvailability,
			setAvailability,
		}, dispatch),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	null,
	{ withRef: true }
)(ZipChecker);
