'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	Alert,
	ActionSheetIOS,
	RefreshControl,
	findNodeHandle,
	Animated,
} from 'react-native';
import SwipeableListView from '../../node_modules/react-native/Libraries/Experimental/SwipeableRow/SwipeableListView';
import SwipeableListViewDataSource from '../../node_modules/react-native/Libraries/Experimental/SwipeableRow/SwipeableListViewDataSource';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationStyles } from '@expo/ex-navigation';
import {
	getCustomerCarts,
	getSessionCart,
	updateSessionCart,
	deleteSessionCart,
	updateSessionCartItem,
	deleteSessionCartItem,
	getSessionCartErrors,
	setSessionCartItemDeleteStatus,
	clearSessionCartItemDeleteStatus,
	setSessionCartItemProps,
	setSelectedShippingIndex,
	saveCartTemplate,
	sendQuote,
	loadQuote,
	mergeSessionCarts,
	updateCartItemBounce,
} from '../actions/CartActions';
import {
	MAIN,
	LISTS,
	SITE_ID,
} from '../constants/constants';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import productHelpers from '../lib/productHelpers';
import EventEmitter from '../lib/eventEmitter';
import {
	withScreen,
	Text,
} from 'BuildLibrary';
import {
	navigatorPop,
	navigatorPush,
} from '../actions/NavigatorActions';
import {
	CART_TIMEOUT,
	UPDATE_DELAY,
} from '../constants/CartConstants';
import { PAYPAL } from '../constants/CheckoutConstants';
import NavigationBarIconButton from '../components/navigationBar/NavigationBarIconButton';
import LoadingView from '../components/LoadingView';
import trackingActions from '../lib/analytics/TrackingActions';
import tracking from '../lib/analytics/tracking';
import EmptyCart from '../components/Cart/EmptyCart';
import CartRow from '../components/Cart/CartRow';
import CartRowActions from '../components/Cart/CartRowActions';
import CartRowFooter from '../components/Cart/CartRowFooter';
import ShippingEstimateModal from '../components/Cart/ShippingEstimateModal';
import SaveCartModal from '../components/Cart/SaveCartModal';
import LoadCartModal from '../components/Cart/LoadCartModal';
import EmailCartModal from '../components/Cart/EmailCartModal';
import PaymentMethodModal from '../components/Cart/PaymentMethodModal';
import { getDefaultShippingAddress } from '../services/customerService';
import { ANIMATION_TIMEOUT_200 } from '../constants/AnimationConstants';
import {
	trackAction,
	trackState,
} from '../actions/AnalyticsActions';
import { showAlert } from '../actions/AlertActions';
import { itemAddedToProject } from '../actions/ProjectActions';
import router from '../router';

const componentStyles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	component: {
		flex: 1,
		backgroundColor: styles.colors.white,
	},
	cartRowHeader: {
		backgroundColor: styles.colors.greyLight,
		justifyContent: 'center',
		padding: styles.measurements.gridSpace1,
	},
	cartRowHeaderText: {
		backgroundColor: styles.colors.greyLight,
		marginVertical: styles.measurements.gridSpace1,
	},
	cartRowSeparator: {
		height: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.greyLight,
	},
	cartFooter: {
		borderTopWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
		backgroundColor: styles.colors.white,
	},
	message: {
		position: 'absolute',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-end',
		height: 80,
		top: 0,
		right: 0,
		left: 0,
		backgroundColor: styles.colors.primary,
		paddingHorizontal: styles.measurements.gridSpace2,
	},
	messageIconButton: {
		alignItems: 'flex-start',
	},
	updatingCartAnim: {
		backgroundColor: styles.colors.primary,
		position: 'absolute',
		height: 44,
		bottom: 0,
		right: 0,
		width: styles.dimensions.width,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: styles.colors.greyLight,
		borderLeftWidth: styles.dimensions.borderWidth,
	},
	refreshControl: {
		backgroundColor: styles.colors.greyLight,
	},
	horizontalSpacer: {
		width: styles.measurements.gridSpace2,
	},
});

const ON_CART_MORE_BUTTON_PRESS = 'ON_CART_MORE_BUTTON_PRESS';

export class CartScreen extends Component {

