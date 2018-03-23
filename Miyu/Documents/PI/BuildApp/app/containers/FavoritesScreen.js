import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	InteractionManager,
	StyleSheet,
	View,
} from 'react-native';
import { connect } from 'react-redux';
import styles from '../lib/styles';
import {
	Button,
	ListView,
	withScreen,
	Text,
} from 'BuildLibrary';
import {
	getCustomerFavorites,
	deleteFavorites,
	saveNewFavorites,
} from '../actions/FavoritesActions';
import NavigationBarIconButton from '../components/navigationBar/NavigationBarIconButton';
import { bindActionCreators } from 'redux';
import helpers from '../lib/helpers';
import TrackingActions from '../lib/analytics/TrackingActions';
import { HOME } from '../constants/constants';
import SaveFavoritesListModal from '../components/SaveFavoritesListModal';
import FavoritesListRow from '../components/FavoritesListRow';

const componentStyles = StyleSheet.create({
	buttonStyle: {
		flex: 0,
		marginTop: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace9,
	},
	listView: {
		paddingTop: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.greyLight,
	},
	noFavoritesPrompt: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export class FavoritesScreen extends Component {

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.props.navigator.updateCurrentRouteParams({
				onPressNew: this.onNewFavoritesButtonPress,
			});
		});
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:more:favorites',
		};
	}

	onNewFavoritesButtonPress = () => {
		const { modal } = this.props;

		modal.show({
			fullScreen: true,
			title: 'New Favorites List',
			renderContent: () => {
				return (
					<SaveFavoritesListModal
						onSavePress={this.onCreateNewList}
						error={this.props.saveListError}
					/>
				);
			},
		});
	};

	onCreateNewList = (listName) => {
		const { actions: { getCustomerFavorites, saveNewFavorites }, modal } = this.props;

		saveNewFavorites(listName)
			.then((favoriteId) => {
				if (favoriteId) {
					getCustomerFavorites().done();
				}
			})
			.done(() => modal.hide());
	};

	getScreenData = () => {
		this.props.actions.getCustomerFavorites().catch(helpers.noop).done();
	};

	goToFavorite = (favoriteId) => {
		this.props.navigator.push('favoritesList', {
			favoriteId,
		});
	};

	onPressDelete = (favoriteId) => {
		this.props.actions.deleteFavorites(favoriteId).catch(helpers.noop).done();
	}

	renderFavorite = (favorite, sectionId, favoriteId) => {
		return (
			<FavoritesListRow
				favorite={favorite}
				favoriteId={favoriteId}
				onDelete={this.onPressDelete}
				onPress={this.goToFavorite}
			/>
		);
	};

	renderScreenContent = () => {
		const { error, favorites } = this.props;
		if (!favorites && error) {
			return (
				<Text
					color="error"
					textAlign="center"
				>
					There was an error getting your favorites.
				</Text>
			);
		}
		if (Object.keys(favorites).length) {
			const ds = new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2,
			});
			return (
				<ListView
					style={componentStyles.listView}
					dataSource={ds.cloneWithRows(favorites)}
					renderRow={this.renderFavorite}
					enableEmptySections={true}
					scrollsToTop={true}
					accessibilityLabel="Favorites Lists"
				/>
			);
		} else {
			return (
				<View style={componentStyles.noFavoritesPrompt}>
					<Text>You have not favorited any items yet</Text>
					<Button
						text="Start Favoriting"
						style={componentStyles.buttonStyle}
						onPress={() => this.props.navigation.performAction(({ tabs }) => tabs('main').jumpToTab(HOME))}
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

FavoritesScreen.route = {
	navigationBar: {
		title: 'My Favorites',
		renderRight(route) {
			return (
				<NavigationBarIconButton
					onPress={route.params.onPressNew}
					iconName={helpers.getIcon('add')}
					trackAction={TrackingActions.FAVORITES_NAV_TAP_NEW_FAVORITE_LIST}
				/>
			);
		},
	},
};

FavoritesScreen.propTypes = {
	actions: PropTypes.object,
	loading: PropTypes.bool,
	error: PropTypes.string,
	favorites: PropTypes.object,
	modal: PropTypes.object,
	refresh: PropTypes.bool,
	saveListError: PropTypes.string,
	navigator: PropTypes.shape({
		push: PropTypes.func,
		updateCurrentRouteParams: PropTypes.func,
	}),
	navigation: PropTypes.shape({
		performAction: PropTypes.func,
	}),
};

const mapStateToProps = function (state) {
	const favorites = {};
	const favoritesKeys = Object.keys(state.favoritesReducer.favorites);
	favoritesKeys.forEach((favoriteId) => {
		const stateFavorites = state.favoritesReducer.favorites;
		if (stateFavorites[favoriteId] && stateFavorites[favoriteId].isOwner) {
			favorites[favoriteId] = stateFavorites[favoriteId];
		}
	});
	return {
		error: state.favoritesReducer.error,
		loading: !favoritesKeys.length && !state.favoritesReducer.error,
		modal: state.referenceReducer.modal,
		saveListError: state.favoritesReducer.saveListError,
		refresh: state.errorReducer.refresh,
		favorites,
	};
};

const mapDispatchToProps = function (dispatch) {
	return {
		actions: bindActionCreators({
			deleteFavorites,
			getCustomerFavorites,
			saveNewFavorites,
		}, dispatch),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withScreen(FavoritesScreen));
