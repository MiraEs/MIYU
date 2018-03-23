import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	InteractionManager,
	StyleSheet,
	View,
} from 'react-native';
import {
	ListView,
	withScreen,
	TextInputWithButton,
	KeyboardSpacer,
} from 'BuildLibrary';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	withNavigation,
	NavigationStyles,
} from '@expo/ex-navigation';
import NavigationBarTextButton from '../components/navigationBar/NavigationBarTextButton';
import EventEmitter from '../lib/eventEmitter';
import styles from '../lib/styles';
import SearchFilterInput from '../components/SearchFilterInput';
import AddToProjectRow from '../components/AddToProjectRow';
import {
	getProjects,
	getShoppingLists,
	projectsSearchFilter,
	addItemToShoppingList,
	createProjectWithDefaultGroup,
	itemAddedToProject,
} from '../actions/ProjectActions';
import helpers from '../lib/helpers';
import AddToProjectTutorial from '../components/AddToProjectTutorial';
import SimpleStoreHelpers from '../lib/SimpleStoreHelpers';
import TrackingActions from '../lib/analytics/TrackingActions';
import { MIN_PROJECTS_FOR_SEARCH } from '../constants/ProjectConstants';
import { mergeSessionCartItemsAttachToMultipleProjects } from '../actions/CartActions';
import isEqual from 'lodash.isequal';
import cloneDeep from 'lodash.clonedeep';
import { trackAction } from '../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({
	createProjectInputText: {
		justifyContent: 'center',
		height: 42,
		paddingHorizontal: styles.measurements.gridSpace2,
	},
	rowSeparator: {
		height: 1,
		backgroundColor: styles.colors.greyLight,
	},
});

export class AddToProjectModal extends Component {
	constructor(props) {
		super(props);
		this.defaultSessionCartIDs = {};
		const { projects } = props;
		const filteredProjects = this.filterProjects(projects);
		this.state = {
			projectsDataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
			projectsData: filteredProjects,
			showProjectSearch: this.shouldShowSearch(filteredProjects),
			tutorialSeen: true,
			isCreatingProject: false,
			selectedSessionCartIDs: {},
		};
	}

	componentWillMount() {
		const {
			actions,
			navigator,
			navigation,
			title,
		} = this.props;
		helpers.setStatusBarStyle('default', false);
		InteractionManager.runAfterInteractions(() => {
			navigator.updateCurrentRouteParams({
				onCancel: () => {
					actions.trackAction(TrackingActions.MODAL_CANCEL, { screen: 'Add To Project' });
					navigation.getNavigator('root').pop();
				},
				onDone: () => {
					actions.trackAction(TrackingActions.MODAL_DONE, { screen: 'Add To Project' });
					this.onDoneButtonPress();
				},
				disableDone: true,
				title,
			});
		});
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.error !== nextProps.error) {
			EventEmitter.emit('showScreenAlert', {
				message: nextProps.error,
				type: 'error',
			});
		}

		if (!isEqual(this.props.projects, nextProps.projects)) {
			this.onProjectsDataChange(nextProps.projects);
		}

		if (nextProps.customerId && this.props.customerId !== nextProps.customerId) {
			this.props.actions.getShoppingLists().done();
		}

