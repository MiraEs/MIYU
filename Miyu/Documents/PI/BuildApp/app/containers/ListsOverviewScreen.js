import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	InteractionManager,
	SectionList,
	StyleSheet,
	View,
} from 'react-native';
import {
	Button,
	LinkButton,
	Text,
} from 'BuildLibrary';
import { bindActionCreators } from 'redux';
import styles from '../lib/styles';
import {
	getProjects,
	getShoppingLists,
} from '../actions/ProjectActions';
import {
	deleteFavorites,
	getCustomerFavorites,
} from '../actions/FavoritesActions';
import {
	mapProjectsDataToObject,
} from '../reducers/helpers/projectsReducerHelper';
import ProjectRow from '../components/ProjectRow';
import FavoritesListRow from '../components/FavoritesListRow';
import ListHeader from '../components/listHeader';
import { connect } from 'react-redux';
import ErrorText from '../components/ErrorText';
import { trackState } from '../actions/AnalyticsActions';
import TrackingActions from '../lib/analytics/TrackingActions';
import NavigationBarTextButton from '../components/navigationBar/NavigationBarTextButton';
import helpers from '../lib/helpers';
import Icon from 'react-native-vector-icons/Ionicons';
import { HOME } from '../constants/constants';
import { loadOrders } from '../actions/OrderActions';
import { setComponentMeasurements } from '../actions/LayoutActions';
import {
	PROJECTS_BUTTON,
	FAVORITES_BUTTON,
} from '../constants/LayoutConstants';
import eventsActions from '../actions/EventsActions';

const componentStyles = StyleSheet.create({
	emptyStateWrapper: {
		borderTopWidth: styles.dimensions.borderWidth,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
		backgroundColor: styles.colors.white,
		padding: styles.measurements.gridSpace2,
	},
	emptyProjectState: {
		backgroundColor: styles.colors.primaryLight,
	},
	emptyStateButton: {
		marginTop: styles.measurements.gridSpace1,
	},
	arrowForward: {
		marginLeft: styles.measurements.gridSpace1,
	},
	sectionRow: {
		flexDirection: 'row',
		flex: 1,
		backgroundColor: styles.colors.greyLight,
		alignItems: 'center',
	},
	sectionHeader: {
		paddingBottom: styles.measurements.gridSpace1,
		flex: 1,
	},
	linkButton: {
		minHeight: styles.dimensions.tapSizeMedium,
		minWidth: styles.dimensions.tapSizeMedium,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: styles.measurements.gridSpace2,
		marginRight: styles.measurements.gridSpace1,
	},
	buttonRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	errorContainer: {
		margin: styles.measurements.gridSpace1,
	},
});

const ACTIVE_TITLE = 'PROJECTS';
const FAVORITES_TITLE = 'FAVORITES';
const MAX_PROJECTS_TO_SHOW = 7;
const MAX_FAVORITES_TO_SHOW = 2;

export class ListsOverviewScreen extends Component {

	state = {
		isRefreshing: false,
	};

	componentDidMount() {
		this.onRefresh();
		InteractionManager.runAfterInteractions(() => {
			this.props.navigator.updateCurrentRouteParams({
				onLoginPress: this.onLoginPress,
				showLoginButton: !this.props.isLoggedIn,
			});
		});
	}

	componentWillReceiveProps({ scrollToTop, isLoggedIn, isScreenVisible }) {
		const {
			actions,
			isLoggedIn: oldIsLoggedIn,
			isScreenVisible: oldIsScreenVisible,
		} = this.props;

		if (isLoggedIn !== oldIsLoggedIn) {
			InteractionManager.runAfterInteractions(() => {
				this.props.navigator.updateCurrentRouteParams({
					showLoginButton: !this.props.isLoggedIn,
				});
			});
		}

		if (isScreenVisible && isScreenVisible !== oldIsScreenVisible) {
			actions.trackState('build:app:lists');
		}

		if (!this.props.scrollToTop && scrollToTop && this.sectionList) {
			InteractionManager.runAfterInteractions(() => {
				this.sectionList.scrollToLocation({
					sectionIndex: 0,
					itemIndex: 0,
					viewPosition: 0,
					viewOffset: 51,
				});
			});
		}
	}

	onRefresh = () => {
		const { actions, isLoggedIn, customerId } = this.props;
		if (isLoggedIn) {
			this.setState({ isRefreshing: true }, () => {
				return Promise.all([
					actions.loadOrders(customerId),
					actions.getCustomerFavorites(),
					actions.getShoppingLists(),
					actions.getProjects(),
				])
					.catch(helpers.noop)
					.done(() => {
						this.setState({ isRefreshing: false });
					});
			});
		}
	};