	constructor(props) {
		super(props);
		const { sessionCartItems } = this.props.cart;
		const ds = new SwipeableListViewDataSource({
			sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
			rowHasChanged: (r1, r2) => r1 !== r2 || r2.hasChanged,
		});
		this.state = {
			isMessageVisible: false,
			message: null,
			hideQuantitySelectors: false,
			updatingCartAnimLeft: new Animated.Value(styles.dimensions.width),
			dataSource: ds.cloneWithRowsAndSections([sessionCartItems]),
		};
		this.cartRows = {};
		this.updateQuantityQueue = [];
	}

	componentWillMount() {
		const { customerId } = this.props.user;
		const { actions: { updateSessionCart }, cart } = this.props;
		if (customerId && cart.sessionCartId && !cart.zipCode) {
			getDefaultShippingAddress({ customerId })
				.then(({ address: { zip: zipCode } }) => {
					if (zipCode) {
						updateSessionCart({
							sessionCartId: cart.sessionCartId,
							cart: {
								zipCode,
							},
						}).catch(helpers.noop).done();
					}
				}).catch(helpers.noop).done();
		}
	}

	componentDidMount() {
		EventEmitter.addListener(ON_CART_MORE_BUTTON_PRESS, this.onToolsPress);
	}

	componentWillReceiveProps(nextProps) {
		const { cart, sessionCartItemDeleteQueue } = nextProps;
		const { sessionCartItems } = cart;
		if (sessionCartItemDeleteQueue.length > 0) {
			this.updateCartAnimStart();
		}
		this.setState({
			dataSource: this.state.dataSource.cloneWithRowsAndSections([sessionCartItems]),
			hideQuantitySelectors: false,
		});

		if (this.props.itemAddedToProject && !this.props.itemAddedToProject.added && nextProps.itemAddedToProject && nextProps.itemAddedToProject.added) {
			const { projectId } = nextProps.itemAddedToProject;
			const button = {
				text: projectId ? 'Go to Project' : 'Go to Projects',
				onPress: () => {
					if (projectId) {
						this.props.navigation.getNavigatorByUID(MAIN).jumpToTab(LISTS);
						requestAnimationFrame(() => this.props.navigation.performAction(({ stacks }) => {
							stacks(LISTS).push(router.getRoute('projectDetails', { projectId }));
						}));
					} else {
						this.props.navigation.performAction(({ tabs }) => tabs(MAIN).jumpToTab(LISTS));
					}
				},
			};
			const msg = projectId ? 'Cart added to project!' : 'Cart added to projects!';
			this.props.actions.showAlert(msg, 'success', button, () => {
				this.props.actions.itemAddedToProject({
					added: false,
					projectId: null,
				});
			});
		}
	}

	componentWillUnmount() {
		if (this.loadCartTimeout) {
			clearTimeout(this.loadCartTimeout);
		}
		if (this.loadQuoteTimeout) {
			clearTimeout(this.loadQuoteTimeout);
		}
		EventEmitter.removeListener(ON_CART_MORE_BUTTON_PRESS, this.onToolsPress);
	}

	setScreenTrackingInformation() {
		return (props) => {
			if (props.cart && props.cart.sessionCartItems) {
				return {
					name: 'build:app:cart',
					meta: {
						'cart.cartview': 'cartview',
						'purchase.currencycode': 'USD',
						'&&products': tracking.normalizeCartItems(props.cart.sessionCartItems, true),
					},
				};
			}
		};
	}

	getScreenData = () => {
		const { customerId } = this.props.user;
		const { actions, cart } = this.props;
		if (customerId && cart.sessionCartId && !cart.zipCode) {
			getDefaultShippingAddress({ customerId })
				.then(({ address: { zip: zipCode } }) => {
					if (zipCode) {
						actions.updateSessionCart({
							sessionCartId: cart.sessionCartId,
							cart: {
								zipCode,
							},
						})
							.catch(helpers.noop)
							.done();
					}
				})
				.catch(helpers.noop)
				.done();
		}
	};

	setReference = (reference, key) => {
		if (reference) {
			this[key] = reference;
		}
	};

	refreshSessionCart = () => {
		const { sessionCartId } = this.props.cart;
		const { getSessionCart } = this.props.actions;
		getSessionCart({ sessionCartId }).catch(helpers.noop).done();
	};

