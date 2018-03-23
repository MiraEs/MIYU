import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import {
	applyFavoritesListSelections,
	saveFavoriteProduct,
	saveNewFavorites,
	clearFavoritesSaveError,
	setShowModalPending,
} from '../actions/FavoritesActions';
import { getProductRootCategory } from '../actions/ProductDetailActions';
import {
	isProductFavorite,
	productInFavorites,
} from '../reducers/helpers/favoritesHelpers';
import { Image } from 'BuildLibrary';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../lib/styles';
import EventEmitter from '../lib/eventEmitter';
import SaveFavoritesListModal from './SaveFavoritesListModal';
import { HIT_SLOP } from '../constants/constants';
import tracking from '../lib/analytics/tracking';
import TrackingActions from '../lib/analytics/TrackingActions';
import helpers from '../lib/helpers';
import { withNavigation } from '@expo/ex-navigation';

const componentStyles = StyleSheet.create({
	favoriteButtonImage: {
		width: 27,
		height: 27,
	},
	style: {
		alignSelf: 'flex-end',
		backgroundColor: 'rgba(0,0,0,0)',
	},
});

@withNavigation
export class FavoriteButton extends Component {

	constructor(props) {
		super(props);
		this.state = {
			pressed: props.pressed,
			isMounted: false,
		};
	}

	componentDidMount() {
		this.setPressed();
		this.setState({ isMounted: true });
	}

	componentWillReceiveProps({ compositeId, favorites, isLoggedIn, showModalPending }) {
		this.setPressed(favorites);

		if (this.state.isMounted && showModalPending === compositeId && isLoggedIn && Object.keys(favorites).length) {
			this.showFavoriteListSelector(favorites, true);
		}
	}

	setPressed = (newFavs) => {
		const { compositeId } = this.props,
			favorites = newFavs || this.props.favorites;
		if (Object.keys(favorites).length) {
			const pressed = isProductFavorite(compositeId, favorites);
			this.setState({
				pressed,
			});
		}
	};

	getIcon = () => {
		if (this.state.pressed && this.props.isLoggedIn) {
			if (this.props.navBarButton) {
				return (
					<Icon
						size={27}
						color={styles.colors.accent}
						name="md-heart"
					/>
				);
			}
			return (
				<Image
					style={componentStyles.favoriteButtonImage}
					resizeMode="contain"
					source={require('../../images/fav-icon-on.png')}
				/>
			);
		} else {
			if (this.props.navBarButton) {
				return (
					<Icon
						size={27}
						color={styles.colors.white}
						name="md-heart"
					/>
				);
			}
			return (
				<Image
					style={componentStyles.favoriteButtonImage}
					resizeMode="contain"
					source={require('../../images/fav-icon-off.png')}
				/>
			);
		}
	};

	showNewListModal = () => {
		const { modal } = this.props;

		modal.show({
			fullScreen: true,
			title: 'New Favorites List',
			renderContent: () => {
				return (
					<SaveFavoritesListModal
						onSavePress={(listName) => this.onCreateNewFavoritesList(listName)}
						error={this.props.saveListError}
					/>
				);
			},
		});
	};

	showFavoriteListSelector = (favorites, pendingLayout = false) => {
		const { compositeId } = this.props;
		const favoriteIds = Object.keys(favorites);
		const options = favoriteIds.map((key) => {
			return {
				text: favorites[key].name,
			};
		});
		const favoritesContainingProduct = productInFavorites(compositeId, favorites);
		const selections = favoritesContainingProduct.map((favoriteId) => favoriteIds.indexOf(favoriteId) + 1);
		EventEmitter.emit('showActionSheet', {
			optionsTextStyle: { textAlign: 'left' },
			title: 'Select Favorites',
			multiSelect: true,
			onDonePress: this.onDonePress,
			createNewOption: {
				text: 'Create new favorites...',
				onPress: this.showNewListModal,
			},
			options,
			selections,
			pendingLayout,
		});
		this.props.actions.setShowModalPending(0);
	};

	onDonePress = ({ initSelections, selections }) => {
		this.trackAddFavorite();
		const { compositeId, productUniqueId, finishes } = this.props,
			{ applyFavoritesListSelections } = this.props.actions;
		applyFavoritesListSelections(initSelections, selections, compositeId, productUniqueId, finishes);
	};

