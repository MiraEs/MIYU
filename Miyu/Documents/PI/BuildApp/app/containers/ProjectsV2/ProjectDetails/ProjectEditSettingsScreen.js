'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import {
	withScreen,
} from 'BuildLibrary';
import styles from '../../../lib/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withNavigation } from '@expo/ex-navigation';
import { saveProject } from '../../../actions/ProjectActions';
import ProjectEditSettingsForm from '../../../components/ShoppingList/ProjectEditSettingsForm';
import ErrorText from '../../../components/ErrorText';
import helpers from '../../../lib/helpers';

export class ProjectEditSettingsScreen extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
		};
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:more:projects:details:editsettings',
		};
	}

	onSave = ({ description = '', name = '' }) => {
		this.setState({ isLoading: true });
		this.props.actions.saveProject({
			...this.props.project,
			description,
			name,
		})
		.then(() => {
			this.props.navigator.pop();
		})
		.catch(helpers.noop)
		.done(() => this.setState({ isLoading: false }));
	};

	render() {
		const { description, name } = this.props.project;
		return (
			<View style={styles.elements.screen}>
				<ErrorText text={this.props.error} />
				<ProjectEditSettingsForm
					description={description}
					isLoading={this.state.isLoading}
					name={name}
					onSave={this.onSave}
				/>
			</View>
		);
	}
}

ProjectEditSettingsScreen.displayName = 'Project Edit Setting Screen';

ProjectEditSettingsScreen.route = {
	navigationBar: {
		title: 'Edit Settings',
	},
};


ProjectEditSettingsScreen.propTypes = {
	actions: PropTypes.object.isRequired,
	error: PropTypes.string.isRequired,
	project: PropTypes.shape({
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		description: PropTypes.string,
	}).isRequired,
	navigator: PropTypes.shape({
		pop: PropTypes.func,
	}),
};

const mapStateToProps = (state) => {
	return {
		error: state.projectsReducer.error,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			saveProject,
		}, dispatch),
	};
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(withScreen(ProjectEditSettingsScreen)));