	getItem = (cartItems, key) => {
		const allCartItems = [];
		if (cartItems) {
			cartItems.forEach((item) => {
				allCartItems.push(item);

				if (item.hasSubItems) {
					item.subItems.forEach((subItem) => {
						allCartItems.push(subItem);
					});
				}
			});
		}
		return allCartItems.find((cartItem) => cartItem.itemKey === key);
	};

	getTotalQuantity = () => {
		let total = 0;
		this.props.cart.sessionCartItems.forEach((cartItem) => {
			total += cartItem.quantity;
			if (cartItem.hasSubItems) {
				cartItem.subItems.forEach((subItem) => {
					total += subItem.quantity;
				});
			}
		});
		return total;
	};

	getGrandTotal = () => {
		const { selectedShippingIndex } = this.props;
		const { subTotal, couponTotal, shippingOptions, taxAmount } = this.props.cart;
		let grandTotal = couponTotal ? subTotal - couponTotal : subTotal;
		if (Array.isArray(shippingOptions) && shippingOptions[selectedShippingIndex] && shippingOptions[selectedShippingIndex].shippingCost) {
			grandTotal += shippingOptions[selectedShippingIndex].shippingCost;
		}
		if (taxAmount) {
			grandTotal += taxAmount;
		}
		return helpers.toUSD(grandTotal);
	};

	updateCartAnimStart = (updatingMessage) => {
		this.setState({ updatingMessage }, () => {
			Animated.spring(
				this.state.updatingCartAnimLeft,
				{ toValue: 0 }
			).start();
		});
	};

	updateCartAnimEnd = () => {
		Animated.timing(
			this.state.updatingCartAnimLeft,
			{
				toValue: styles.dimensions.width,
				duration: 500,
				delay: 500,
			}
		).start(() => this.setState({ updatingMessage: null }));
	};

	onAddItemToProject = (item) => {
		if (this.props.isLoggedIn) {
			const {
				quantity,
				pricedOptions: selectedPricedOptions,
				product: {
					cost,
					finish,
					sku,
					uniqueId,
					manufacturer,
					productId,
				},
			} = item;
			this.props.actions.trackAction(trackingActions.CART_ADD_ITEM_TO_PROJECT, {
				manufacturer,
				productId,
				finish,
				sku,
				uniqueId,
				cost,
				quantity,
			});
			this.state.dataSource.setOpenRowID(null); // close the swiped row
			navigatorPush(router.getRoute('addToProjectModal', {
				itemToAdd: {
					quantity,
				},
				itemToAddConfiguration: {
					uniqueId,
					selectedPricedOptions,
				},
			}), 'root');
		} else {
			this.props.navigator.push('loginModal', {
				loginSuccess: () => {
					this.props.navigator.pop();
				},
			});
		}
	};

	onAddCartToProject = () => {
		if (this.props.isLoggedIn) {
			const {
				actions,
				cart: {sessionCartId},
			} = this.props;
			actions.trackAction(trackingActions.CART_ADD_CART_TO_PROJECT, {
				sessionCartId,
			});
			navigatorPush(router.getRoute('addToProjectModal', {sessionCartId}), 'root');
		} else {
			this.props.navigator.push('loginModal', {
				loginSuccess: () => {
					this.props.navigator.pop();
				},
			});
		}
	};

	onToolsPress = () => {
		const {
			features: { shoppingLists },
			cart: { sessionCartItems },
		} = this.props;
		let cancelIndex;
		let buttons = [];

		if (sessionCartItems.length === 0) {
			cancelIndex = 1;
			buttons = [{ text: 'Load Cart', onPress: this.onLoadCartModal }];
		} else {
			cancelIndex = 4;
			buttons = [
				{ text: 'Email Cart', onPress: this.onEmailCartModal },
				{ text: 'Save Cart', onPress: this.onSaveCartModal },
				{ text: 'Load Cart', onPress: this.onLoadCartModal },
				{ text: 'Empty Cart', onPress: this.onDeleteCart },
			];
			if (shoppingLists) {
				cancelIndex = 5;
				buttons.push({ text: 'Add To Project', onPress: this.onAddCartToProject });
			}
		}
		buttons.push({ text: 'Cancel', onPress: helpers.noop });

		if (helpers.isIOS()) {
			ActionSheetIOS.showActionSheetWithOptions({
				options: buttons.map((button) => button.text),
				cancelButtonIndex: cancelIndex,
				tintColor: styles.colors.secondary,
			}, (index) => {
				buttons[index].onPress();
			});
		} else {
			delete buttons[buttons.length - 1];
			EventEmitter.emit('showActionSheet', {
				title: 'Cart Options',
				options: buttons,
			});
		}
	};