	getScreenData = () => {
		const { favoritesError, projectsError } = this.props;
		const { active } = mapProjectsDataToObject(this.props.projects);
		const favorites = [...this.props.favorites];
		const result = [];

		if (!favorites.length) {
			favorites.push(this.renderEmptyFavoritesState());
		}
		if (!favoritesError) {
			result.push({
				data: favorites.slice(0, MAX_FAVORITES_TO_SHOW),
				title: FAVORITES_TITLE,
			});
		}

		if (!active.length) {
			active.push(this.renderEmptyProjectsState());
		}
		if (!projectsError) {
			result.push({
				data: active.slice(0, MAX_PROJECTS_TO_SHOW),
				title: ACTIVE_TITLE,
			});
		}

		return result;
	};

	goToFavorite = (favoriteId) => {
		this.props.navigator.push('favoritesList', {
			favoriteId,
		});
	};

	goToFavoritesScreen = () => {
		this.props.navigator.push('favorites');
	};

	goToProjectDetails = (project) => {
		this.props.navigator.push('projectDetails', {
			projectId: project.id,
			projectName: project.name,
		});
	};

	goToProjectsScreen = () => {
		this.props.navigator.push('projectsV2');
	};

	hasFavorites = () => {
		const { favorites = [] } = this.props;
		return !!favorites.length;
	};

	hasProjects = () => {
		const { projects } = this.props;
		const { active = [] } = mapProjectsDataToObject(projects);
		return !!active.length;
	};

	onLoginPress = () => {
		this.props.navigation.getNavigator('root').push('loginModal', {
			initialScreen: 'LOGIN',
			loginSuccess: () => this.props.navigation.getNavigator('root').pop(),
		});
	};

	onPressDeleteFavorite = (favoriteId) => {
		this.props.actions.deleteFavorites(favoriteId).catch(helpers.noop).done();
	};

	onPressEmptyFavoritesButton = () => {
		this.props.navigation.performAction(({ tabs }) => tabs('main').jumpToTab(HOME));
	};

	onPressEmptyProjectsButton = () => {
		if (this.props.isLoggedIn) {
			this.props.navigation.getNavigator('root').push('createProjectScreen');
		} else {
			this.onLoginPress();
		}
	};

	projectKeyExtactor = (project) => {
		return project.id;
	};

	measureComponent = (componentName) => {
		if (componentName) {
			helpers.measureComponentByRef(this[componentName], (measurements) => {
				this.props.actions.setComponentMeasurements({
					componentName,
					measurements,
				});
			});
		}
	};

	renderEmptyFavoritesState = () => {
		return (
			<View style={[componentStyles.emptyStateWrapper]}>
				<Text>
					You have not favorited any items yet. Tap the heart icon
					on any product to save it to a Favorites list.
				</Text>
				<Button
					accessibilityLabel="Start Shopping"
					onPress={this.onPressEmptyFavoritesButton}
					style={componentStyles.emptyStateButton}
					text="Start Shopping"
					trackAction="test"
				/>
			</View>
		);
	};

	renderEmptyProjectsState = () => {
		return (
			<View style={[componentStyles.emptyStateWrapper, componentStyles.emptyProjectState]}>
				<Text
					family="archer"
					lineHeight={false}
					size="large"
					weight="bold"
				>
					Start Your First Project
				</Text>
				<Text>Save, organize and track products in one place. Some more text to wrap</Text>
				<Button
					accessibilityLabel="Create a Project"
					onPress={this.onPressEmptyProjectsButton}
					style={componentStyles.emptyStateButton}
					text="Create a Project"
					trackAction="test"
				/>
			</View>
		);
	};

	renderFavorite = (favorite, isLastRow) => {
		if (React.isValidElement(favorite)) {
			return favorite;
		}

		const style = {
			marginBottom: isLastRow ? 0 : styles.measurements.gridSpace1,
		};
		return (
			<FavoritesListRow
				favorite={favorite}
				favoriteId={favorite.id}
				onDelete={this.onPressDeleteFavorite}
				onPress={this.goToFavorite}
				style={style}
				analyticsData={{ trackName: TrackingActions.LIST_OVERVIEW_FAVORITE_ROW_TAP }}
			/>
		);
	};

	renderHeader = () => {
		const { favoritesError, projectsError } = this.props;
		const result = [];
		if (favoritesError) {
			result.push(
				<ErrorText
					key="favorites"
					text={`Error loading Favorites: ${favoritesError}`}
				/>
			);
		}
		if (projectsError) {
			result.push(
				<ErrorText
					key="projects"
					text={`Error loading Projects: ${projectsError}`}
				/>
			);
		}
		if (result.length) {
			return <View style={componentStyles.errorContainer}>{result.map((item) => item)}</View>;
		}

		return null;
	};

	renderProject = (project) => {
		return (
			<ProjectRow
				project={project}
				onPress={this.goToProjectDetails}
				analyticsData={{
					trackName: TrackingActions.PROJECT_ROW_TAP,
					trackData: {
						screen: 'Lists Overview',
					},
				}}
			/>
		);
	};

	renderRow = (row) => {
		const {
			index,
			item,
			section: {
				data = [],
				title,
			} = {},
		} = row;
		const isLastRow = index === data.length - 1;

		if (title === ACTIVE_TITLE) {
			return this.renderProject(item);
		} else if (title === FAVORITES_TITLE) {
			return this.renderFavorite(item, isLastRow);
		}
	};