		SimpleStoreHelpers.hasSeenAddToProjectTutorial().then((tutorialSeen) => {
			this.setState({ tutorialSeen: tutorialSeen === null ? false : tutorialSeen });
			if (!tutorialSeen) {
				this.showTutorial(nextProps.isLoggedIn);
			}
		});
	}

	componentWillUnmount() {
		this.props.actions.projectsSearchFilter('');
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:addtoprojectmodal',
		};
	}

	getScreenData = () => {
		if (this.props.customerId) {
			this.props.actions.getShoppingLists().done();
			this.props.actions.getProjects().done();
		}
	};

	shouldShowSearch = (projectsData) => {
		return projectsData && projectsData.length >= MIN_PROJECTS_FOR_SEARCH;
	};

	filterProjects = (projects) => {
		return projects.filter((project) => project.project.name && !project.project.archived);
	};

	onProjectsDataChange = (projectsData) => {
		this.setState({
			projectsData: this.filterProjects(projectsData),
			showProjectSearch: this.shouldShowSearch(projectsData),
		});
	};

	getProjectsData = () => {
		return this.state.projectsDataSource.cloneWithRows(this.state.projectsData);
	};

	showTutorial = (isLoggedIn) => {
		const component = (
			<AddToProjectTutorial
				onPress={(openLogin, initialScreen) => {
					if (openLogin) {
						this.props.navigation.getNavigator('root').push('loginModal', {
							initialScreen,
							loginSuccess: () => {
								this.setState({ tutorialSeen: true });
								this.props.navigation.getNavigator('root').pop();
							},
						});
					} else {
						this.setState({ tutorialSeen: true });
					}
				}}
				isLoggedIn={isLoggedIn}
			/>
		);
		InteractionManager.runAfterInteractions(() => {
			EventEmitter.emit('showCustomScreenOverlay', {
				component,
				alpha: 0.6,
				disableClickToHide: true,
			});
		});
	};

	hasSessionCartIDs = () => {
		return this.state.selectedSessionCartIDs && Object.keys(this.state.selectedSessionCartIDs).length;
	};

	onDoneButtonPress = () => {
		if (this.hasSessionCartIDs()) {
			if (this.props.itemToAdd) {
				const {
					actions,
					itemToAdd,
					itemToAddConfiguration: {
						uniqueId,
						selectedPricedOptions,
					},
				} = this.props;
				const sessionCartItems = [];
				const pricedOptions = [];
				selectedPricedOptions.forEach((optionGroup) => {
					if (optionGroup) {
						optionGroup.pricedOptions.forEach((option) => {
							pricedOptions.push({
								keyCode: option.keyCode,
								pricedOptionId: option.pricedOptionId,
							});
						});
					}
				});

				sessionCartItems.push({
					productUniqueId: uniqueId,
					quantity: itemToAdd.quantity,
					pricedOptions,
				});
				const projectIds = Object.keys(this.state.selectedSessionCartIDs);
				const addItemCalls = [];
				projectIds.forEach((projectId) => {
					this.state.selectedSessionCartIDs[projectId].forEach((sessionCartId) => {
						addItemCalls.push(
							actions.addItemToShoppingList({
								sessionCartItems,
								sessionCartId,
							})
						);
					});
				});
				Promise.all(addItemCalls)
					.then(() => this.finishAddingItem(projectIds.length === 1 ? projectIds[0] : null))
					.catch(() => {
						EventEmitter.emit('showScreenAlert', {
							message: 'Failed to add item. Try again.',
							type: 'error',
						});
					})
					.done();
			} else {
				const { sessionCartId: fromSessionCartId, actions } = this.props;
				const projectIds = Object.keys(this.state.selectedSessionCartIDs);
				actions.mergeSessionCartItemsAttachToMultipleProjects(fromSessionCartId, this.state.selectedSessionCartIDs, projectIds)
					.then(() => this.finishAddingItem(projectIds.length === 1 ? projectIds[0] : null))
					.catch(() => {
						EventEmitter.emit('showScreenAlert', {
							message: 'Failed to add items. Try again.',
							type: 'error',
						});
					})
					.done();
			}
		} else {
			EventEmitter.emit('showScreenAlert', {
				message: 'You must select a project or group.',
				type: 'warning',
			});
		}
	};

	/**
	 * If an item was added to a single project then send that id to the redux
	 * @param projectId
	 */
	finishAddingItem = (projectId) => {
		this.props.actions.itemAddedToProject({
			added: true,
			projectId: parseInt(projectId, 10),
		});
		this.props.navigation.getNavigator('root').pop();

		this.props.onSuccess({
			selectedSessionCartIDs: this.state.selectedSessionCartIDs,
		});
	};

	onCreateNewProject = (name) => {
		const { actions, isLoggedIn } = this.props;

		if (isLoggedIn) {
			this.setState({ isCreatingProject: true });
			actions.createProjectWithDefaultGroup({ name })
				.then((project) => {
					const defaultSessionCartId = this.getProjectDefaultSessionCartId(project);
					this.addSessionCartId(true, project.project.id, defaultSessionCartId);
					if (this.createProjectInputRef) {
						this.createProjectInputRef.clearInput();
					}
				})
				.done(() => this.setState({ isCreatingProject: false }));
		} else {
			this.props.navigation.getNavigator('root').push('loginModal', {
				loginSuccess: () => this.props.navigation.getNavigator('root').pop(),
			});
		}
	};

	getProjectDefaultSessionCartId = (project) => {
		const defaultShoppingList = project.shoppingLists.find((shoppingList) => !shoppingList.name);
		if (defaultShoppingList) {
			const { projectId, sessionCart: { sessionCartId } } = defaultShoppingList;
			this.defaultSessionCartIDs[projectId] = sessionCartId;
			return sessionCartId;
		}
		return null;
	};

	addSessionCartId = (selected, projectId, sessionCartId) => {
		const selectedSessionCartIDs = cloneDeep(this.state.selectedSessionCartIDs);
		let projectSessionCardIDSet = selectedSessionCartIDs[projectId];
		if (!projectSessionCardIDSet) {
			selectedSessionCartIDs[projectId] = new Set();
			projectSessionCardIDSet = selectedSessionCartIDs[projectId];
		}
		if (selected) {
			const defaultSessionCartId = this.defaultSessionCartIDs[projectId];
			/*
			 * if a group is selected from a project then make sure to remove the default shopping list from the session
			 * carts list.
			 */
			if (defaultSessionCartId && projectSessionCardIDSet.has(defaultSessionCartId)) {
				projectSessionCardIDSet.delete(defaultSessionCartId);
			}
			projectSessionCardIDSet.add(sessionCartId);
		} else {
			projectSessionCardIDSet.delete(sessionCartId);
			if (!projectSessionCardIDSet.size) {
				const defaultSessionCartId = this.defaultSessionCartIDs[projectId];
				/*
				 * if the last deleted sessionCartId was a group sessionCartId, then we need to add the default
				 * sessionCartId to the list
				 */
				if (defaultSessionCartId === sessionCartId) {
					delete selectedSessionCartIDs[projectId];
				} else {
					projectSessionCardIDSet.add(defaultSessionCartId);
				}
			}
		}

		this.setState({ selectedSessionCartIDs }, () => {
			this.props.navigator.updateCurrentRouteParams({ disableDone: !this.hasSessionCartIDs() });
		});
	};

	onGroupRowPress = (groupRowData) => {
		const { projectId, sessionCart: { sessionCartId } } = groupRowData;
		const selected = this.state.selectedSessionCartIDs[projectId] && this.state.selectedSessionCartIDs[projectId].has(sessionCartId);
		this.addSessionCartId(!selected, projectId, sessionCartId);
	};

	onProjectRowPress = (rowData) => {
		const defaultSessionCartId = this.getProjectDefaultSessionCartId(rowData);
		const { project: { id: projectId } } = rowData;
		const selected = !!this.state.selectedSessionCartIDs[projectId];
		this.addSessionCartId(!selected, projectId, defaultSessionCartId);
	};

	renderProjectRow = (rowData, sectionID, rowID) => {
		return (
			<AddToProjectRow
				expandRow={!this.state.tutorialSeen}
				rowData={rowData}
				rowID={rowID}
				onRowPress={this.onProjectRowPress}
				onGroupRowPress={this.onGroupRowPress}
				customerId={this.props.customerId}
				onCreateNewGroupSuccess={(shoppingList) => {
					this.addSessionCartId(true, rowData.project.id, shoppingList.sessionCart.sessionCartId);
				}}
				listViewRef={this.listViewRef}
				selectedSessionCartIDs={this.state.selectedSessionCartIDs[rowData.project.id]}
			/>
		);
	};

	renderSeparator = (section, row) => {
		return (
			<View
				key={row}
				style={componentStyles.rowSeparator}
			/>
		);
	};

	renderHeaderSearch = () => {
		if (this.props.isFiltering || this.state.showProjectSearch) {
			return (
				<SearchFilterInput
					onChangeText={this.props.actions.projectsSearchFilter}
					placeholder="Search Projects"
					theme="listview"
					style={{
						input: {
							paddingHorizontal: styles.measurements.gridSpace2,
						},
					}}
					selectionColor={styles.colors.primary}
				/>
			);
		}
	};

	renderHeader = () => {
		return (
			<View>
				<TextInputWithButton
					ref={(ref) => {
						if (ref) {
							this.createProjectInputRef = ref;
						}
					}}
					onCreate={this.onCreateNewProject}
					buttonText="Create"
					placeholderText="Create New Project"
					analytics={{
						actionName: TrackingActions.ADD_TO_PROJECT_CREATE_PROJECT_TAP,
					}}
					isLoading={this.state.isCreatingProject}
				/>
				<View style={componentStyles.rowSeparator} />
				{this.renderHeaderSearch()}
			</View>
		);
	};

	render() {
		return (
			<View style={styles.elements.screenWithHeader}>
				<ListView
					ref={(ref) => {
						if (ref) {
							this.listViewRef = ref;
						}
					}}
					dataSource={this.getProjectsData()}
					renderHeader={this.renderHeader}
					renderRow={this.renderProjectRow}
					renderSeparator={this.renderSeparator}
					scrollsToTop={true}
					enableEmptySections={true}
					keyboardShouldPersistTaps="handled"
				/>
				<KeyboardSpacer />
			</View>
		);
	}
}

