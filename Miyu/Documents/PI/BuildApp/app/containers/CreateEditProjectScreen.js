'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	projectSavedFail,
	saveProject,
} from '../actions/ProjectActions';
import { addOrderToProject } from '../actions/ProjectEventActions';
import { NavigationStyles } from '@expo/ex-navigation';
import { navigatorPopToRoute } from '../actions/NavigatorActions';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import NavigationBarTextButton from '../components/navigationBar/NavigationBarTextButton';
import { EXPERT } from '../constants/constants';
import {
	trackState,
	trackAction,
} from '../actions/AnalyticsActions';
import EventEmitter from '../lib/eventEmitter';
import TrackingActions from '../lib/analytics/TrackingActions';
import Form from '../components/Form';
import FormInput from '../components/FormInput';
import Checkbox from '../components/Checkbox';
import ErrorText from '../components/ErrorText';
import tracking from '../lib/analytics/tracking';
import {
	Button,
	KeyboardSpacer,
	withScreen,
} from 'BuildLibrary';

const componentStyles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: styles.colors.greyLight,
	},
	container: {
		margin: styles.measurements.gridSpace1,
	},
	description: {
		height: 100,
	},
	button: {
		marginTop: styles.measurements.gridSpace1,
		flex: 0,
	},
});

export class CreateEditProject extends Component {

	constructor(props) {
		super(props);
		const { project: { name, description, engageExpert } } = this.props;
		this.state = {
			buttonEnabled: true,
			error: '',
			description,
			engageExpert,
			name,
		};
	}

	componentDidMount() {
		EventEmitter.addListener('onPressCancel', this.onPressCancel);
	}

	componentWillUnmount() {
		EventEmitter.removeListener('onPressCancel', this.onPressCancel);
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:newproject',
		};
	}

	onPressCancel = () => {
		this.props.actions.projectSavedFail('');
		this.props.navigator.pop();
		this.trackAction('cancel');
	};

	handleChange = ({ description = this.state.description, engageExpert = this.state.engageExpert, name = this.state.name }) => {
		if (typeof description === 'object') {
			description = description.value;
		}
		if (typeof engageExpert === 'object') {
			engageExpert = engageExpert.value;
		}
		if (typeof name === 'object') {
			name = name.value;
		}

		if (this.state.engageExpert !== engageExpert) {
			this.trackAction(engageExpert ? 'experton' : 'expertoff');
		}

		this.setState({
			description,
			engageExpert,
			name,
		});
	};

	nextFormField = (fieldName) => {
		this.projectForm._form[fieldName].focus();
	};

	onKeyPress = (event) => {
		if (event.nativeEvent.key === 'Enter') {
			event.preventDefault();
			if (this.state.buttonEnabled) {
				this.saveProject();
			}
		}
	};

	onPressSubmit = () => {
		if (this.state.buttonEnabled) {
			this.saveProject();
			this.trackAction(this.props.isEditMode ? 'save' : 'create');
		}
	};

	saveProject = () => {
		const validForm = this.projectForm.triggerValidation();
		if (!validForm || !this.state.buttonEnabled) {
			return;
		}

		const { actions, customerId, project, orderNumber, popTo } = this.props;
		const { description, engageExpert, name } = this.state;
		const projectData = {
			customerId,
			description,
			engageExpert,
			name,
			id: project.id,
			archived: project.archived,
		};

		if (customerId) {
			this.setState({ buttonEnabled: false });
			actions.projectSavedFail('');
			actions.saveProject(projectData)
				.then((savedProject) => {
					if (orderNumber) {
						actions.addOrderToProject({
							order: {
								orderNumber,
							},
							projectId: savedProject.id,
							customerId,
						});
					}

					EventEmitter.emit('onProjectNameUpdate', name);
					if (popTo) {
						navigatorPopToRoute(popTo, 'root');
					} else {
						this.props.navigator.pop();
					}
				})
				.catch(helpers.noop)
				.done(() => this.setState({ buttonEnabled: true }));
		}
	};

	trackAction = (action) => {
		const { isEditMode } = this.props;
		let stateType;
		if (isEditMode) {
			stateType = 'editproject';
		} else {
			stateType = 'newproject';
			tracking.trackProjectCreated();
		}
		this.props.actions.trackAction(`build:app:${stateType}:${action}`);
	};

	renderCheckbox = () => {
		if (this.props.isEditMode) {
			return null;
		}

		return (
			<Checkbox
				name="engageExpert"
				label={`I would like help from a ${EXPERT}`}
				value={this.state.engageExpert}
			/>
		);
	};

	render() {
		const { buttonEnabled, description, name } = this.state;
		const { error } = this.props;

		return (
			<View style={componentStyles.screen}>
				<Form
					ref={(ref) => this.projectForm = ref}
					onChange={this.handleChange}
					style={componentStyles.container}
				>
					<ErrorText text={error} />
					<FormInput
						autoCapitalize="words"
						autoCorrect={false}
						autoFocus={true}
						name="name"
						isRequired={true}
						isRequiredError="Required."
						label="Title*"
						maxLength={50}
						onSubmitEditing={this.nextFormField.bind(this, 'description')}
						returnKeyType="next"
						value={name}
						accessibilityLabel="Project Title"
					/>
					<FormInput
						autoCapitalize="sentences"
						autoCorrect={false}
						name="description"
						focusOffset={40}
						inputStyle={componentStyles.description}
						isRequired={false}
						label="Description"
						multiline={true}
						onKeyPress={this.onKeyPress}
						returnKeyType="done"
						value={description}
						accessibilityLabel="Project Description"
					/>
					<KeyboardSpacer />
				</Form>
				<Button
					text={this.props.isEditMode ? 'Save Project' : 'Create Project'}
					onPress={this.onPressSubmit}
					style={componentStyles.button}
					isLoading={!buttonEnabled}
					accessibilityLabel="Create Or Save Project Button"
					trackAction={this.props.isEditMode ? TrackingActions.EDIT_PROJECT : TrackingActions.CREATE_PROJECT}
				/>
			</View>
		);
	}
}

CreateEditProject.route = {
	styles: {
		...NavigationStyles.SlideVertical,
		gestures: null,
	},
	navigationBar: {
		visible: true,
		title(params) {
			return params.isEditMode ? 'Edit Project' : 'New Project';
		},
		renderLeft() {
			return <NavigationBarTextButton onPress={() => EventEmitter.emit('onPressCancel')}>Cancel</NavigationBarTextButton>;
		},
	},
};

CreateEditProject.propTypes = {
	actions: PropTypes.object.isRequired,
	customerId: PropTypes.number,
	error: PropTypes.string,
	isEditMode: PropTypes.bool,
	navigator: PropTypes.shape({
		pop: PropTypes.func,
	}),
	orderNumber: PropTypes.number,
	popTo: PropTypes.string,
	project: PropTypes.shape({
		name: PropTypes.string,
		description: PropTypes.string,
		id: PropTypes.number,
		archived: PropTypes.bool,
	}),
};

CreateEditProject.defaultProps = {
	customerId: 0,
	error: '',
	isEditMode: false,
	project: {
		name: '',
		description: '',
		id: undefined,
		archived: false,
		engageExpert: false,
	},
};

const mapStateToProps = (state) => {
	return {
		customerId: state.userReducer.user.customerId,
		error: state.projectsReducer.error,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			addOrderToProject,
			projectSavedFail,
			saveProject,
			trackState,
			trackAction,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(CreateEditProject));
