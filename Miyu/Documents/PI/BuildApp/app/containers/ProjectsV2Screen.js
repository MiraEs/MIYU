import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	SectionList,
	Keyboard,
	StyleSheet,
	View,
} from 'react-native';
import {
	Button,
	LinkButton,
	Text,
	withScreen,
} from 'BuildLibrary';
import { bindActionCreators } from 'redux';
import styles from '../lib/styles';
import {
	getProjects,
	getShoppingLists,
	updateProjectFilters,
} from '../actions/ProjectActions';
import {
	hasProjects,
	hasMergedProjects,
	mapProjectsDataToObject,
} from '../reducers/helpers/projectsReducerHelper';
import Form from '../components/Form';
import FormInput from '../components/FormInput';
import ListHeader from '../components/listHeader';
import { connect } from 'react-redux';
import ErrorText from '../components/ErrorText';
import TrackingActions from '../lib/analytics/TrackingActions';
import { MIN_PROJECTS_FOR_SEARCH } from '../constants/ProjectConstants';
import { PROJECTSV2 } from '../constants/constants';
import { trackState } from '../actions/AnalyticsActions';
import ProjectRow from '../components/ProjectRow';
import { loadOrders } from '../actions/OrderActions';

const componentStyles = StyleSheet.create({
	projectDetailsRow: {
		flex: 1,
	},
	headerRow: {
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.iOSDivider,
	},
	noProjectsRow: {
		backgroundColor: styles.colors.white,
		padding: styles.measurements.gridSpace2,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.grey,
	},
	loginPromptContainer: {
		alignSelf: 'center',
		flexDirection: 'row',
		marginTop: styles.measurements.gridSpace2,
	},
	form: {
		marginHorizontal: styles.measurements.gridSpace1,
	},
	formInput: {
		marginTop: 0,
	},
	projectOnboardingWrapper: {
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.grey,
	},
	projectOnboardingContainer: {
		backgroundColor: styles.colors.primaryLight,
		margin: styles.measurements.gridSpace1,
		paddingVertical: styles.measurements.gridSpace2,
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
	},
	projectOnboardingText: {
		paddingHorizontal: styles.measurements.gridSpace2,
	},
});

const ARCHIVED_TITLE = 'ARCHIVED PROJECTS';
const ACTIVE_TITLE = 'PROJECTS';

export class ProjectsV2Screen extends Component {

	state = {
		isRefreshing: false,
		projectNameFilter: '',
	};

	componentDidMount() {
		this.props.actions.loadOrders(this.props.customerId);
	}

