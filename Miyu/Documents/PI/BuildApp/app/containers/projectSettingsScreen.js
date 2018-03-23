'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Switch,
	StyleSheet,
} from 'react-native';
import { Text } from 'build-library';
import { getProject } from '../reducers/helpers/projectsReducerHelper';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from '../lib/styles';
import {
	changeProjectStatus,
	getProjects,
	getShoppingLists,
	getShoppingListsForProject,
	loadingShoppingLists,
	projectSaved,
	projectStatusChange,
	projectStatusChangeFail,
	projectUpdated,
	projectSavedFail,
	receiveProjects,
	receiveProjectsFail,
	receiveShoppingLists,
	receiveShoppingListsForProject,
	saveProject,
	savePreAuthProjectData,
	savePreAuthProjectToUser,
	updateProjectFilters,
	setAddToProjectModalFilter,
} from '../actions/ProjectActions';
import TappableListItem from '../components/TappableListItem';
import { trackState } from '../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({
	row: {
		height: 50,
	},
	rowText: {
		flex: 1,
	},
	title: {
		paddingTop: styles.measurements.gridSpace1,
		paddingHorizontal: styles.measurements.gridSpace1,
		color: styles.colors.mediumDarkGray,
		fontFamily: styles.fonts.mainRegular,
	},
	titleSection: {
		borderBottomWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.mediumGray,
		paddingBottom: styles.measurements.gridSpace1,
		paddingLeft: styles.measurements.gridSpace2,
	},
	switch: {
		width:45,
	},
});

class ProjectSettingsScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			archived: props.project.archived,
		};
	}

	componentDidMount() {
		this.props.actions.trackState('build:app:projectsettings');
	}

	updateProjectStatus = (active) => {
		const project = Object.assign({}, this.props.project, {
			archived: !active,
		});
		this.props.actions.changeProjectStatus({
			...project,
		});
		// this state change is just so the UI will be in the right state
		this.setState({
			archived: project.archived,
		});
	};

	getProjectStatusText = () => {
		if (this.state.archived) {
			return <Text>Archived</Text>;
		} else {
			return <Text color="primary" >Active</Text>;
		}
	};

	onManageTeamPress = () => {
		const { project } = this.props;
		this.props.navigator.push('managePeople', {
			projectId: project.id,
			projectName: project.name,
			owner: true,
		});
	};

	navigateToEditProject = () => {
		const { project } = this.props;
		this.props.navigation.getNavigator('root').push('editProject', {
			project,
			isEditMode: true,
		});
	};

	render() {
		return (
			<View style={styles.elements.screenWithHeader}>
				<View style={componentStyles.titleSection}>
					<Text>{this.props.project.name} Settings</Text>
				</View>
				<View style={[styles.elements.row, componentStyles.row]}>
					<Text style={componentStyles.rowText}>Project Status: {this.getProjectStatusText()}</Text>
					<Switch
						style={componentStyles.switch}
						onTintColor={styles.colors.primary}
						onValueChange={this.updateProjectStatus}
						value={!this.state.archived}
					/>
				</View>
				<TappableListItem
					onPress={this.onManageTeamPress}
					body="Manage team"
				/>
				<TappableListItem
					onPress={this.navigateToEditProject}
					body="Edit Project"
				/>
			</View>
		);
	}

}

ProjectSettingsScreen.route = {
	navigationBar: {
		title: 'Project Settings',
	},
};

ProjectSettingsScreen.propTypes = {
	actions: PropTypes.object.isRequired,
	project: PropTypes.shape({
		archived: PropTypes.bool,
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
	}),
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
};

export default connect((state, ownProps) => {
	return {
		...state.projectEventsReducer,
		project: getProject(state.projectsReducer.projects, ownProps.project.id),
	};
}, (dispatch) => {
	return {
		actions: bindActionCreators({
			changeProjectStatus,
			getProjects,
			getShoppingLists,
			getShoppingListsForProject,
			loadingShoppingLists,
			projectSaved,
			projectStatusChange,
			projectStatusChangeFail,
			projectUpdated,
			projectSavedFail,
			receiveProjects,
			receiveProjectsFail,
			receiveShoppingLists,
			receiveShoppingListsForProject,
			saveProject,
			savePreAuthProjectData,
			savePreAuthProjectToUser,
			updateProjectFilters,
			setAddToProjectModalFilter,
			trackState,
		}, dispatch),
	};
})(ProjectSettingsScreen);
