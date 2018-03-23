import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Alert,
	View,
	Switch,
	StyleSheet,
} from 'react-native';
import {
	Text,
	ListView,
	Image,
	Button,
	withScreen,
} from 'BuildLibrary';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	deleteCreditCard,
	getCreditCards,
} from '../actions/CheckoutActions';
import {
	updateCustomer,
	getCustomerAddresses,
	deleteCustomerAddress,
} from '../actions/UserActions';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import {
	CREATE_ADDRESS,
	CREATE_CREDIT_CARD,
	DELETE_ADDRESS,
	DELETE_CREDIT_CARD,
	EDIT_ADDRESS,
	EDIT_CREDIT_CARD,
} from '../lib/analytics/TrackingActions';
import TappableListItem from '../components/TappableListItem';
import ListHeader from '../components/listHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import {
	SHIPPING_ADDRESS,
	STATE_EDIT_ADDRESS,
	STATE_ADD_ADDRESS,
} from '../constants/Addresses';
import {
	getCardImage,
	parseCardTypeName,
} from '../lib/CreditCard';
import { ACCOUNT_DETAILS_SCREEN } from '../constants/RouteIdConstants';
import Address from '../components/Address';
import { navigatorPopToRoute } from '../actions/NavigatorActions';

import { showAlert } from '../actions/AlertActions';

const componentStyles = StyleSheet.create({
	headerContainer: {
		padding: styles.measurements.gridSpace3,
		alignItems: 'center',
	},
	sectionContainer: {
		padding: styles.measurements.gridSpace1,
	},
	firstRow: {
		marginTop: styles.measurements.gridSpace1,
	},
	newButton: {
		width: styles.dimensions.width / 2,
		flex: 0,
		marginLeft: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace1,
	},
	switchRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: styles.measurements.gridSpace2,
	},
	switch: {
		marginTop: styles.measurements.gridSpace2,
	},
	rowButtons: {
		width: 52,
		maxWidth: 52,
		marginLeft: styles.measurements.gridSpace1,
	},
	objectRow: {
		paddingBottom: styles.measurements.gridSpace3,
		paddingHorizontal: styles.measurements.gridSpace1,
	},
	defaultText: {
		paddingTop: styles.measurements.gridSpace1,
	},
	paymentImage: {
		marginRight: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
	},
	cardTypeInfo: {
		flexDirection: 'row',
		alignItems: 'center',
	},
});

export class AccountDetailsScreen extends Component {

