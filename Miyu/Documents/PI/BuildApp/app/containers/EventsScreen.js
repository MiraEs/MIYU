'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	ActivityIndicator,
	TouchableHighlight,
	TouchableOpacity,
	Image,
	StyleSheet,
	RefreshControl,
} from 'react-native';
import {
	ADD_PENDING,
	EXPERT,
	TEMPLATE_ORDER,
	HOME,
} from '../constants/constants';
import { loadOrders } from '../actions/OrderActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProject } from '../reducers/helpers/projectsReducerHelper';
import {
	updateIsRefreshing,
	updateShowProjectEvents,
	updateIsFetchingProjectData,
	getEvents,
	saveProjectFavorite,
	getPhotos,
	saveComment,
	createEvent,
	addOrderToProject,
} from '../actions/ProjectEventActions';
import { getCustomerFavorites } from '../actions/FavoritesActions';
import Avatar from '../components/Avatar';
import Button from '../components/button';
import {
	Text,
	ScrollView,
	ListView,
} from 'BuildLibrary';
import Event from '../components/Event';
import EventsFilters from '../components/eventsFilters';
import FetchErrorMessage from '../components/fetchErrorMessage';
import Icon from 'react-native-vector-icons/Ionicons';
import LoadingView from '../components/LoadingView';
import styles from '../lib/styles';
import {
	trackState,
	trackAction,
} from '../actions/AnalyticsActions';
import EventEmitter from '../lib/eventEmitter';
import helpers from '../lib/helpers';
import TrackingActions from '../lib/analytics/TrackingActions';
import NavigationBarIconButton from '../components/navigationBar/NavigationBarIconButton';

