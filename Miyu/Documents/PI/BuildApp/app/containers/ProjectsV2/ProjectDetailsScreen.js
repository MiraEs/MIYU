import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { InteractionManager } from 'react-native';
import {
	TabbedPager,
	withScreen,
} from 'BuildLibrary';
import NavigationBarIconButton from '../../components/navigationBar/NavigationBarIconButton';
import helpers from '../../lib/helpers';
import { connect } from 'react-redux';
import TrackingActions from '../../lib/analytics/TrackingActions';
import { withNavigation } from '@expo/ex-navigation';
import TeamTab from './ProjectDetails/TeamTab';
import ShoppingListTab from './ProjectDetails/ShoppingListTab';
import PhotosTab from './ProjectDetails/PhotosTab';
import { getProject } from '../../reducers/helpers/projectsReducerHelper';

export class ProjectDetailsScreen extends Component {

	constructor(props) {
		super(props);
		this.tabs = [{
			name: 'Shopping List',
			component: (
				<ShoppingListTab
					key="shoppingList"
					projectId={props.projectId}
				/>
			),
		}, {
			name: 'Team',
			component: (
				<TeamTab
					key="team"
					projectId={props.projectId}
				/>
			),
		}, {
			name: 'Photos',
			component: (
				<PhotosTab
					key="shoppingList"
					projectId={props.projectId}
				/>
			),
		}];
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.props.navigator.updateCurrentRouteParams({
				onSettingsPress: this.onProjectDetailsSettingsPress,
				showSettingsButton: !!this.props.project.isOwnedByUser,
				projectName: this.props.project.name,
			});
		});
	}

	componentWillReceiveProps({ project: { name } = {} }) {
		const {
			project: {
				name: oldName,
			} = {},
		} = this.props;
		if (name && name !== oldName) {
			this.props.navigator.updateCurrentRouteParams({
				projectName: name,
			});
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:lists:projects:details',
		};
	}

	onProjectDetailsSettingsPress = () => {
		this.props.navigator.push('projectDetailsSettings', {
			projectId: this.props.projectId,
		});
	};

	render() {
		return (
			<TabbedPager
				tabs={this.tabs}
				initialPage={this.props.selectedTabIndex}
				scrollEnabled={false}
			/>
		);
	}
}

ProjectDetailsScreen.displayName = 'Project Details Screen';

ProjectDetailsScreen.route = {
	navigationBar: {
		visible: true,
		title({ projectName }) {
			return projectName;
		},
		renderRight(route) {
			if (route.params.showSettingsButton) {
				return (
					<NavigationBarIconButton
						onPress={route.params.onSettingsPress}
						iconName={helpers.getIcon('settings')}
						trackAction={TrackingActions.PROJECT_DETAILS_SETTINGS}
					/>
				);
			}
		},
	},
};

ProjectDetailsScreen.propTypes = {
	projectId: PropTypes.number.isRequired,
	loading: PropTypes.bool.isRequired,
	navigator: PropTypes.shape({
		push: PropTypes.func,
		updateCurrentRouteParams: PropTypes.func,
	}),
	project: PropTypes.shape({
		isOwnedByUser: PropTypes.bool,
		name: PropTypes.string,
	}),
	selectedTabIndex: PropTypes.number,
};

ProjectDetailsScreen.defaultProps = {
	selectedTabIndex: 0,
};

const mapStateToProps = (state, ownProps) => {
	return {
		loading: state.projectsReducer.isLoading,
		project: getProject(state.projectsReducer.projects, ownProps.projectId),
	};
};

export default withNavigation(connect(mapStateToProps)(withScreen(ProjectDetailsScreen)));