	constructor(props) {
		super(props);

		this.defaultAccountDetails = {
			addresses: [{
				component: this.renderNewAddressButton,
			}],
			payments: [{
				component: this.renderNewCreditCardButton,
			}],
			'email subscriptions': [{
				component: this.renderEmailSubscriptions,
			}],
			'account settings': [{
				component: this.renderAccountSettingsRows,
			}],
		};
		this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});

		this.state = {
			optimistic: false,
			dataSource: this.ds.cloneWithRowsAndSections(this.defaultAccountDetails),
		};

		this.optimism = {
			isSubscriber: !props.customer.isSubscriber,
		};
	}

	componentWillReceiveProps(newProps) {
		const dataSource = {
			addresses: [
				...this.getSortedAddresses(newProps),
				...this.defaultAccountDetails.addresses,
			],
			payments: [
				...this.getCreditCards(newProps),
				...this.defaultAccountDetails.payments,
			],
			'email subscriptions': this.defaultAccountDetails['email subscriptions'],
			'account settings': this.defaultAccountDetails['account settings'],
		};

		this.setState({ dataSource: this.ds.cloneWithRowsAndSections(dataSource) });
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:more:acct',
		};
	}

	getScreenData = () => {
		const { actions } = this.props;
		actions.getCreditCards().catch(helpers.noop).done();
		actions.getCustomerAddresses().catch(helpers.noop).done();
	};

	getCreditCards = (props) => {
		let { creditCards } = props;
		const { defaultCard } = props;

		if (defaultCard && defaultCard.creditCardId) {
			defaultCard.isDefault = true;
			creditCards = [defaultCard].concat(creditCards);
		}

		return creditCards;
	};

	getSortedAddresses = (props) => {
		const { addresses, defaultShippingAddressId } = props;
		return addresses
			.sort((a, b) => b.addressId - a.addressId)
			.sort((a, b) => b.addressId === defaultShippingAddressId ? Number.POSITIVE_INFINITY : 0);
	};

	addOrEditAddress = (address) => {
		const addressScreenState = address ? STATE_EDIT_ADDRESS : STATE_ADD_ADDRESS;
		this.props.navigator.push('newAddress', {
			address,
			addressScreenState,
			title: address ? 'Edit Address' : 'New Address',
			addressTypeId: SHIPPING_ADDRESS,
			onSaveSuccess: this.navigateToAccountDetails,
		});
	};

	changePassword = () => {
		this.props.navigator.push('changePassword');
	};

	deleteCreditCard = (creditCardId) => {
		Alert.alert(
			'Delete Credit Card',
			'Are you sure you want to delete your card?',
			[
				{ text: 'No' },
				{
					text: 'Yes',
					onPress: () => {
						this.props.actions.deleteCreditCard(creditCardId)
							.then(() => {
								this.props.actions.showAlert('Successfully deleted Credit Card');
							})
							.catch(() => {
								this.props.actions.showAlert('Failed to delete Credit Card', 'error');
							})
							.done();
					},
				},
			]
		);
	};

	deleteCustomerAddress = (addressId) => {
		Alert.alert(
			'Delete Address',
			'Are you sure you want to delete your address?',
			[
				{ text: 'No' },
				{
					text: 'Yes',
					onPress: () => {
						this.props.actions.deleteCustomerAddress(addressId)
							.then(() => {
								this.props.actions.showAlert('Successfully deleted address');
							})
							.catch(() => {
								this.props.actions.showAlert('Failed to delete address', 'error');
							})
							.done();
					},
				},
			]
		);
	};

	editDetails = () => {
		this.props.navigator.push('editAccountDetails');
	};

	onPressNewCardButton = () => {
		this.props.navigator.push('creditCardScreen', {
			hideTabs: false,
			onSaveSuccess: this.navigateToAccountDetails,
			isCheckout: false,
		});
	};

	navigateToAccountDetails = () => {
		navigatorPopToRoute(ACCOUNT_DETAILS_SCREEN, 'more');
	};

	toggleEmailSubscription = (isSubscriber) => {
		this.setState({ optimistic: true });
		this.props.actions.updateCustomer({ isSubscriber })
			.then(() => {
				this.setState({ optimistic: false });
				this.optimism.isSubscriber = !this.optimism.isSubscriber;
			})
			.catch(() => {
				this.setState({ optimistic: false });
			})
			.done();
	};

	updateCreditCard = (creditCardId) => {
		this.props.navigator.push('creditCardScreen', {
			title: 'Update Card',
			hideTabs: false,
			onSaveSuccess: this.navigateToAccountDetails,
			isCheckout: false,
			isEdit: true,
			creditCardId,
		});
	};

	renderAccountSettingsRows = () => {
		return (
			<View>
				<TappableListItem
					accessibilityLabel="Change Password"
					body="Change Password"
					onPress={this.changePassword}
				/>
				<TappableListItem
					accessibilityLabel="Edit Account Details"
					body="Edit Account Details"
					onPress={this.editDetails}
				/>
			</View>
		);
	};

	renderAddress = (address, index) => {
		const style = !index ? componentStyles.firstRow : null;

		return (
			<View style={[componentStyles.objectRow, style]}>
				<View style={styles.elements.centeredFlexRow}>
					<Address
						address={address}
						style={styles.elements.flex}
					/>
					<View style={styles.elements.centeredFlexRow}>
						<Button
							style={componentStyles.rowButtons}
							color="white"
							accessibilityLabel="Edit Address"
							onPress={() => this.addOrEditAddress(address)}
							trackAction={EDIT_ADDRESS}
						>
							<Icon
								size={30}
								name="md-create"
								color={styles.colors.secondary}
							/>
						</Button>
						<Button
							style={componentStyles.rowButtons}
							color="white"
							accessibilityLabel="Remove Address"
							onPress={() => this.deleteCustomerAddress(address.addressId)}
							trackAction={DELETE_ADDRESS}
						>
							<Icon
								size={30}
								name="ios-trash"
								color={styles.colors.secondary}
							/>
						</Button>
					</View>
				</View>
			</View>
		);
	};

	renderCreditCard = (creditCard, index) => {
		const style = !index ? componentStyles.firstRow : null;

		return (
			<View style={[componentStyles.objectRow, style]}>
				<View style={styles.elements.centeredFlexRow}>
					<View style={styles.elements.flex}>
						<View style={componentStyles.cardTypeInfo}>
							<Image
								style={componentStyles.paymentImage}
								source={getCardImage(parseCardTypeName(creditCard.cardType))}
								resizeMode="contain"
								height={60}
								width={60}
							/>
							<Text>****{creditCard.lastFour}</Text>
						</View>
						<Text lineHeight={false}>Expires {helpers.getFormattedDate(creditCard.expDate, 'MM/YY')}</Text>
					</View>
					{this.renderCreditCardEditDeleteButtons(creditCard)}
				</View>
				{this.renderIsDefaultCard(creditCard)}
			</View>
		);
	};

	renderCreditCardEditDeleteButtons = ({ creditCardId }) => {
		return (
			<View style={styles.elements.centeredFlexRow}>
				<Button
					style={componentStyles.rowButtons}
					color="white"
					accessibilityLabel="Edit Card"
					onPress={() => this.updateCreditCard(creditCardId)}
					trackAction={EDIT_CREDIT_CARD}
				>
					<Icon
						size={30}
						name="md-create"
						color={styles.colors.secondary}
					/>
				</Button>
				<Button
					style={componentStyles.rowButtons}
					color="white"
					accessibilityLabel="Remove Card"
					onPress={() => this.deleteCreditCard(creditCardId)}
					trackAction={DELETE_CREDIT_CARD}
				>
					<Icon
						size={30}
						name="ios-trash"
						color={styles.colors.secondary}
					/>
				</Button>
			</View>
		);
	};

	renderCustomerInfo = () => {
		const { customer } = this.props;
		return (
			<View style={componentStyles.headerContainer}>
				{this.renderProBadge()}
				<Text weight="bold">{customer.firstName} {customer.lastName}</Text>
				<Text>{customer.email}</Text>
			</View>
		);
	};

	renderEmailSubscriptions = () => {
		const {customer} = this.props;
		return (
			<View style={componentStyles.sectionContainer} >
				<View style={componentStyles.switchRow}>
					<View style={styles.elements.flex}>
						<Text>Promotional Emails</Text>
						<Text size="small">Get notified on the best deals and coupons.</Text>
					</View>
					<Switch
						style={componentStyles.switch}
						onTintColor={styles.colors.primary}
						value={this.state.optimistic ? this.optimism.isSubscriber : customer.isSubscriber}
						onValueChange={this.toggleEmailSubscription}
					/>
				</View>
			</View>
		);
	};

	renderIsDefaultCard = (creditCard) => {
		if (creditCard.isDefault) {
			return (
				<Text
					color="accent"
					style={componentStyles.defaultText}
				>
					PREFERRED CARD
				</Text>
			);
		}
	};

	renderNewAddressButton = () => {
		return (
			<Button
				color="white"
				text="New Address"
				style={componentStyles.newButton}
				accessibilityLabel="New Address"
				textColor="secondary"
				onPress={this.addOrEditAddress}
				trackAction={CREATE_ADDRESS}
			/>
		);
	};

	renderNewCreditCardButton = () => {
		return (
			<Button
				color="white"
				textColor="secondary"
				text="New Card"
				style={componentStyles.newButton}
				accessibilityLabel="New Card"
				onPress={this.onPressNewCardButton}
				trackAction={CREATE_CREDIT_CARD}
			/>
		);
	};

	renderProBadge = () => {
		const { customer } = this.props;
		if (customer.isPro) {
			return (
				<Image
					source={require('../images/pro_stamp.png')}
					resizeMode="contain"
					size="none"
				/>
			);
		}
	};

	renderRows = (rowData, sectionId, rowId) => {
		if (typeof rowData.component === 'function') {
			return rowData.component();
		}

		if (sectionId === 'addresses') {
			return this.renderAddress(rowData, parseInt(rowId, 10));
		} else if (sectionId === 'payments') {
			return this.renderCreditCard(rowData, parseInt(rowId, 10));
		}
	};

	renderSectionHeader = (sectionData, sectionID) => {
		return <ListHeader text={sectionID.toUpperCase()} />;
	};

	render() {
		return (
			<View
				style={styles.elements.screen}
			>
				<ListView
					dataSource={this.state.dataSource}
					enableEmptySections={false}
					renderHeader={this.renderCustomerInfo}
					renderRow={this.renderRows}
					renderSectionHeader={this.renderSectionHeader}
					scrollsToTop={true}
				/>
			</View>
		);
	}
}

AccountDetailsScreen.route = {
	navigationBar: {
		title: 'Account Details',
	},
};

AccountDetailsScreen.propTypes = {
	customer: PropTypes.object.isRequired,
	creditCards: PropTypes.array,
	defaultCard: PropTypes.object,
	addresses: PropTypes.array,
	loading: PropTypes.bool,
	actions: PropTypes.object,
	defaultShippingAddressId: PropTypes.number,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
};

AccountDetailsScreen.defaultProps = {
	customer: {},
	creditCards: [],
	addresses: [],
};

const mapStateToProps = (state) => {
	return {
		customer: state.userReducer.user,
		creditCards: state.checkoutReducer.creditCards,
		defaultCard: state.checkoutReducer.defaultCard,
		addresses: state.userReducer.user.shippingAddresses,
		loading: state.userReducer.isLoading,
		defaultShippingAddressId: state.userReducer.user.defaultShippingAddressId,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getCreditCards,
			updateCustomer,
			getCustomerAddresses,
			deleteCustomerAddress,
			deleteCreditCard,
			showAlert,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(AccountDetailsScreen));
