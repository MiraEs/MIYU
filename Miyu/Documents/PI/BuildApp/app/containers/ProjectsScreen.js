'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
	TouchableHighlight,
	LayoutAnimation,
	PixelRatio,
	TextInput,
	RefreshControl,
} from 'react-native';
import {
	ListView,
	Text,
	withScreen,
} from 'BuildLibrary';
import { bindActionCreators } from 'redux';
import styles from '../lib/styles';
import {
	getProjects,
	updateProjectFilters,
} from '../actions/ProjectActions';
import { hasProjects } from '../reducers/helpers/projectsReducerHelper';
import pluralize from 'pluralize';
import NavigationBarIconButton from '../components/navigationBar/NavigationBarIconButton';
import animations from '../lib/animations';
import helpers from '../lib/helpers';
import Icon from 'react-native-vector-icons/Ionicons';
import ListHeader from '../components/listHeader';
import ProjectOnboardingPrompt from '../components/projectOnboardingPrompt';
import EventEmitter from '../lib/eventEmitter';
import { connect } from 'react-redux';
import TextHighlighter from '../components/TextHighlighter';
import { addOrderToProject } from '../actions/ProjectEventActions';
import ErrorText from '../components/ErrorText';
import TrackingActions from '../lib/analytics/TrackingActions';
import { trackAction } from '../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({
	separator: {
		height: 1 / PixelRatio.get(),
		backgroundColor: styles.colors.iOSDivider,
	},
	projectRow: {
		flexDirection: 'row',
	},
	projectDetailsRow: {
		flex: 1,
	},
	projectRowIcon: {
		marginRight: styles.measurements.gridSpace2,
	},
	projectSearch: {
		height: 40,
		paddingHorizontal: styles.measurements.gridSpace1,
		fontFamily: styles.fonts.mainRegular,
	},
	headerRow: {
		height: 44,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.iOSDivider,
		overflow: 'hidden',
	},
});