const componentStyles = StyleSheet.create({
	projectHeaderContainer: {
		marginBottom: styles.measurements.gridSpace1,
		borderBottomColor: styles.colors.grey,
		borderBottomWidth: styles.dimensions.borderWidth,
		shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
	},
	shareUpdate: {
		flex: 1,
		flexDirection: 'row',
		paddingHorizontal: styles.measurements.gridSpace1,
		alignItems: 'center',
		backgroundColor: styles.colors.white,
		marginTop: styles.measurements.gridSpace1,
	},
	postInput: {
		marginVertical: styles.measurements.gridSpace3,
	},
	expertButtonWrapper: {
		paddingVertical: styles.measurements.gridSpace1,
		marginLeft: styles.measurements.gridSpace1,
	},
	filters: {
		borderBottomColor: styles.colors.grey,
		borderBottomWidth: styles.dimensions.borderWidth,
	},
	camera: {
		marginLeft: styles.measurements.gridSpace1,
	},
	quickAdd: {
		margin: styles.measurements.gridSpace1,
		padding: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
	},
	quickAddButton: {
		paddingTop: styles.measurements.gridSpace1,
		flex: 2,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	globalHeaderContainer: {
		marginTop: styles.measurements.gridSpace1,
	},
	photoFilterEmpty: {
		paddingBottom: styles.measurements.gridSpace2,
		paddingHorizontal: styles.measurements.gridSpace2,
	},
	photoFilterRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	nextPageIndicator: {
		marginVertical: styles.measurements.gridSpace3,
	},
	filterPadding: {
		paddingBottom: styles.measurements.gridSpace2,
	},
});

const FILTER_ALL = 'ALL';
const FILTER_PHOTOS = 'PHOTOS';
const FILTER_ORDER = 'ORDER';
const FILTER_FAVORITE_LIST = 'FAVORITE_LIST';

export class EventsScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			showOnboardingScreen: false,
		};
	}

	getChildContext() {
		return {
			actions: this.props.actions,
		};
	}

	componentWillMount() {
		EventEmitter.addListener('onProjectSettingsButtonPress', this.goToProjectSettingsScreen);
		EventEmitter.addListener('onAddTeamMemberButtonPress', this.onAddTeamMemberButtonPress);
		EventEmitter.addListener('onProjectNameUpdate', this.onProjectNameUpdate);

		this.props.actions.getCustomerFavorites();

		setTimeout(() => {
			this.fetchDataForFilter({
				eventType: FILTER_ALL,
			});
		}, 400);
	}

	componentDidMount() {
		this.props.actions.trackState('build:app:events');
	}

	componentWillUnmount() {
		const { actions } = this.props;
		EventEmitter.removeAllListeners('onProjectSettingsButtonPress');
		EventEmitter.removeAllListeners('onAddTeamMemberButtonPress');
		EventEmitter.removeAllListeners('onProjectNameUpdate');
		actions.updateShowProjectEvents(false);
	}

	/**
	 * This method is used for the tour to scroll the user around
	 * Please don't mess with it unless you are changing the tour content
	 */
	scrollTo = () => {
		this.mainScrollView.scrollTo(20);
	};

	fetchDataForFilter = (options = {}) => {
		const { customerId, projectId, actions, activeFilter } = this.props;

		// Only if they are switching filters should we set the
		// isFetchingData flag
		if (activeFilter && options.eventType !== activeFilter) {
			actions.updateIsFetchingProjectData(true);
		}
		options.customerId = customerId;
		if (projectId) {
			options.projectId = projectId;
		}

		switch (options.eventType) {
			case FILTER_PHOTOS:
				actions.getPhotos(options);
				this.props.actions.trackAction('Photos_filter_tap');
				break;
			case FILTER_ALL:
				delete options.eventType;
				this.props.actions.trackAction('All_filter_tap');
				actions.getEvents(options);
				break;
			case FILTER_ORDER:
				this.props.actions.trackAction('Orders_filter_tap');
				actions.loadOrders(options.customerId);
				actions.getEvents(options);
				break;
			case FILTER_FAVORITE_LIST:
				this.props.actions.trackAction('Favorites_filter_tap');
				actions.getEvents(options);
				break;
			default:
				actions.getEvents(options);
				break;
		}
	};

	getEventStoreType = () => {
		return 'project';
	};

	onProjectNameUpdate = (title) => {
		this.props.navigator.updateCurrentRouteParams({
			title,
		});
	};

	onAddTeamMemberButtonPress = () => {
		this.props.navigator.push('managePeople', {
			projectId: this.props.projectId,
			projectName: this.props.project.name,
			owner: this.props.project.isOwnedByUser,
			userEmail: this.props.user.email,
		});
	};

	navigateToProjectUpdate = (event, shouldMentionExpert) => {
		this.props.navigation.getNavigator('root').push('projectUpdate', {
			projectId: this.props.projectId,
			project: this.props.project,
			eventStoreType: this.getEventStoreType(),
			shouldMentionExpert: shouldMentionExpert ? true : false,
		});
	};

	goToProjectSettingsScreen = () => {
		this.props.navigator.push('projectSettings', {
			project: this.props.project,
		});
	};

	togglePhotoModal = () => {
		this.props.navigation.getNavigator('root').push('addPhoto', {
			returnTo: 'feed',
			launchedFrom: 'feed',
			eventStoreType: this.getEventStoreType(),
			project: this.props.project,
		});
	};

	getDataSource = () => {
		const ds = new ListView.DataSource({
			rowHasChanged: () => true,
		});
		const { isFiltering, showEvents, photos, events } = this.props;

		if (isFiltering) {
			return ds.cloneWithRows([]);
		} else if (showEvents) {
			return ds.cloneWithRows(events);
		} else {
			return ds.cloneWithRows(photos);
		}
	};

	selectFavorite = (favorite) => {
		const data = {
			favoriteId: favorite.id,
			customerId: this.props.customerId,
			projectId: this.props.projectId,
		};

		this.props.actions.saveProjectFavorite(data);
	};

	openFavoritesSelector = () => {
		const { favorites, events } = this.props,
			favoriteIds = events.map((event) => {
				return event.favoriteId;
			}),
			favoritesArray = [];

		Object.keys(favorites).forEach((favoriteId) => {
			if (favoriteIds.indexOf(parseInt(favoriteId, 10)) > -1) {
				favorites[favoriteId].selected = true;
			}
			if (favorites[favoriteId] && favorites[favoriteId].isOwner) {
				favoritesArray.push(favorites[favoriteId]);
			}
		});

		this.props.navigation.getNavigator('root').push('listSelector', {
			title: 'Add Favorites List',
			list: favoritesArray,
			listItemText: 'name',
			showCancelButton: false,
			onSelectItem: this.selectFavorite,
			tracking: {
				name: 'build:app:favoriteslist',
			},
		});
	};

	selectOrders = (order) => {
		const data = {
			order,
			projectId: this.props.projectId,
			customerId: this.props.user.customerId,
		};

		this.props.actions.addOrderToProject(data);
	};

	openOrderSelector = () => {
		const { projectName, events, orders } = this.props;

		orders.forEach((order) => {
			order.total = order.total.toString();
			order.orderDate = helpers.getDateStrictFormat(order.orderDate).toString();
			order.selected = !!(order.projectName === projectName || events.find((event) => event.orderNumber === order.orderNumber));
		});
		this.props.navigation.getNavigator('root').push('listSelector', {
			title: 'Add Order',
			list: orders,
			listItemText: 'orderNumber',
			template: TEMPLATE_ORDER,
			showCancelButton: false,
			onSelectItem: this.selectOrders,
			tracking: {
				name: 'build:app:events:orderslist',
			},
		});
	};

	renderFilters = () => {
		const filters = [{
			text: 'Feed',
			type: FILTER_ALL,
		}, {
			text: 'Orders',
			type: FILTER_ORDER,
		}, {
			text: 'Favorites',
			type: FILTER_FAVORITE_LIST,
		}, {
			text: 'Photos',
			type: FILTER_PHOTOS,
		}];

		return (
			<EventsFilters
				filters={filters}
				onFilterPress={(eventType) => {
					this.fetchDataForFilter({
						eventType,
					});
				}}
			/>
		);
	};

	renderQuickAdd = () => {
		const { activeFilter, favorites, user, orders, project } = this.props,
			{ firstName, lastName, apiUser } = user;

		if (project && project.archived) {
			return null;
		}

		switch (activeFilter) {
			case FILTER_ORDER:
				if (!orders || !orders.length) {
					break;
				} else {
					return (<View style={componentStyles.quickAdd}>
						<View>
							<Text>Keep orders organized by adding them to a project</Text>
						</View>
						<View style={componentStyles.quickAddButton}>
							<Button
								text="Add Orders To Project"
								onPress={this.openOrderSelector}
								accessibilityLabel="Add Orders Button"
								trackAction={TrackingActions.EVENTS_ADD_ORDERS_TO_PROJECT}
							/>
						</View>
					</View>);
				}
			case FILTER_FAVORITE_LIST:
				if (Object.keys(favorites).length === 0) {
					break;
				} else {
					return (
						<View style={componentStyles.quickAdd}>
							<View>
								<Text>Show 'em your style! Add a favorites list to your project.</Text>
							</View>
							<View style={componentStyles.quickAddButton}>
								<Button
									text="Add Favorites List To Project"
									onPress={this.openFavoritesSelector}
									accessibilityLabel="Add Favorites List Button"
									trackAction={TrackingActions.EVENTS_ADD_FAVORITES_TO_PROJECT}
								/>
							</View>
						</View>
					);
				}
			default:
				return (<View style={componentStyles.shareUpdate}>
					<View>
						<Avatar
							fullName={`${firstName} ${lastName}`}
							firstName={firstName}
							lastName={lastName}
							url={apiUser.avatar}
						/>
					</View>
					<TouchableHighlight
						onPress={this.navigateToProjectUpdate}
						style={styles.feedEvents.headingText}
						underlayColor="#fff"
					>
						<Text
							style={componentStyles.postInput}
						>
							Post something...
						</Text>
					</TouchableHighlight>
					<TouchableOpacity
						onPress={(event) => this.navigateToProjectUpdate(event, true)}
						style={componentStyles.expertButtonWrapper}
					>
						<Text>{EXPERT}</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={this.togglePhotoModal}
					>
						<Icon
							name="ios-camera"
							size={25}
							color={styles.colors.secondary}
							style={componentStyles.camera}
						/>
					</TouchableOpacity>
				</View>);
		}
	};

	renderHeader = () => {
		return (
			<View style={componentStyles.projectHeaderContainer}>
				<View style={componentStyles.filters}>
					{this.renderFilters()}
				</View>
				<View>
					{this.renderQuickAdd()}
				</View>
			</View>
		);
	};

	renderEventItem = (event) => {
		return (
			<Event
				event={event}
				eventStoreType={this.getEventStoreType()}
			/>
		);
	};

	navigateToSingleEventScreen = (image) => {
		this.props.navigator.push('singleEvent', {
			eventId: image.eventId,
		});
	};

	onScroll = (event) => {
		const { isFetchingNextPage, pageNumber, hasNextPage } = this.props;

		if (event.nativeEvent.contentOffset.y > (event.nativeEvent.contentSize.height - 1500) && !isFetchingNextPage && hasNextPage) {
			const { projectId, customerId, actions } = this.props;

			actions.getEvents({
				customerId,
				filters: {
					page: pageNumber + 1,
					projectId,
				},
			});
		}
	};

	onRefresh = () => {
		const { actions, activeFilter } = this.props;
		actions.updateIsRefreshing(true);
		const options = activeFilter ? { eventType: activeFilter } : {};
		this.fetchDataForFilter(options);
	};

	getImageStyles = (status) => {
		if (status && status === ADD_PENDING) {
			return {
				marginLeft: styles.measurements.gridSpace1,
				marginBottom: styles.measurements.gridSpace1,
				opacity: 0.5,
			};
		}
		return {
			marginLeft: styles.measurements.gridSpace1,
			marginBottom: styles.measurements.gridSpace1,
		};
	};

	renderImageRow = (image) => {
		return (
			<TouchableHighlight
				onPress={() => this.navigateToSingleEventScreen(image)}
				underlayColor="rgba(0, 0, 0, .1)"
				style={this.getImageStyles(image.status)}
			>
				<Image
					resizeMode="contain"
					width={styles.dimensions.imageDimensions}
					height={styles.dimensions.imageDimensions}
					source={{ uri: image.imageUrl }}
					style={styles.photoGrid.thumbnails}
				/>
			</TouchableHighlight>
		);
	};

	startShopping = () => {
		this.props.navigation.performAction(({ tabs }) => tabs('main').jumpToTab(HOME));
	};

	renderListView = () => {
		const { orders, favorites } = this.props,
			dataSource = this.getDataSource();
		if (this.props.isFiltering) {
			return (<LoadingView backgroundColor={styles.colors.greyLight} />);
		}
		switch (this.props.activeFilter) {
			case FILTER_PHOTOS:
				if (this.props.photos.length === 0) {
					return (
						<View style={styles.elements.centering}>
							<Icon
								name={helpers.getIcon('images')}
								size={108}
								color={styles.colors.mediumGray}
							/>
							<Text
								textAlign="center"
								style={componentStyles.filterPadding}
							>
								Add your inspirational project photos or show your team how your project is progressing
							</Text>
							<Button
								onPress={this.togglePhotoModal}
								isLoading={this.state.isRefreshing}
								text="Add Photos"
								accessibilityLabel="Add Photos Button"
								trackAction={TrackingActions.EVENTS_ADD_PHOTOS}
							/>
						</View>
					);
				} else {
					return (
						<ListView
							automaticallyAdjustContentInsets={false}
							contentContainerStyle={componentStyles.photoFilterRow}
							scrollsToTop={false}
							dataSource={dataSource}
							renderRow={this.renderImageRow}
						/>
					);
				}
			case FILTER_ORDER:
				if (!orders || !orders.length) {
					return (
						<View style={styles.elements.centering}>
							<Icon
								name={helpers.getIcon('cube')}
								size={108}
								color={styles.colors.mediumGray}
							/>
							<Text
								textAlign="center"
								style={componentStyles.filterPadding}
							>
								Looks like you haven't ordered anything from us yet. Let's change that!
							</Text>
							<Button
								isLoading={this.state.isRefreshing}
								onPress={this.startShopping}
								text="Start Shopping Build.com"
								accessibilityLabel="Start Shopping Button"
								trackAction={TrackingActions.EVENTS_START_SHOPPING}
							/>
						</View>
					);
				} else {
					return (
						<ListView
							automaticallyAdjustContentInsets={false}
							dataSource={dataSource}
							scrollsToTop={false}
							renderRow={this.renderEventItem}
						/>
					);
				}
			case FILTER_FAVORITE_LIST:
				if (Object.keys(favorites).length === 0) {
					return (
						<View style={styles.elements.centering}>
							<Icon
								name="md-heart"
								size={120}
								color={styles.colors.mediumGray}
							/>
							<Text
								textAlign="center"
								style={componentStyles.filterPadding}
							>
								Looks like you haven't created any favorites lists yet. Let's change that!
							</Text>
							<Button
								onPress={() => this.props.navigator.push('favorites')}
								isLoading={this.state.isRefreshing}
								text="Create a Build.com Favorites List"
								accessibilityLabel="Create List Button"
								trackAction={TrackingActions.EVENTS_CREATE_FAVORITES_LIST}
							/>
						</View>
					);
				} else {
					return (
						<ListView
							automaticallyAdjustContentInsets={false}
							dataSource={dataSource}
							scrollsToTop={false}
							renderRow={this.renderEventItem}
						/>
					);
				}
			default:
				return (
					<ListView
						enableEmptySections={true}
						automaticallyAdjustContentInsets={false}
						dataSource={dataSource}
						scrollsToTop={false}
						renderRow={this.renderEventItem}
					/>
				);
		}
	};

	renderNextPageLoadingNotifier = () => {
		if (this.props.hasNextPage) {
			return (
				<View>
					<ActivityIndicator
						size="large"
						style={componentStyles.nextPageIndicator}
					/>
				</View>
			);
		}
	};

	renderScreenContent = () => {
		return (
			<View>
				{this.renderHeader()}
				{this.renderListView()}
			</View>
		);
	};

	render() {
		const { error, isRefreshing } = this.props;
		return (
			<View style={styles.elements.screenWithHeader}>
				<FetchErrorMessage text={error} />
				<ScrollView
					automaticallyAdjustContentInsets={false}
					ref={(node) => this.mainScrollView = node} /* This is needed as a hook for the tour */
					refreshControl={
						<RefreshControl
							onRefresh={this.onRefresh}
							refreshing={isRefreshing}
						/>
					}
					onScroll={this.onScroll}
					scrollsToTop={true}
					scrollEventThrottle={3}
					style={styles.feedEvents.background}
				>
					{this.renderScreenContent()}
					{this.renderNextPageLoadingNotifier()}
				</ScrollView>
			</View>
		);
	}
}

