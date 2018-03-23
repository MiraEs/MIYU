import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	ActionSheetIOS,
	Alert,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styles from '../lib/styles';
import {
	Button,
	Image,
	ListView,
	withScreen,
	Text,
} from 'BuildLibrary';
import { getQuoteComposite } from '../actions/QuotesActions';
import { loadQuote } from '../actions/CartActions';
import helpers from '../lib/helpers';
import TrackingActions from '../lib/analytics/TrackingActions';
import EventEmitter from '../lib/eventEmitter';
import {
	IMAGE_75,
	IMAGE_100,
} from '../constants/CloudinaryConstants';
import ExpandableListItem from '../components/ExpandableCartItem';
import environment from '../lib/environment';
import ContactUsHelper from '../lib/ContactUsHelper';
import { showAlert } from '../actions/AlertActions';
import PhoneHelper from '../lib/PhoneHelper';

const componentStyles = StyleSheet.create({
	bottomBorder: {
		borderColor: styles.colors.greyLight,
		borderBottomWidth: styles.dimensions.borderWidth,
		paddingBottom: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace1,
	},
	headerDetails: {
		marginHorizontal: styles.measurements.gridSpace1,
	},
	bottomLayout: {
		backgroundColor: styles.colors.white,
		borderColor: styles.colors.grey,
		borderTopWidth: styles.dimensions.borderWidth,
	},
	estimatedTotal: {
		flexDirection: 'row',
		padding: styles.measurements.gridSpace2,
		justifyContent: 'space-between',
	},
	header: {
		backgroundColor: styles.colors.white,
		flexDirection: 'row',
		padding: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace1,
	},
	imageWrapper: {
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.lightGray,
		borderRadius: IMAGE_75.width / 2,
		marginTop: styles.measurements.gridSpace1,
		marginHorizontal: styles.measurements.gridSpace1,
	},
	screen: {
		flex: 1,
		backgroundColor: styles.colors.greyLight,
	},
});