	componentWillUnmount() {
		this.props.actions.updateProjectFilters('');
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:lists:projects',
		};
	}

	onRefresh = () => {
		if (this.props.isLoggedIn) {
			this.setState({ isRefreshing: true }, () => {
				this.props.actions.getShoppingLists().done();
				this.props.actions.loadOrders(this.props.customerId);
				return this.props.actions.getProjects()
					.done(() => {
						this.setState({ isRefreshing: false });
					});
			});
		}
	};

	onSearchInputChange = ({ search = {} }) => {
		const projectNameFilter = search.value;
		this.setState({ projectNameFilter });
		this.props.actions.updateProjectFilters(projectNameFilter);
	};

	getProjectsData = (props = this.props) => {
		const { projects, isFiltering, filteredProjects } = props;
		if (isFiltering) {
			return this.mapProjectsData(filteredProjects, isFiltering);
		}

		return this.mapProjectsData(projects);
	};

	mapProjectsData = (projects, isFiltering = false) => {
		const { active, archived } = mapProjectsDataToObject(projects);

		if (!active.length) {
			active.push(`You have no ${isFiltering ? 'matching ' : ''}active projects`);
		}
		if (!archived.length) {
			archived.push(`You have no ${isFiltering ? 'matching ' : ''}archived projects`);
		}

		return [{
			data: active,
			title: ACTIVE_TITLE,
		}, {
			data: archived,
			title: ARCHIVED_TITLE,
		}];
	};

	goToProjectFeed = (project) => {
		this.props.navigator.push('projectDetails', {
			projectId: project.id,
			projectName: project.name,
		});
	};

	onLoginPress = () => {
		this.props.navigation.getNavigator('root').push('loginModal', {
			initialScreen: 'LOGIN',
			loginSuccess: () => this.props.navigation.getNavigator('root').pop(),
		});
	};

	onPressNewProject = () => {
		if (this.props.isLoggedIn) {
			this.props.navigation.getNavigator('root').push('createProjectScreen');
		} else {
			this.onLoginPress();
		}
	};

	projectKeyExtractor = (project) => {
		return project.id;
	};

	renderSectionHeader = ({ section: { title = '' } = {} } = {}) => {
		return <ListHeader text={title} />;
	};

	renderProject = ({ item: project }) => {
		return (
			<ProjectRow
				project={project}
				onPress={this.goToProjectFeed}
				analyticsData={{
					trackName: TrackingActions.PROJECT_ROW_TAP,
					trackData: {
						screen: 'Projects',
					},
				}}
			/>
		);
	};

	renderHeader = () => {
		if (hasProjects(this.props.projects)) {
			const newProjectButtonStyle = {
				margin: styles.measurements.gridSpace1,
			};

			return (
				<View style={componentStyles.headerRow}>
					{this.renderNewProjectButton(newProjectButtonStyle)}
					{this.renderProjectsSearch()}
				</View>
			);
		}

		return this.renderProjectOnboarding();
	};

	renderLoginPrompt = () => {
		if (!this.props.isLoggedIn) {
			return (
				<View style={componentStyles.loginPromptContainer}>
					<Text>Already have a Project?{' '}</Text>
					<LinkButton
						accessibilityLabel="Login"
						onPress={this.onLoginPress}
					>
						Login
					</LinkButton>
				</View>
			);
		}
	};

	renderNewProjectButton = (style) => {
		return (
			<Button
				accessibilityLabel="Create New Project"
				onPress={this.onPressNewProject}
				style={style}
				text="Create New Project"
				trackAction={TrackingActions.CREATE_PROJECT}
			/>
		);
	};

	renderProjectsList = () => {
		if (this.props.error) {
			return <ErrorText text={this.props.error} />;
		}

		return (
			<SectionList
				keyExtractor={this.projectKeyExtractor}
				ListHeaderComponent={this.renderHeader}
				onRefresh={this.onRefresh}
				refreshing={this.state.isRefreshing}
				renderItem={this.renderProject}
				renderSectionHeader={this.renderSectionHeader}
				scrollsToTop={true}
				sections={this.getProjectsData()}
			/>
		);
	};

	renderProjectOnboarding = () => {
		const newProjectButtonStyle = {
			marginHorizontal: styles.measurements.gridSpace1,
			marginTop: styles.measurements.gridSpace2,
		};

		return (
			<View style={componentStyles.projectOnboardingWrapper}>
				<View style={componentStyles.projectOnboardingContainer}>
					<Text
						family="archer"
						size="large"
						weight="bold"
						style={componentStyles.projectOnboardingText}
					>
						Start Your First Project
					</Text>
					<Text
						lineHeight={30}
						style={componentStyles.projectOnboardingText}
					>
						Use this free tool and keep any home improvement project on track. Whether
						you're working with a big team on a new home or with your partner on a small
						update, we'll help keep you organized. Create collaborative shopping lists,
						upload progress photos and keep track of your orders all in one place!
					</Text>
					{this.renderNewProjectButton(newProjectButtonStyle)}
					{this.renderLoginPrompt()}
				</View>
			</View>
		);
	};

	renderProjectNameAccent = ({ isInvited, isOwnedByUser } = {}) => {
		if (isInvited) {
			return (
				<Text
					color="accent"
					fontStyle="italic"
				>
					{'  '}Invited
				</Text>
			);
		}
		if (!isOwnedByUser) {
			return (
				<Text
					color="accent"
					fontStyle="italic"
				>
					{'  '}Following
				</Text>
			);
		}
	};

	renderProjectsSearch = () => {
		if (hasMergedProjects(this.props.projects, MIN_PROJECTS_FOR_SEARCH)) {
			return (
				<Form
					onChange={this.onSearchInputChange}
					style={componentStyles.form}
				>
					<FormInput
						accessibilityLabel="search"
						autoCapitalize="none"
						autoCorrect={false}
						icon="search"
						name="search"
						onSubmitEditing={() => Keyboard.dismiss()}
						placeholder="Search Projects"
						returnKeyType="search"
						textInputContainerStyle={componentStyles.formInput}
						value={this.state.projectNameFilter}
					/>
				</Form>
			);
		}
	};

	render() {
		return (
			<View style={styles.elements.screenWithHeaderGreyLight}>
				{this.renderProjectsList()}
			</View>
		);
	}
}

ProjectsV2Screen.displayName = 'Projects Screen';

ProjectsV2Screen.route = {
	navigationBar: {
		title: 'Projects',
	},
};

ProjectsV2Screen.propTypes = {
	actions: PropTypes.object.isRequired,
	customerId: PropTypes.number,
	error: PropTypes.string.isRequired,
	filteredProjects: PropTypes.object.isRequired,
	isFiltering: PropTypes.bool.isRequired,
	isLoggedIn: PropTypes.bool,
	isScreenVisible: PropTypes.bool,
	navigator: PropTypes.shape({
		push: PropTypes.func,
		updateCurrentRouteParams: PropTypes.func,
	}),
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
	projects: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
	return {
		customerId: state.userReducer.user.customerId,
		isFiltering: state.projectsReducer.isFiltering,
		isLoggedIn: state.userReducer.isLoggedIn,
		isScreenVisible: PROJECTSV2 === state.navigation.currentNavigatorUID,
		filteredProjects: state.projectsReducer.filteredProjects,
		projects: state.projectsReducer.projects,
		error: state.projectsReducer.error,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getProjects,
			getShoppingLists,
			loadOrders,
			trackState,
			updateProjectFilters,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(ProjectsV2Screen));