	onEmailCartModal = () => {
		const { modal, user: { firstName, lastName, email } } = this.props;
		const name = firstName && lastName ? `${firstName} ${lastName}` : '';

		modal.show({
			fullScreen: true,
			title: 'Email Cart',
			renderContent: () => {
				return (
					<EmailCartModal
						onEmail={this.onEmailCart}
						name={name}
						email={email}
					/>
				);
			},
		});
	};

	onEmailCart = (email) => {
		const { actions: { sendQuote, showAlert }, cart: { sessionCartId }, modal } = this.props;

		modal.hide().then(() => {
			sendQuote({
				sessionCartId,
				...email,
			})
				.then(() => {
					showAlert('Cart Successfully Emailed');
				})
				.catch(helpers.noop).done();
		});
	};

	onSaveCartModal = () => {
		if (this.props.isLoggedIn) {
			this.onShowSaveCartModal();
		} else {
			this.props.navigator.push('loginModal', {
				loginSuccess: () => {
					this.onShowSaveCartModal();
					this.props.navigator.pop();
				},
			});
		}
	};

	onShowSaveCartModal = () => {
		const { isLoggedIn, modal } = this.props;

		modal.show({
			fullScreen: true,
			title: 'Save Cart',
			renderContent: () => {
				return (
					<SaveCartModal
						isLoggedIn={isLoggedIn}
						onSave={this.onSaveCartTemplate}
					/>
				);
			},
		});
	};

	onSaveCartTemplate = (cartName) => {
		const { actions: { saveCartTemplate, showAlert }, cart: { sessionCartId }, modal } = this.props;

		modal.hide().then(() => {
			saveCartTemplate({
				sourceSessionCartId: sessionCartId,
				cartName,
			}).then(() => {
				showAlert('Cart Successfully Saved');
			}).catch(helpers.noop).done();
		});
	};

	onLoadCartModal = () => {
		if (this.props.isLoggedIn) {
			this.props.actions.getCustomerCarts()
				.catch(helpers.noop)
				.done(() => this.onShowLoadCartModal());
		} else {
			this.onShowLoadCartModal();
		}
	};

	onShowLoadCartModal = () => {
		const { carts, isLoggedIn, modal } = this.props;

		modal.show({

			fullScreen: true,
			title: 'Load Cart',
			renderContent: () => {
				return (
					<LoadCartModal
						carts={carts}
						isLoggedIn={isLoggedIn}
						onLoadCart={this.onLoadCart}
						onLoadQuote={this.onLoadQuote}
						onLogin={this.onLoginLoadCartModal}
					/>
				);
			},
		});
	};

	onLoginLoadCartModal = () => {
		const { modal, navigator } = this.props;

		modal.hide().then(() => {
			navigator.push('loginModal', {
				loginSuccess: () => {
					this.onLoadCartModal();
					navigator.pop();
				},
			});
		});
	};

	onLoadCartActionSheet = (fromSessionCartId) => {
		const { actions: { deleteSessionCart, mergeSessionCarts, showAlert }, cart: { sessionCartId } } = this.props;
		EventEmitter.emit('showActionSheet', {
			title: 'Load Cart',
			options: [{
				text: 'Clear Current Cart & Continue',
				onPress: () => {
					deleteSessionCart({ sessionCartId })
						.then(() => {
							return mergeSessionCarts({
								fromSessionCartId,
								toSessionCartId: sessionCartId,
							}, true);
						})
						.catch(() => showAlert('Unable to clear cart.', 'error'))
						.done();
				},
			}, {
				text: 'Merge Carts',
				onPress: () => {
					mergeSessionCarts({
						fromSessionCartId,
						toSessionCartId: sessionCartId,
					}, false)
						.catch(() => showAlert('Unable to merge carts.', 'error'))
						.done();
				},
			}],
		});
	};