AddToProjectModal.propTypes = {
	actions: PropTypes.object,
	customerId: PropTypes.number,
	error: PropTypes.string,
	isFiltering: PropTypes.bool,
	isLoggedIn: PropTypes.bool,
	itemToAdd: PropTypes.shape({
		productConfigurationId: PropTypes.string,
		quantity: PropTypes.number,
	}),
	itemToAddConfiguration: PropTypes.object,
	loading: PropTypes.bool,
	modal: PropTypes.object,
	navigator: PropTypes.shape({
		updateCurrentRouteParams: PropTypes.func,
	}),
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
	onSuccess: PropTypes.func,
	projects: PropTypes.array,
	sessionCartId: PropTypes.number,
	title: PropTypes.string,
};

AddToProjectModal.defaultProps = {
	onSuccess: helpers.noop,
	title: 'Add To Project',
};

AddToProjectModal.route = {
	styles: {
		...NavigationStyles.SlideVertical,
		gestures: null,
	},
	navigationBar: {
		visible: true,
		title: (params) => params.title,
		renderLeft(route) {
			return (
				<NavigationBarTextButton
					onPress={() => route.params.onCancel()}
				>
					Cancel
				</NavigationBarTextButton>
			);
		},
		renderRight(route) {
			return (
				<NavigationBarTextButton
					onPress={() => route.params.onDone()}
					disabled={route.params.disableDone}
				>
					Done
				</NavigationBarTextButton>
			);
		},
	},
};

const mapStateToProps = (state, { itemToAdd, itemToAddConfiguration }) => {
	let configuration = itemToAddConfiguration;
	if (!configuration) {
		configuration = itemToAdd ? state.productConfigurationsReducer[itemToAdd.productConfigurationId] : null;
	}

	const { isFiltering, shoppingLists, filteredShoppingLists } = state.projectsReducer;
	const { isLoggedIn } = state.userReducer;
	const projects = isFiltering ? filteredShoppingLists : shoppingLists;

	return {
		customerId: state.userReducer.user.customerId,
		error: state.projectsReducer.error,
		loading: state.projectsReducer.loadingShoppingLists,
		modal: state.referenceReducer.modal,
		projects: cloneDeep(projects),
		itemToAddConfiguration: configuration,
		isLoggedIn,
		isFiltering,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			addItemToShoppingList,
			projectsSearchFilter,
			getProjects,
			getShoppingLists,
			createProjectWithDefaultGroup,
			itemAddedToProject,
			mergeSessionCartItemsAttachToMultipleProjects,
			trackAction,
		}, dispatch),
	};
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(withScreen(AddToProjectModal)));