export class QuoteScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loadingCart: false,
			dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
		};
	}


	componentWillReceiveProps({ composite }) {
		if (composite) {
			const { quote } = composite;
			if (composite !== this.props.composite && quote && !quote.isValid) {
				Alert.alert(
					'Cart not valid',
					`This cart is no longer valid because it has ${Date.now() > quote.expirationDate ? 'expired' : 'already been purchased'}.`,
					[{
						text: 'OK',
						onPress: () => this.props.navigator.pop(),
					}], {
						cancelable: false,
					},
				);
			} else if (composite.sessionCart) {
				this.setState({
					dataSource: this.state.dataSource.cloneWithRows(composite.sessionCart.sessionCartItems),
				});
			}
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:quotes',
		};
	}

	getScreenData = () => {
		this.props.actions.getQuoteComposite(this.props.quoteNumber);
	};

	renderHeaderTotal = () => {
		const { quote, sessionCart } = this.props.composite;
		if (!quote.hidePricing) {
			return (
				<Text size="small">Estimated Total: <Text
					weight="bold"
					size="small"
				>{helpers.toUSD(sessionCart.subTotal)}</Text></Text>
			);
		}
	};

	renderFooterTotal = () => {
		const { quote, sessionCart } = this.props.composite;
		if (!quote.hidePricing && sessionCart) {
			return (
				<View style={componentStyles.estimatedTotal}>
					<Text
						lineHeight={false}
						weight="bold"
					>
						Estimated Total
					</Text>
					<Text
						lineHeight={false}
						color="primary"
						size="large"
						weight="bold"
					>
						{helpers.toUSD(sessionCart.subTotal)}
					</Text>
				</View>
			);
		}
	};

	onPressLoadCart = () => {
		const cartOptions = {
			quoteNumber: this.props.quoteNumber,
		};
		const onPress = (options) => {
			if (!this.state.loadingCart) {
				this.setState({ loadingCart: true });
				this.props.actions.loadQuote(options)
				.then(() => {
					this.props.navigation.getNavigator('root').push('cartScreen', {
						title: 'Shopping Cart',
					});
					this.props.navigator.pop();
				})
				.catch(() => {
					this.setState({ loadingCart: false });
					this.props.actions.showAlert('Unable to load cart.', 'error');
				})
				.done();
			}
		};
		const buttons = [{
			text: 'Discard Current Cart',
			onPress: () => onPress(cartOptions),
		}, {
			text: 'Merge with Current Cart',
			onPress: () => onPress({
				...cartOptions,
				sessionCartId: this.props.cart.sessionCartId,
			}),
		}, {
			text: 'Cancel',
			onPress: helpers.noop,
		}];
		const { cart } = this.props;
		if (cart.sessionCartItems && !cart.sessionCartItems.length) {
			onPress(cartOptions);
		} else {
			if (helpers.isIOS()) {
				ActionSheetIOS.showActionSheetWithOptions({
					options: buttons.map((button) => button.text),
					cancelButtonIndex: buttons.length - 1,
					tintColor: styles.colors.secondary,
				}, (index) => buttons[index].onPress());
			} else {
				delete buttons[buttons.length - 1];
				EventEmitter.emit('showActionSheet', {
					title: 'Load Cart',
					options: buttons,
				});
			}
		}
	};

	renderProjectName = (quote) => {
		if (quote.projectTitle) {
			return (
				<Text
					weight="bold"
					size="small"
				>
					{quote.projectTitle}
				</Text>
			);
		}
	};

	renderPhoneNumber = (quote) => {
		if (quote.phoneNumber && quote.employeeId) {
			const phone = {
				phoneNumber: quote.phoneNumber,
			};
			return (
				<TouchableOpacity onPress={() => ContactUsHelper.callUs(phone)}>
					<Text
						color="primary"
						weight="bold"
						size="small"
					>
						{PhoneHelper.formatPhoneNumber(phone)}
					</Text>
				</TouchableOpacity>
			);
		}
	};

	renderName = (quote) => {
		if (quote.externalSenderName || quote.employeeFullName) {
			return (
				<Text
					size="small"
					weight="bold"
				>
					{quote.externalSenderName || quote.employeeFullName}
				</Text>
			);
		}
	};

	renderEmail = (quote) => {
		const email = quote.employeeEmail || quote.externalSenderEmail;
		if (email) {
			return (
				<TouchableOpacity onPress={() => helpers.emailUs(email)}>
					<Text
						size="small"
						color="primary"
						weight="bold"
					>
						{email}
					</Text>
				</TouchableOpacity>
			);
		}
	};

	renderHeaderImage = (quote) => {
		const source = {
			uri: helpers.getProfileImage({ repUserId: quote.employeeId }),
		};
		return (
			<Image
				resizeMode="contain"
				source={source}
				{...IMAGE_100}
			/>
		);
	};

	renderHeader = () => {
		const { composite: { sessionCart, quote } } = this.props;
		if (sessionCart && quote) {
			return (
				<View style={componentStyles.header}>
					{this.renderHeaderImage(quote)}
					<View>
						<View style={[componentStyles.headerDetails, componentStyles.bottomBorder]}>
							<Text size="small">Cart Number: <Text
								weight="bold"
								size="small"
							>{quote.cartNumber}</Text></Text>
							{this.renderProjectName(quote)}
							<Text size="small">Total Items: <Text
								weight="bold"
								size="small"
							>{sessionCart.quantity}</Text></Text>
							{this.renderHeaderTotal()}
						</View>
						<View style={componentStyles.headerDetails}>
							{this.renderName(quote)}
							{this.renderEmail(quote)}
							{this.renderPhoneNumber(quote)}
							<Text size="small">Created: <Text
								weight="bold"
								size="small"
							>{helpers.getDateStrictFormat(quote.quoteCreateDate)}
							</Text></Text>
							<Text size="small">Exp: <Text
								weight="bold"
								size="small"
							>{helpers.getDateStrictFormat(quote.expirationDate)}</Text></Text>
						</View>
					</View>
				</View>
			);
		}
	};

	renderSeparator = (sectionId, rowId) => {
		const { sessionCartItems } = this.props.composite.sessionCart;
		const style = {
			height: rowId < sessionCartItems.length - 1 ? styles.measurements.gridSpace1 : 0,
		};
		return (
			<View
				key={rowId}
				style={style}
			/>
		);
	};

	renderButton = () => {
		const { hidePricing, onlineAllowed } = this.props.composite.quote;
		if (hidePricing || !onlineAllowed) {
			return (
				<Button
					isLoading={this.state.loadingCart}
					text="Call to Order"
					onPress={() => ContactUsHelper.callUs({ phoneNumber: environment.phone })}
					trackAction={TrackingActions.QUOTE_CALL_TO_ORDER}
					accessibilityLabel="Call to Order Button"
				/>
			);
		}
		return (
			<Button
				isLoading={this.state.loadingCart}
				text="Load Cart"
				onPress={this.onPressLoadCart}
				trackAction={TrackingActions.QUOTE_LOAD_CART}
				accessibilityLabel="Load Cart Button"
			/>
		);
	};

	renderScreenContent = () => {
		const { composite, error } = this.props;
		if (composite) {
			return (
				<View style={styles.elements.flex1}>
					<ListView
						renderHeader={this.renderHeader}
						dataSource={this.state.dataSource}
						renderRow={(item) => (
							<ExpandableListItem
								hidePricing={composite.quote.hidePricing}
								item={item}
							/>
						)}
						renderSeparator={this.renderSeparator}
					/>
					<View style={componentStyles.bottomLayout}>
						{this.renderFooterTotal()}
						{this.renderButton()}
					</View>
				</View>
			);
		}
		if (error) {
			return <Text textAlign="center">{this.props.error}</Text>;
		}
	};

	render() {
		return (
			<View style={styles.elements.screenGreyLight}>
				<View
					style={componentStyles.screen}
				>
					{this.renderScreenContent()}
				</View>
			</View>
		);
	}

}

QuoteScreen.route = {
	navigationBar: {
		visible: true,
		title: 'Saved Cart Preview',
	},
};

const mapStateToProps = (state, ownProps) => {
	return {
		cart: state.cartReducer.cart,
		composite: state.quotesReducer.composites[ownProps.quoteNumber],
		error: state.quotesReducer.error,
		loading: !state.quotesReducer.composites.hasOwnProperty(ownProps.quoteNumber) && !state.quotesReducer.error,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			loadQuote,
			getQuoteComposite,
			showAlert,
		}, dispatch),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withScreen(QuoteScreen));

QuoteScreen.propTypes = {
	actions: PropTypes.object,
	cart: PropTypes.object,
	error: PropTypes.string,
	loading: PropTypes.bool,
	title: PropTypes.string,
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
	navigator: PropTypes.shape({
		pop: PropTypes.func,
		replace: PropTypes.func,
	}),
	composite: PropTypes.shape({
		quote: PropTypes.object,
		sessionCart: PropTypes.object,
	}),
	quoteNumber: PropTypes.string.isRequired,
};
