import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	Alert,
} from 'react-native';
import {
	applyFavoritesListSelections,
	deleteFavoriteProduct,
	saveNewFavorites,
	saveFavoriteProduct,
	updateFavorite,
	deleteFavorites,
	clearFavoritesSaveError,
	updateFavoriteProduct,
	getFavoriteComposite,
} from '../actions/FavoritesActions';
import {
	withScreen,
	ListView,
	Text,
	Button,
} from 'BuildLibrary';
import helpers, {
	slugify,
	noop,
	toInteger,
} from '../lib/helpers';
import { getProductComposite } from '../actions/ProductDetailActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NavigationBarIconButton from '../components/navigationBar/NavigationBarIconButton';
import EventEmitter from '../lib/eventEmitter';
import styles from '../lib/styles';
import ListHeader from '../components/listHeader';
import FavoritesRow from '../components/Favorites/FavoritesRow';
import FavoritesRowActions from '../components/Favorites/FavoritesRowActions';
import TrackingActions from '../lib/analytics/TrackingActions';
import Share from 'react-native-share';
import SaveFavoritesListModal from '../components/SaveFavoritesListModal';
import SwipeableListView from '../../node_modules/react-native/Libraries/Experimental/SwipeableRow/SwipeableListView';
import SwipeableListViewDataSource from '../../node_modules/react-native/Libraries/Experimental/SwipeableRow/SwipeableListViewDataSource';
import CreateFavoritesListModal from '../components/CreateFavoritesListModal';
import { showFavoritesListSelector } from '../reducers/helpers/favoritesHelpers';