export class ProjectsScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			projects: this.getProjectsListViewDataSource(props),
			isRefreshing: false,
			projectNameFilter: '',
		};
	}

	componentDidMount() {
		EventEmitter.addListener('onNewProjectButtonPress', this.onNewProjectButtonPress);
	}

	componentWillReceiveProps(nextProps) {
		this.onProjectStoreChange(nextProps);
	}

	componentWillUnmount() {
		this.props.actions.updateProjectFilters('');
		EventEmitter.removeAllListeners('onNewProjectButtonPress');
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:more:projects',
		};
	}

	getScreenData = () => {
		this.props.actions.getProjects().done();
	};

	/**
	 * Pull to refresh handler
	 */
	onRefresh = () => {
		this.setState({ isRefreshing: true });
		return this.props.actions.getProjects()
			.done(() => {
				this.setState({ isRefreshing: false });
			});
	};

	onNewProjectButtonPress = () => {
		const { orderNumber, popTo } = this.props;

		this.props.actions.trackAction('Create_new_project_tap');
		this.props.navigation.getNavigator('root').push('newProject', {
			orderNumber,
			popTo,
		});
	};

	onProjectStoreChange = (props) => {
		LayoutAnimation.configureNext(animations.fadeIn);
		this.setState({
			projects: this.getProjectsListViewDataSource(props),
		});
	};

	onSearchInputChange = (projectNameFilter) => {
		this.setState({ projectNameFilter });
		this.props.actions.updateProjectFilters(projectNameFilter);
	};

	getProjectsData = (props = this.props) => {
		const { projects, isFiltering, filteredProjects } = props;
		if (isFiltering) {
			return this.mapProjectsData(filteredProjects);
		}

		return this.mapProjectsData(projects);
	};

	mapProjectsData = (projects) => {
		const {
			active: activeProjects,
			archived: archivedProjects,
		} = projects;
		const returnStruct = {};

		if (activeProjects.myProjects && activeProjects.myProjects.length) {
			returnStruct.myActiveProjects = activeProjects.myProjects;
		}
		if (activeProjects.sharedProjects && activeProjects.sharedProjects.length) {
			returnStruct.sharedActiveProjects = activeProjects.sharedProjects;
		}
		if (archivedProjects.myProjects && archivedProjects.myProjects.length) {
			returnStruct.myArchivedProjects = archivedProjects.myProjects;
		}
		if (archivedProjects.sharedProjects && archivedProjects.myProjects.length) {
			returnStruct.sharedArchivedProjects = archivedProjects.sharedProjects;
		}
		return returnStruct;
	};

	getProjectsListViewDataSource = (props) => {
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
		});
		const data = this.getProjectsData(props);
		return ds.cloneWithRowsAndSections(data, Object.keys(data));
	};

	goToProjectFeed = (project) => {
		const { actions, customerId, orderNumber } = this.props;

		if (orderNumber) {
			actions.addOrderToProject({
				order: {
					orderNumber,
				},
				projectId: project.id,
				customerId,
			});
			this.props.navigation.getNavigator('root').pop();
		} else {
			this.props.navigator.push('feed', {
				projectId: project.id,
				title: project.name,
				isOwner: project.isOwnedByUser,
				project,
			});
		}
	};

	renderProjectSpecs = (project) => {
		const attributes = [];
		const memberText = pluralize('Person', project.teamMemberCount + 1, true);
		const orderText = pluralize('Order', project.orderCount, true);
		const photosText = pluralize('Photo', project.photoGalleryCount, true);
		const favoriteText = pluralize('List', project.favoriteListCount, true);
		attributes.push(memberText);
		if (project.photoGalleryCount > 0) {
			attributes.push(photosText);
		}
		if (project.favoriteListCount > 0) {
			attributes.push(favoriteText);
		}
		if (project.orderCount > 0) {
			attributes.push(orderText);
		}
		return attributes.join(' ∙ ');
	};

	renderSectionHeader = (data, sectionId) => {
		const sectionHeaders = {
			myActiveProjects: 'MY PROJECTS',
			sharedActiveProjects: 'SHARED WITH ME',
			myArchivedProjects: 'MY ARCHIVED PROJECTS',
			sharedArchivedProjects: 'ARCHIVED PROJECTS SHARED WITH ME',
		};
		return <ListHeader text={sectionHeaders[sectionId]} />;
	};

	renderProject = (project) => {
		return (
			<TouchableHighlight
				onPress={() => this.goToProjectFeed(project)}
				underlayColor="rgba(0, 0, 0, .1)"
			>
				<View style={[styles.elements.row, componentStyles.projectRow]}>
					<Icon
						name="ios-folder-outline"
						size={34}
						color={styles.colors.secondary}
						style={componentStyles.projectRowIcon}
					/>
					<View style={componentStyles.projectDetailsRow}>
						<TextHighlighter
							textToMatch={this.state.projectNameFilter}
							fullText={project.name}
						/>
						<Text>{this.renderProjectSpecs(project)}</Text>
					</View>
					<View style={componentStyles.separator} />
				</View>
			</TouchableHighlight>
		);
	};

	renderHeader = () => {
		return (
			<View style={componentStyles.headerRow}>
				<TextInput
					clearButtonMode="while-editing"
					autoCapitalize="none"
					autoCorrect={false}
					placeholder="Search for project by name"
					onChangeText={this.onSearchInputChange}
					style={[styles.elements.inputGroupItem, componentStyles.projectSearch]}
					underlineColorAndroid="transparent"
				/>
			</View>
		);
	};

	renderScreenContent = () => {
		const { error } = this.props;

		if (error) {
			return <ErrorText text={error} />;
		}

		return (
			<ListView
				dataSource={this.state.projects}
				automaticallyAdjustContentInsets={false}
				refreshControl={
					<RefreshControl
						onRefresh={this.onRefresh}
						refreshing={this.state.isRefreshing}
					/>
				}
				renderHeader={this.renderHeader}
				renderSectionHeader={this.renderSectionHeader}
				renderRow={this.renderProject}
				scrollsToTop={true}
			/>
		);
	};

	render() {
		if (!hasProjects(this.props.projects)) {
			return (
				<ProjectOnboardingPrompt />
			);
		}
		return (
			<View style={!this.props.orderNumber ? styles.elements.screenWithHeader : null}>
				{this.renderScreenContent()}
			</View>
		);
	}

}

ProjectsScreen.displayName = 'Projects Screen';

ProjectsScreen.route = {
	navigationBar: {
		visible: true,
		title: 'Projects',
		renderRight() {
			return (
				<NavigationBarIconButton
					onPress={() => EventEmitter.emit('onNewProjectButtonPress')}
					iconName={helpers.getIcon('add')}
					trackAction={TrackingActions.PROJECTS_NAV_TAP_ADD_PROJECT}
				/>
			);
		},
	},
};

ProjectsScreen.propTypes = {
	actions: PropTypes.object.isRequired,
	error: PropTypes.string.isRequired,
	customerId: PropTypes.number.isRequired,
	projects: PropTypes.object.isRequired,
	isFiltering: PropTypes.bool.isRequired,
	filteredProjects: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
	orderNumber: PropTypes.number,
	popTo: PropTypes.string,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
};

const mapStateToProps = (state) => {
	return {
		customerId: state.userReducer.user.customerId,
		loading: state.projectsReducer.isLoading,
		isFiltering: state.projectsReducer.isFiltering,
		filteredProjects: state.projectsReducer.filteredProjects,
		projects: state.projectsReducer.projects,
		error: state.projectsReducer.error,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			addOrderToProject,
			getProjects,
			updateProjectFilters,
			trackAction,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(ProjectsScreen));