	onLoadCart = (fromSessionCartId) => {
		const { actions: { mergeSessionCarts, showAlert }, cart: { sessionCartId, sessionCartItems }, modal } = this.props;

		modal.hide().then(() => {
			if (sessionCartId && sessionCartItems.length) {
				this.loadCartTimeout = setTimeout(() => this.onLoadCartActionSheet(fromSessionCartId), 350);
			} else {
				mergeSessionCarts({
					fromSessionCartId,
					toSessionCartId: sessionCartId,
				}, true)
					.catch(() => showAlert('Unable to load cart.', 'error'))
					.done();
			}
		});
	};

	onLoadQuoteActionSheet = (quoteNumber) => {
		EventEmitter.emit('showActionSheet', {
			title: 'Load Quote',
			options: [{
				text: 'Clear Current Cart & Continue',
				onPress: () => this.onLoadQuoteAction({ quoteNumber }),
			}, {
				text: 'Merge Carts',
				onPress: () => {
					this.onLoadQuoteAction({
						quoteNumber,
						sessionCartId: this.props.cart.sessionCartId,
					});
				},
			}],
		});
	};

	onLoadQuote = (quoteNumber) => {
		const { cart: { sessionCartId, sessionCartItems }, modal } = this.props;

		modal.hide().then(() => {
			if (sessionCartId && sessionCartItems.length) {
				this.loadQuoteTimeout = setTimeout(() => this.onLoadQuoteActionSheet(quoteNumber), 350);
			} else {
				this.onLoadQuoteAction({ quoteNumber });
			}
		});
	};

	onLoadQuoteAction = (quote) => {
		const { actions: { loadQuote }, modal } = this.props;

		modal.hide().then(() => {
			loadQuote(quote)
				.catch((error) => {
					const message = error.message.toLowerCase().includes('apiresourcenotfoundexception') ? 'Quote not found.' : error.message;
					showAlert(message, 'error');
				})
				.done();
		});
	};

	onUpdateQuantity = (quantity, key) => {
		return new Promise((resolve, reject) => {
			const cartItem = this.getItem(this.props.cart.sessionCartItems, key);

			if (cartItem) {
				if (quantity === 0) {
					this.onDeleteCartItem(cartItem);
					return resolve();
				} else if (quantity > 0) {
					this.updateCartAnimStart();

					if (this.updateQuantityQueue.length > 0) {
						this.updateQuantityQueue.forEach((timeoutId) => {
							clearTimeout(timeoutId);
						});
					}

					const timeoutId = setTimeout(() => {
						this.props.actions.updateSessionCartItem({
							sessionCartId: this.props.cart.sessionCartId,
							itemKey: key,
							cartItem: { quantity },
						})
							.catch(reject)
							.done(() => {
								this.updateCartAnimEnd();
								return resolve();
							});
					}, UPDATE_DELAY);

					this.updateQuantityQueue.push(timeoutId);
				}
			} else {
				return resolve();
			}
		});
	};

	onDeleteCart = () => {
		Alert.alert(
			'Empty Cart',
			'Are you sure you want to empty your cart?',
			[
				{ text: 'No' },
				{
					text: 'Yes',
					onPress: () => {
						this.props.actions.deleteSessionCart({ sessionCartId: this.props.cart.sessionCartId })
							.catch(helpers.noop).done();
					},
				},
			]
		);
	};

	onDeleteCartItem = (cartItem) => {
		this.updateCartAnimStart();
		this.onHideQuantitySelectors();

		const deleteId = setTimeout(() => {
			this.props.actions.deleteSessionCartItem({
				sessionCartId: this.props.cart.sessionCartId,
				itemKey: cartItem.itemKey,
			}).catch(helpers.noop).done(() => this.updateCartAnimEnd());
		}, CART_TIMEOUT);

		this.props.actions.setSessionCartItemDeleteStatus(cartItem, deleteId);
	};

	onUndoDeleteCartItem = (cartItem) => {
		this.updateCartAnimEnd();

		if (!this.props.isLoading) {
			this.props.actions.clearSessionCartItemDeleteStatus(cartItem);
		}
	};

	onCheckout = () => {
		const { modal } = this.props;

		modal.show({
			title: 'Payment Method',
			leftNavButton: {
				text: 'Cancel',
				onPress: modal.hide,
			},
			showNavBar: true,
			renderContent: () => {
				return (
					<PaymentMethodModal
						onCheckout={this.openCheckout}
					/>
				);
			},
		});
	};