	renderSectionHeader = ({ section: { title = '' } = {} } = {}) => {
		let additionalStyle = false;
		let componentName;
		if (title === ACTIVE_TITLE) {
			componentName = PROJECTS_BUTTON;
			additionalStyle = !this.hasProjects();
		} else if (title === FAVORITES_TITLE) {
			componentName = FAVORITES_BUTTON;
			additionalStyle = !this.hasFavorites();
		}

		const style = {};
		if (additionalStyle) {
			style.paddingBottom = 0;
		}

		return (
			<View
				style={styles.elements.flex1}
				ref={componentName ? (ref) => {
					this[componentName] = ref;
				} : null}
				onLayout={() => this.measureComponent(componentName)}
			>
				<View style={componentStyles.sectionRow}>
					<ListHeader
						border={false}
						style={[componentStyles.sectionHeader, style]}
						text={title}
					/>
					{this.renderViewAllLink(title)}
				</View>
			</View>
		);
	};

	renderViewAllLink = (title) => {
		let showLink = false;
		let onPress = helpers.noop;
		let trackName;
		if (title === ACTIVE_TITLE) {
			showLink = this.hasProjects();
			onPress = this.goToProjectsScreen;
			trackName = TrackingActions.LIST_OVERVIEW_PROJECTS_VIEW_ALL_TAP;
		} else if (title === FAVORITES_TITLE) {
			showLink = this.hasFavorites();
			onPress = this.goToFavoritesScreen;
			trackName = TrackingActions.LIST_OVERVIEW_FAVORITES_VIEW_ALL_TAP;
		}

		if (showLink) {
			return (
				<LinkButton
					accessibilityLabel="View All"
					onPress={onPress}
					style={componentStyles.linkButton}
					wrapChildren={false}
					analyticsData={{ trackName }}
				>
					<View style={componentStyles.buttonRow}>
						<Text color="primary">
							View All
						</Text>
						<Icon
							color={styles.colors.primary}
							name={helpers.getIcon('arrow-forward')}
							size={25}
							style={componentStyles.arrowForward}
						/>
					</View>
				</LinkButton>
			);
		}
	};

	render() {
		return (
			<SectionList
				ref={ref => {
					if (ref) {
						this.sectionList = ref;
					}
				}}
				keyExtractor={this.projectKeyExtactor}
				ListHeaderComponent={this.renderHeader}
				onRefresh={this.onRefresh}
				refreshing={this.state.isRefreshing}
				renderItem={this.renderRow}
				renderSectionHeader={this.renderSectionHeader}
				scrollsToTop={true}
				sections={this.getScreenData()}
				style={styles.elements.screenGreyLight}
			/>
		);
	}
}

ListsOverviewScreen.displayName = 'Lists Overview Screen';

ListsOverviewScreen.route = {
	navigationBar: {
		visible: true,
		title: 'Lists',
		renderLeft: null,
		renderRight: (route) => {
			if (route.params.showLoginButton) {
				return (
					<NavigationBarTextButton onPress={route.params.onLoginPress}>
						Login
					</NavigationBarTextButton>
				);
			}
		},
	},
};

ListsOverviewScreen.propTypes = {
	actions: PropTypes.object.isRequired,
	customerId: PropTypes.number,
	favorites: PropTypes.array,
	favoritesError: PropTypes.string,
	isLoggedIn: PropTypes.bool,
	isScreenVisible: PropTypes.bool,
	navigator: PropTypes.shape({
		push: PropTypes.func,
		updateCurrentRouteParams: PropTypes.func,
	}),
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
		performAction: PropTypes.func,
	}),
	projects: PropTypes.object.isRequired,
	projectsError: PropTypes.string,
	scrollToTop: PropTypes.bool,
};

ListsOverviewScreen.defaultProps = {
	favorites: {},
	isLoggedIn: false,
	scrollToTop: false,
};

const mapStateToProps = (state) => {
	const favorites = [];
	const stateFavorites = state.favoritesReducer.favorites;
	Object.keys(stateFavorites).forEach((favoriteId) => {
		if (stateFavorites[favoriteId] && stateFavorites[favoriteId].isOwner) {
			favorites.push(stateFavorites[favoriteId]);
		}
	});
	return {
		favoritesError: state.favoritesReducer.error,
		isLoggedIn: state.userReducer.isLoggedIn,
		customerId: state.userReducer.user.customerId,
		isScreenVisible: 'lists' === state.navigation.currentNavigatorUID,
		projects: state.projectsReducer.projects,
		projectsError: state.projectsReducer.error,
		scrollToTop: state.eventsReducer.scrollListOverviewToTop,
		favorites,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			deleteFavorites,
			getProjects,
			getShoppingLists,
			getCustomerFavorites,
			loadOrders,
			trackState,
			setComponentMeasurements,
			triggerEvent: eventsActions.triggerEvent,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ListsOverviewScreen);