const componentStyles = StyleSheet.create({
	listView: {
		backgroundColor: styles.colors.greyLight,
	},
	row: {
		backgroundColor: styles.colors.white,
	},
	space: {
		height: styles.measurements.gridSpace1,
	},
	buttonStyle: {
		flex: 0,
		marginTop: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace9,
	},
	emptyText: {
		paddingVertical: styles.measurements.gridSpace1,
	},
	noFavoritesPrompt: {
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export class FavoritesListScreen extends Component {

	constructor(props) {
		super(props);
		const swipeableListViewDataSource = new SwipeableListViewDataSource({
			sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
			rowHasChanged: (r1, r2) => r1 !== r2,
		});
		const listViewDataSource = new ListView.DataSource({
			sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
			rowHasChanged: (r1, r2) => r1 !== r2,
		});
		this.state = {
			swipeableListViewDataSource: swipeableListViewDataSource.cloneWithRowsAndSections([]),
			listViewDataSource: listViewDataSource.cloneWithRowsAndSections([]),
		};
		this.getScreenData = this.getScreenData.bind(this);
	}

	componentDidMount() {
		if (!EventEmitter.listeners('favoritesListMoreOptionsClick').length) {
			EventEmitter.addListener('favoritesListMoreOptionsClick', this.handleMoreOptions);
		}
	}

	componentWillReceiveProps({ favorite, productConfigurations }) {

		// if uniqueId for any of the configurations save the favorite again
		if (favorite && favorite.productsMap) {
			Object.keys(favorite.productsMap || {}).forEach((compositeId) => {
				const favoriteComposite = favorite.productsMap[compositeId];
				const { productConfigurationId } = favorite.productsMap[compositeId];
				const previousProductConfiguration = this.props.productConfigurations[productConfigurationId];
				const productConfiguration = productConfigurations[productConfigurationId];
				if (favoriteComposite && productConfiguration && previousProductConfiguration && previousProductConfiguration.uniqueId !== productConfiguration.uniqueId) {
					this.props.actions.updateFavoriteProduct({
						favoriteId: favorite.id,
						uniqueId: productConfiguration.uniqueId,
						favoriteProductId: favoriteComposite.favoriteProductId,
						compositeId,
					});
					this.state.swipeableListViewDataSource.setOpenRowID(null);
				}
			});
		}

		this.updateDataSource(favorite);
	}

	componentWillUnmount() {
		EventEmitter.removeListener('favoritesListMoreOptionsClick', this.handleMoreOptions);
	}

	async getScreenData() {
		const { favorite, favoriteId, actions } = this.props;
		if (favorite) {
			this.updateDataSource(favorite);
		} else if (favoriteId) {
			try {
				await actions.getFavoriteComposite(favoriteId);
			} catch (error) {
				helpers.noop();
			}
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:more:favoritesList',
		};
	}

	updateDataSource = (favorite) => {
		if (favorite) {
			const { productsMap } = favorite;
			this.setState({
				swipeableListViewDataSource: this.state.swipeableListViewDataSource.cloneWithRowsAndSections([productsMap]),
				listViewDataSource: this.state.listViewDataSource.cloneWithRowsAndSections([productsMap]),
			});
		}
	};

	handleMoreOptions = () => {
		let options = [{
			text: 'Share',
			onPress: this.share,
		}];
		const { favorite } = this.props;
		if (favorite && favorite.isOwner) {
			options = [...options, {
				text: 'Edit',
				onPress: this.edit,
			}, {
				text: 'Delete',
				onPress: this.delete,
			}];
		}
		options = [...options, {
			text: 'Cancel',
			onPress: noop,
		}];
		EventEmitter.emit('showActionSheet', {
			title: 'More Options',
			options,
		});
	};

	share = () => {
		const { favorite } = this.props;
		Share.open({
			message: `${favorite.name}. The best favorites list ever made on Build.com`,
			url: `https://www.build.com/favorites/${slugify(`${favorite.name}-${favorite.id}`)}`,
			title: 'Share Your Favorites',
		}).catch(noop).done();
	};

	delete = () => {
		Alert.alert(
			'Delete Favorite',
			'Are you sure you want to delete your list?',
			[
				{ text: 'No' },
				{
					text: 'Yes',
					onPress: () => {
						this.props.actions.deleteFavorites(this.props.favoriteId).catch(helpers.noop).done();
						this.props.navigator.pop();
					},
				},
			]
		);
	};

	edit = () => {
		const { modal } = this.props;

		modal.show({
			fullScreen: true,
			title: 'Edit Favorites List',
			renderContent: () => {
				return (
					<SaveFavoritesListModal
						onSavePress={this.onUpdate}
						error={this.props.saveListError}
						favorite={this.props.favorite}
					/>
				);
			},
		});
	};

	onUpdate = (name) => {
		const { actions: { updateFavorite }, favorite, favoriteId, modal } = this.props;
		updateFavorite({ ...favorite, favoriteId, name }).done(
			(success) => {
				if (success) {
					modal.hide();
				}
			}
		);
	};

	changeFinish = (favoriteOptions) => {
		this.props.navigator.push('productCustomizationScreen', {
			optionName: 'Finish',
			helpText: 'A Finish is the color/style of a product',
			title: 'Select a Finish',
			selectedFinish: favoriteOptions.selectedFinish,
			uniqueId: favoriteOptions.selectedFinish.uniqueId,
			productConfigurationId: favoriteOptions.productConfigurationId,
			compositeId: favoriteOptions.productCompositeId,
			favoriteId: favoriteOptions.favoriteId,
			favoriteProductId: favoriteOptions.favoriteProductId,
			continueToNextStep: false,
		});
	};

	moveOrCopy = (favoriteProduct) => {
		showFavoritesListSelector(
			this.props.favorites,
			favoriteProduct.productCompositeId,
			(selectionDetails) => this.onFavoritesDonePress(selectionDetails, favoriteProduct),
			() => this.showNewFavoritesListModal(favoriteProduct),
		);
	};

	onFavoritesDonePress = ({ initSelections, selections }, { productCompositeId, productUniqueId }) => {
		const { applyFavoritesListSelections } = this.props.actions;
		applyFavoritesListSelections(initSelections, selections, productCompositeId, productUniqueId);
	};

	showNewFavoritesListModal = (favoriteProduct) => {
		const { modal } = this.props;

		modal.show({
			fullScreen: true,
			title: 'New Favorites List',
			renderContent: () => {
				return (
					<CreateFavoritesListModal
						onCreatePress={(listName) => this.onCreateNewList(listName, favoriteProduct)}
					/>
				);
			},
		});
	};

	onCreateNewList = (listName, favoriteProduct) => {
		const { actions: { saveFavoriteProduct, saveNewFavorites }, modal } = this.props;
		const {productUniqueId, productCompositeId} = favoriteProduct;

		saveNewFavorites(listName).then((id) => {
			if (id) {
				saveFavoriteProduct(id, productUniqueId, productCompositeId).catch(helpers.noop).done();
			}
		}).done(() => modal.hide());
	};

	removeFavorite = (favoriteProduct) => {
		const { favoriteId } = this.props;
		this.props.actions.deleteFavoriteProduct({ ...favoriteProduct, favoriteId }).catch(helpers.noop).done();
	};

	goToProduct = (product, option) => {
		let { uniqueId } = product;
		const selectedFinish = this.getSelectedFinish(product);
		if (!selectedFinish || selectedFinish.status.toLowerCase() === 'discontinued') {
			// find the first in stock finish
			const inStockFinish = product.finishes.find((finish) => finish.status !== 'discontinued');
			// check if product is not discontinued
			if (inStockFinish) {
				uniqueId = inStockFinish.uniqueId;
			}
		}

		this.props.navigator.push('productDetail', {
			compositeId: product.productCompositeId,
			uniqueId,
			option,
		});
	};

	getSelectedFinish = (product) => {
		return product.finishes.find((finish) => product.uniqueId === finish.uniqueId);
	};

	renderProduct = (product, sectionId, rowId) => {
		return (
			<View style={{ backgroundColor: styles.colors.white }}>
				<FavoritesRow
					rowId={rowId}
					product={product}
					actions={this.props.actions}
					sessionCartId={this.props.cart.sessionCartId}
					onDelete={this.removeFavorite}
					onSelectRow={(option) => this.goToProduct(product, option)}
					productConfigurationId={product.productConfigurationId}
					onChangeFinish={() => {
						this.changeFinish({
							favoriteId: this.props.favoriteId,
							favoriteProductId: product.favoriteProductId,
							productCompositeId: product.productCompositeId,
							productUniqueId: product.uniqueId,
							productConfigurationId: product.productConfigurationId,
							selectedFinish: this.getSelectedFinish(product),
						});
					}}
				/>
			</View>
		);
	};

	renderRowHeader = () => {
		return (
			<ListHeader
				text={this.props.favorite.name.toUpperCase()}
				border={false}
			/>
		);
	};

	renderFavoritesRowActions = (product) => {
		return (
			<FavoritesRowActions
				favorites={this.props.favorites}
				product={product}
				favoriteId={this.props.favoriteId}
				selectedFinish={this.getSelectedFinish(product)}
				onChangeFinishTap={(productInfo) => {
					this.changeFinish({
						...productInfo,
						productConfigurationId: product.productConfigurationId,
					});
				}}
				onMoveOrCopyTap={this.moveOrCopy}
				onRemoveTap={this.removeFavorite}
			/>
		);
	};

	renderSeparator = (section, row) => {
		return (
			<View
				key={row}
				style={componentStyles.space}
			/>
		);
	};

	modalHide = () => {
		this.props.actions.clearFavoritesSaveError();
	};

	renderScreenContent = () => {
		const { favorite, favoriteId } = this.props;
		if (!favoriteId) {
			return (
				<View style={componentStyles.noFavoritesPrompt}>
					<Text style={componentStyles.emptyText}>This favorites list is not available.</Text>
					<Button
						text="Go Back"
						style={componentStyles.buttonStyle}
						onPress={() => {
							this.props.navigator.pop();
						}}
						trackAction={TrackingActions.FAVORITE_EMPTY_START_FAVORITING}
						accessibilityLabel="Go Back"
					/>
				</View>
			);
		}
		if (favorite && favorite.productsMap && Object.keys(favorite.productsMap).length) {
			if (favorite.isOwner) {
				return (
					<SwipeableListView
						bounceFirstRowOnMount={true}
						enableEmptySections={true}
						dataSource={this.state.swipeableListViewDataSource}
						renderRow={this.renderProduct}
						renderQuickActions={this.renderFavoritesRowActions}
						renderSeparator={this.renderSeparator}
						style={componentStyles.listView}
						renderHeader={this.renderRowHeader}
						maxSwipeDistance={210}
					/>
				);
			} else {
				return (
					<ListView
						enableEmptySections={true}
						dataSource={this.state.listViewDataSource}
						renderRow={this.renderProduct}
						renderSeparator={this.renderSeparator}
						style={componentStyles.listView}
						renderHeader={this.renderRowHeader}
					/>
				);
			}
		} else {
			return (
				<View style={componentStyles.noFavoritesPrompt}>
					<Text style={componentStyles.emptyText}>This list is empty</Text>
					<Button
						text="Start Favoriting"
						style={componentStyles.buttonStyle}
						onPress={() => {
							this.props.navigator.pop();
						}}
						trackAction={TrackingActions.FAVORITE_EMPTY_START_FAVORITING}
						accessibilityLabel="Start Favoriting"
					/>
				</View>
			);
		}
	};

	render() {
		return (
			<View style={styles.elements.flex1}>
				{this.renderScreenContent()}
			</View>
		);
	}
}

FavoritesListScreen.route = {
	navigationBar: {
		visible: true,
		title: 'Favorites List',
		renderRight() {
			return (
				<NavigationBarIconButton
					onPress={() => EventEmitter.emit('favoritesListMoreOptionsClick')}
					iconName={helpers.getIcon('more')}
					trackAction={TrackingActions.FAVORITES_NAV_TAP_MORE}
				/>
			);
		},
	},
};

FavoritesListScreen.propTypes = {
	actions: PropTypes.object,
	cart: PropTypes.object,
	loading: PropTypes.bool,
	error: PropTypes.string,
	favoriteId: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
	favorites: PropTypes.object,
	favorite: PropTypes.object,
	modal: PropTypes.object,
	products: PropTypes.object,
	productConfigurations: PropTypes.object,
	saveListError: PropTypes.string,
	navigator: PropTypes.shape({
		push: PropTypes.func,
		pop: PropTypes.func,
	}),
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
		performAction: PropTypes.func,
	}),
};

const mapDispatchToProps = function (dispatch) {
	return {
		actions: bindActionCreators({
			deleteFavoriteProduct,
			getProductComposite,
			applyFavoritesListSelections,
			saveNewFavorites,
			saveFavoriteProduct,
			updateFavorite,
			deleteFavorites,
			clearFavoritesSaveError,
			updateFavoriteProduct,
			getFavoriteComposite,
		}, dispatch),
	};
};

const mapStateToProps = function (state, ownProps) {
	let favorite;
	const stateFavorites = state.favoritesReducer.favorites;
	Object.keys(stateFavorites).forEach((favoriteId) => {
		if (toInteger(ownProps.favoriteId) === toInteger(favoriteId)) {
			favorite = stateFavorites[ownProps.favoriteId];
		}
	});
	return {
		cart: state.cartReducer.cart,
		loading: state.favoritesReducer.loading,
		error: state.favoritesReducer.error,
		favorites: state.favoritesReducer.favorites,
		modal: state.referenceReducer.modal,
		products: state.productsReducer,
		productConfigurations: state.productConfigurationsReducer,
		saveListError: state.favoritesReducer.saveListError,
		favorite,
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withScreen(FavoritesListScreen));