	openCheckout = (paymentType) => {
		const { modal, navigator } = this.props;
		const route = paymentType === PAYPAL ? 'checkoutPayPal' : 'checkoutCreditCard';

		modal.hide().then(() => navigator.push(route));
	};

	checkForErrors = () => {
		const {
			actions,
			cart,
			cart: {
				sessionCartId,
				zipCode,
			},
		} = this.props;
		if (productHelpers.cartHasGeProducts(cart)) {
			this.updateCartAnimStart('Validating Cart');
			actions.getSessionCartErrors(sessionCartId, zipCode)
				.then((errors) => {
					this.updateCartAnimEnd();
					const error = productHelpers.getGeErrorMessage(errors, zipCode);
					if (error) {
						actions.showAlert(error, 'error', null, null, 6000);
					} else {
						this.onCheckout();
					}
				});
		} else {
			this.onCheckout();
		}
	};

	onQuantityInputFocus = (ref) => {
		setTimeout(() => {
			const scrollResponder = this.cartItemsListView.getScrollResponder();

			scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
				findNodeHandle(ref),
				120,
				true
			);
		}, ANIMATION_TIMEOUT_200);
	};

	onShippingEstimateModal = () => {
		const { modal } = this.props;

		modal.show({
			fullScreen: true,
			title: 'Shipping Estimate',
			leftNavButton: {
				text: 'Cancel',
				onPress: modal.hide,
			},
			rightNavButton: {},
			renderContent: () => {
				return (
					<ShippingEstimateModal
						onClose={modal.hide}
					/>
				);
			},
		});
	};

	onHideQuantitySelectors = () => {
		this.setState({ hideQuantitySelectors: true });
	};

	renderCartRowHeader = () => {
		return (
			<View style={componentStyles.cartRowHeader}>
				<Text
					size="small"
					color="secondary"
					lineHeight={false}
					selectable={true}
					textAlign="center"
					style={componentStyles.cartRowHeaderText}
				>
					Cart ID #{SITE_ID}-{this.props.cart.sessionCartId}
				</Text>
			</View>
		);
	};

	renderSeparator = () => {
		return <View style={componentStyles.cartRowSeparator} />;
	};

	renderCartRowFooter = () => {
		const { features: { applePay }, navigator } = this.props;

		return (
			<CartRowFooter
				applePay={applePay}
				cart={this.props.cart}
				checkForErrors={this.checkForErrors}
				navigator={navigator}
				onShippingEstimateModal={this.onShippingEstimateModal}
				selectedShippingIndex={this.props.selectedShippingIndex}
				user={this.props.user}
			/>
		);
	};

	renderCartRowActions = (cartItem, sectionId, rowId) => {
		if (!cartItem.deleteStatus) {
			return (
				<CartRowActions
					rowId={rowId}
					cartItem={cartItem}
					enableShoppingLists={this.props.features.shoppingLists}
					onDeleteCartItem={this.onDeleteCartItem}
					onAddToProject={this.onAddItemToProject}
				/>
			);
		}
	};

	renderCartRow = (cartItem, sectionId, rowId) => {
		const product = this.props.products[cartItem.product.productCompositeId];
		if (product) {
			cartItem.rootCategory = product.rootCategory;
		}
		return (
			<CartRow
				ref={(ref) => this.cartRows[cartItem.itemKey] = ref}
				rowId={rowId}
				cartItem={cartItem}
				hideQuantitySelectors={this.state.hideQuantitySelectors}
				onUpdateQuantity={this.onUpdateQuantity}
				onUndoDeleteCartItem={this.onUndoDeleteCartItem}
				onHideQuantitySelectors={this.onHideQuantitySelectors}
				onQuantityInputFocus={this.onQuantityInputFocus}
				cameFromProductWithCompositeId={this.props.cameFromProductWithCompositeId}
			/>
		);
	};

	renderCartContent = () => {
		const {
			bounceFirstRowOnMount,
			cart: { sessionCartItems },
			features: { shoppingLists },
		} = this.props;
		const maxSwipeDistance = shoppingLists ? 140 : 70;

		if (this.props.isLoading) {
			return <LoadingView />;
		}

		if (sessionCartItems.length === 0) {
			return (
				<View style={componentStyles.component}>
					<EmptyCart onLoadCartModal={this.onLoadCartModal} />
				</View>
			);
		}

		if (bounceFirstRowOnMount) {
			// turn it off after it has bounced once
			this.props.actions.updateCartItemBounce(false);
		}

		return (
			<View style={componentStyles.component}>
				<SwipeableListView
					accessibilityLabel="Cart Items"
					ref={(ref) => this.cartItemsListView = ref}
					bounceFirstRowOnMount={bounceFirstRowOnMount}
					enableEmptySections={true}
					dataSource={this.state.dataSource}
					keyboardShouldPersistTaps="always"
					renderRow={this.renderCartRow}
					renderQuickActions={this.renderCartRowActions}
					renderHeader={this.renderCartRowHeader}
					renderSeparator={this.renderSeparator}
					renderFooter={this.renderCartRowFooter}
					maxSwipeDistance={maxSwipeDistance}
					refreshControl={
						<RefreshControl
							style={componentStyles.refreshControl}
							refreshing={this.props.isLoading}
							onRefresh={this.refreshSessionCart}
						/>
					}
				/>
			</View>
		);
	};

	render() {
		return (
			<View style={componentStyles.screen}>
				{this.renderCartContent()}
			</View>
		);
	}
}