EventsScreen.propTypes = {
	actions: PropTypes.object,
	projectId: PropTypes.number,
	project: PropTypes.object,
	dispatch: PropTypes.func.isRequired,
	customerId: PropTypes.number.isRequired,
	activeFilter: PropTypes.string,
	isFiltering: PropTypes.bool.isRequired,
	showEvents: PropTypes.bool.isRequired,
	events: PropTypes.array.isRequired,
	photos: PropTypes.array,
	favorites: PropTypes.object,
	user: PropTypes.object,
	projectName: PropTypes.string,
	isFetchingNextPage: PropTypes.bool,
	pageNumber: PropTypes.number,
	hasNextPage: PropTypes.bool,
	error: PropTypes.string,
	isRefreshing: PropTypes.bool,
	orders: PropTypes.array,
	navigator: PropTypes.shape({
		push: PropTypes.func,
		updateCurrentRouteParams: PropTypes.func,
	}),
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
		performAction: PropTypes.func,
	}),
};

EventsScreen.childContextTypes = {
	actions: PropTypes.object,
};

EventsScreen.route = {
	navigationBar: {
		title({ title }) {
			return title || 'Feed';
		},
		renderRight: (route) => {
			const { isOwner } = route.params;
			if (isOwner) {
				return (
					<View style={styles.elements.flexRow}>
						<NavigationBarIconButton
							iconName={helpers.getIcon('person-add')}
							onPress={() => EventEmitter.emit('onAddTeamMemberButtonPress')}
							trackAction={TrackingActions.EVENTS_NAV_TAP_ICON_PERSON_ADD}
						/>
						<NavigationBarIconButton
							iconName={helpers.getIcon('settings')}
							onPress={() => EventEmitter.emit('onProjectSettingsButtonPress')}
							trackAction={TrackingActions.EVENTS_NAV_TAP_ICON_PROJECT_SETTINGS}
						/>
					</View>
				);
			} else if (typeof isOwner !== 'undefined') {
				return (
					<NavigationBarIconButton
						iconName={helpers.getIcon('person-add')}
						onPress={() => EventEmitter.emit('onAddTeamMemberButtonPress')}
						trackAction={TrackingActions.EVENTS_NAV_TAP_ICON_PERSON_ADD}
					/>
				);
			}
		},
	},
};

export default connect((state, ownProps) => {
	return {
		...state.projectEventsReducer,
		customerId: state.userReducer.user.customerId,
		user: state.userReducer.user,
		orders: state.ordersReducer.orders,
		events: state.projectEventsReducer.showEvents ? state.projectEventsReducer.events : [],
		photos: state.photosReducer.photos,
		project: getProject(state.projectsReducer.projects, ownProps.projectId),
		favorites: state.favoritesReducer.favorites,
		projectName: getProject(state.projectsReducer.projects, ownProps.projectId).name,
	};
}, (dispatch) => {
	const props = {
		dispatch,
	};
	const actions = {
		trackState,
		trackAction,
		getCustomerFavorites,
	};
	props.actions = bindActionCreators({
		updateIsRefreshing,
		updateShowProjectEvents,
		updateIsFetchingProjectData,
		getEvents,
		saveProjectFavorite,
		getPhotos,
		saveComment,
		createEvent,
		addOrderToProject,
		loadOrders,
		...actions,
	}, dispatch);
	return props;
}, (ownProps, stateProps, dispatchProps) => {
	return Object.assign({}, ownProps, stateProps, dispatchProps);
}, {
	withRef: true,
})(EventsScreen);
