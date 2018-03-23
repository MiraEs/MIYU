'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Switch,
	StyleSheet,
	View,
} from 'react-native';
import {
	KeyboardSpacer,
	LinkButton,
	ScrollView,
	Text,
	withScreen,
} from 'BuildLibrary';
import styles from '../../lib/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TrackingActions from '../../lib/analytics/TrackingActions';
import {
	changeProjectStatus,
	saveProject,
} from '../../actions/ProjectActions';
import { withNavigation } from '@expo/ex-navigation';
import { getProject } from '../../reducers/helpers/projectsReducerHelper';
import ErrorText from '../../components/ErrorText';
import { trackAction } from '../../actions/AnalyticsActions';
import helpers from '../../lib/helpers';

const componentStyles = StyleSheet.create({
	overflowHidden: {
		overflow: 'hidden',
	},
	projectWrapper: {
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingVertical: styles.measurements.gridSpace3,
		backgroundColor: styles.colors.white,
		marginTop: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace2,
		borderTopWidth: styles.dimensions.borderWidth,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
	},
	projectNameWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: styles.measurements.gridSpace3,
	},
	projectStatusWrapper: {
		backgroundColor: styles.colors.white,
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingVertical: styles.measurements.gridSpace1,
		borderTopWidth: styles.dimensions.borderWidth,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	projectStatusRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	projectStatusSwitch: {
		marginHorizontal: styles.measurements.gridSpace1,
	},
	errorText: {
		marginHorizontal: styles.measurements.gridSpace1,
	},
});

export class ProjectSettingsScreen extends Component {

	constructor(props) {
		super(props);

		this.state = {
			archived: props.project.archived || false,
			isEdit: props.isEdit,
			isSaving: false,
		};
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:more:projects:details:settings',
		};
	}

	onPressEdit = () => {
		this.props.navigator.push('projectEditSettings', {
			project: this.props.project,
		});
	};

	onSave = ({ description = '', name = '' }) => {
		this.setState({ isSaving: true });
		this.props.actions.saveProject({
			...this.props.project,
			archived: this.state.archived,
			description,
			name,
		})
			.then(() => this.setState({ isEdit: false }))
			.catch(helpers.noop)
			.done(() => this.setState({ isSaving: false }));
	};

	updateProjectStatus = (archived) => {
		this.setState({ archived });

		const project = {
			...this.props.project,
			archived,
		};
		this.props.actions.changeProjectStatus({
			...project,
		})
			.then(() => {
				this.props.actions.trackAction(TrackingActions.PROJECT_ARCHIVE, {
					...project,
				});
			})
			// something failed so set it back
			.catch(() => this.setState({ archived: !archived }))
			.done();
	};

	renderContent = () => {
		return this.renderSettings();
	};

	renderProjectDescription = () => {
		const { project = {} } = this.props;
		if (project.description) {
			return <Text>{project.description}</Text>;
		}
	};

	renderSettings = () => {
		const { project = {} } = this.props;

		return (
			<View>
				<View style={componentStyles.projectNameWrapper}>
					<Text
						size="large"
						style={componentStyles.overflowHidden}
						weight="bold"
					>
						{project.name}
					</Text>
					<LinkButton
						size="small"
						onPress={this.onPressEdit}
					>
						Edit
					</LinkButton>
				</View>
				{this.renderProjectDescription()}
			</View>
		);
	};

	render() {
		const { error } = this.props;
		return (
			<ScrollView style={styles.elements.screenWithHeaderGreyLight}>
				<View>
					<ErrorText
						text={error}
						style={componentStyles.errorText}
					/>
					<View style={componentStyles.projectWrapper}>
						{this.renderContent()}
					</View>
					<View style={componentStyles.projectStatusWrapper}>
						<Text>Archive Project</Text>
						<View style={componentStyles.projectStatusRow}>
							<Switch
								style={componentStyles.projectStatusSwitch}
								onTintColor={styles.colors.primary}
								value={this.state.archived}
								onValueChange={this.updateProjectStatus}
							/>
						</View>
					</View>
				</View>
				<KeyboardSpacer topSpacing={100} />
			</ScrollView>
		);
	}
}

ProjectSettingsScreen.displayName = 'Project Settings Screen';

ProjectSettingsScreen.route = {
	navigationBar: {
		visible: true,
		title: 'Project Settings',
	},
};

ProjectSettingsScreen.propTypes = {
	actions: PropTypes.object.isRequired,
	error: PropTypes.string.isRequired,
	isEdit: PropTypes.bool,
	project: PropTypes.shape({
		archived: PropTypes.bool,
		description: PropTypes.string,
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
	}).isRequired,
	projectId: PropTypes.number.isRequired,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
};

ProjectSettingsScreen.defaultProps = {
	isEdit: false,
};

const mapStateToProps = (state, props) => {
	return {
		error: state.projectsReducer.error,
		project: getProject(state.projectsReducer.projects, props.projectId),
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			changeProjectStatus,
			saveProject,
			trackAction,
		}, dispatch),
	};
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(withScreen(ProjectSettingsScreen)));