CartScreen.route = {
	styles: {
		...NavigationStyles.SlideVertical,
		gestures: null,
	},
	navigationBar: {
		visible: true,
		title: 'Shopping Cart',
		renderLeft() {
			return (
				<NavigationBarIconButton
					iconName={helpers.getIcon('close')}
					onPress={() => navigatorPop('root')}
					trackAction={trackingActions.CART_NAV_TAP_CLOSE}
				/>
			);
		},
		renderRight() {
			return (
				<NavigationBarIconButton
					onPress={() => EventEmitter.emit(ON_CART_MORE_BUTTON_PRESS)}
					iconName={helpers.getIcon('more')}
					trackAction={trackingActions.CART_NAV_TAP_MORE}
				/>
			);
		},
	},
};

CartScreen.propTypes = {
	actions: PropTypes.object.isRequired,
	title: PropTypes.string,
	cart: PropTypes.object,
	cartItems: PropTypes.array,
	carts: PropTypes.array,
	couponCode: PropTypes.string,
	selectedShippingIndex: PropTypes.number,
	isLoggedIn: PropTypes.bool,
	isLoading: PropTypes.bool,
	itemAddedToProject: PropTypes.shape({
		added: PropTypes.bool,
		projectId: PropTypes.number,
	}),
	features: PropTypes.object,
	user: PropTypes.object,
	cameFromProductWithCompositeId: PropTypes.number,
	products: PropTypes.object,
	sessionCartItemDeleteQueue: PropTypes.array,
	modal: PropTypes.object,
	navigation: PropTypes.shape({
		getNavigatorByUID: PropTypes.func,
		performAction: PropTypes.func,
	}),
	navigator: PropTypes.shape({
		push: PropTypes.func,
		pop: PropTypes.func,
	}),
	bounceFirstRowOnMount: PropTypes.bool,
};

CartScreen.defaultProps = {
	couponCode: '',
	products: {},
};

const mapStateToProps = (state) => {
	return {
		...state.cartReducer,
		couponCode: helpers.getCouponCodeFromCart(state.cartReducer.cart),
		features: state.featuresReducer.features,
		isLoading: state.cartReducer.isLoading,
		isLoggedIn: state.userReducer.isLoggedIn,
		itemAddedToProject: state.projectsReducer.itemAddedToProject,
		modal: state.referenceReducer.modal,
		products: state.productsReducer,
		user: state.userReducer.user,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getCustomerCarts,
			getSessionCart,
			updateSessionCart,
			deleteSessionCart,
			updateSessionCartItem,
			deleteSessionCartItem,
			setSessionCartItemDeleteStatus,
			clearSessionCartItemDeleteStatus,
			setSessionCartItemProps,
			setSelectedShippingIndex,
			saveCartTemplate,
			sendQuote,
			loadQuote,
			mergeSessionCarts,
			updateCartItemBounce,
			trackState,
			getSessionCartErrors,
			showAlert,
			itemAddedToProject,
			trackAction,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(CartScreen));