	onCreateNewFavoritesList = (listName) => {
		const { compositeId, modal, productUniqueId } = this.props,
			{ saveFavoriteProduct, saveNewFavorites } = this.props.actions;
		saveNewFavorites(listName).then((id) => {
			if (id) {
				modal.hide().then(() => {
					saveFavoriteProduct(id, productUniqueId, compositeId).catch(helpers.noop).done();
				});
			}
		}).done();
	};

	handlePress = () => {
		this.props.actions.setShowModalPending(this.props.compositeId);

		if (this.props.isLoggedIn) {
			this.showFavoriteListSelector(this.props.favorites);
		} else {
			this.props.navigation.getNavigator('root').push('loginModal', {
				loginSuccess: () => {
					this.props.navigation.getNavigator('root').pop();
				},
			});
		}
	};

	onModalHide = () => {
		this.props.actions.clearFavoritesSaveError();
	};

	trackAddFavorite = () => {
		const { compositeId, product, productUniqueId, productRootCategory } = this.props;
		let attributes = {
			compositeId,
			uniqueId: productUniqueId,
		};
		if (product) {
			const {
				manufacturer,
				productId,
				rootCategory,
				selectedFinish,
			} = product;

			attributes = {
				manufacturer,
				productId,
				...attributes,
			};

			if (selectedFinish) {
				attributes = {
					...attributes,
					sku: selectedFinish.sku,
					finish: selectedFinish.finish,
				};
			}

			let hasRootCategory = false;
			if (rootCategory) {
				hasRootCategory = true;
				attributes = {
					...attributes,
					...rootCategory,
				};
			} else if (productRootCategory) {
				hasRootCategory = true;
				attributes = {
					...attributes,
					...productRootCategory,
				};
			}

			if (hasRootCategory) {
				tracking.trackAction(TrackingActions.FAVORITE_ADD, attributes);
			} else {
				this.props.actions.getProductRootCategory(compositeId)
					.then((payload) => {
						attributes = {
							...attributes,
							...payload,
						};
						tracking.trackAction(TrackingActions.FAVORITE_ADD, attributes);
					})
					.catch(() => {
						tracking.trackAction(TrackingActions.FAVORITE_ADD, attributes);
					}).done();
			}
		} else {
			tracking.trackAction(TrackingActions.FAVORITE_ADD, attributes);
		}
	};

	render() {
		return (
			<TouchableOpacity
				style={[componentStyles.style, this.props.style]}
				onPress={this.handlePress}
				hitSlop={HIT_SLOP}
			>
				{this.getIcon()}
			</TouchableOpacity>
		);
	}

}

FavoriteButton.defaultProps = {
	pressed: false,
};

FavoriteButton.propTypes = {
	actions: PropTypes.object.isRequired,
	finishes: PropTypes.array.isRequired,
	features: PropTypes.object.isRequired,
	style: PropTypes.number,
	onPress: PropTypes.func,
	pressed: PropTypes.bool,
	favorites: PropTypes.object,
	compositeId: PropTypes.number,
	isLoggedIn: PropTypes.bool.isRequired,
	modal: PropTypes.object,
	navBarButton: PropTypes.bool,
	saveListError: PropTypes.string,
	productUniqueId: PropTypes.number,
	product: PropTypes.object.isRequired,
	productRootCategory: PropTypes.object,
	navigator: PropTypes.shape({
		push: PropTypes.func,
		pop: PropTypes.func,
	}),
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
};

const mapStateToProps = (state, ownProps) => {
	return {
		features: state.featuresReducer.features,
		favorites: state.favoritesReducer.favorites,
		isLoggedIn: state.userReducer.isLoggedIn,
		modal: state.referenceReducer.modal,
		saveListError: state.favoritesReducer.saveListError,
		productRootCategory: state.productDetailReducer.rootCategories[ownProps.compositeId],
		showModalPending: state.favoritesReducer.showModalPending,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			applyFavoritesListSelections,
			saveFavoriteProduct,
			saveNewFavorites,
			clearFavoritesSaveError,
			getProductRootCategory,
			setShowModalPending,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteButton);
