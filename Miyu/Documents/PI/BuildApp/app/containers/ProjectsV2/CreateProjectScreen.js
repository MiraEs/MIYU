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
	Text,
	withScreen,
} from 'BuildLibrary';
import { bindActionCreators } from 'redux';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';
import NavigationBarTextButton from '../../components/navigationBar/NavigationBarTextButton';
import Form from '../../components/Form';
import FormInput from '../../components/FormInput';
import { connect } from 'react-redux';
import {
	withNavigation,
	NavigationStyles,
} from '@expo/ex-navigation';
import {
	createProjectWithDefaultGroup,
	getProjects,
	getShoppingLists,
} from '../../actions/ProjectActions';

const componentStyles = StyleSheet.create({
	description: {
		height: 72,
	},
	form: {
		paddingHorizontal: styles.measurements.gridSpace1,
	},
});

export class CreateProjectScreen extends Component {

	constructor(props) {
		super(props);

		this.state = {
			description: {
				value: '',
				valid: true,
			},
			formValid: true,
			name: {
				value: '',
				valid: true,
			},
		};
	}

	componentDidMount() {
		// make some functions available to the navigation bar
		InteractionManager.runAfterInteractions(() => {
			this.props.navigator.updateCurrentRouteParams({
				onCancel: () => this.props.navigator.pop(),
				onSave: () => this.onPressSave(),
			});
		});
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:more:createproject',
		};
	}

	handleChange = ({ name = this.state.name, description = this.state.description }, formValid) => {
		this.setState({
			description,
			formValid,
			name,
		});
	};

	onPressSave = () => {
		let projectId;
		this.props.actions.createProjectWithDefaultGroup({
			description: this.state.description.value,
			name: this.state.name.value,
		})
			.then(({ project }) => (projectId = project.id))
			.then(() => {
				return Promise.all([
					this.props.actions.getProjects(),
					this.props.actions.getShoppingLists(),
				]);
			})
			.then(() => {
				this.props.navigator.replace('projectDetails', {
					projectId,
				});
			})
			.catch(helpers.noop)
			.done();
	};

	render() {
		const { description, name } = this.state;
		return (
			<View style={componentStyles.form}>
				<Text
					family="archer"
					size="large"
					weight="bold"
				>
					What are you working on?
				</Text>
				<Form
					onChange={this.handleChange}
					scrollsToTop={true}
				>
					<FormInput
						accessibilityLabel="Title"
						autoCapitalize="words"
						autoCorrect={false}
						autoFocus={true}
						isRequired={true}
						isRequiredError="Required."
						label="Title*"
						name="name"
						maxLength={50}
						returnKeyType="next"
						value={name.value}
						validateOnChange={true}
					/>
					<FormInput
						accessibilityLabel="Description"
						autoCapitalize="sentences"
						autoCorrect={false}
						inputStyle={componentStyles.description}
						isRequired={false}
						label="Description"
						maxLength={256}
						multiline={true}
						name="description"
						value={description.value}
						valid={true}
					/>
				</Form>
			</View>
		);
	}
}

CreateProjectScreen.displayName = 'Create Project Screen';

CreateProjectScreen.route = {
	styles: {
		...NavigationStyles.SlideVertical,
		gestures: null,
	},
	navigationBar: {
		visible: true,
		title: 'Create Project',
		renderLeft(route) {
			return (
				<NavigationBarTextButton onPress={() => route.params.onCancel()}>
					Cancel
				</NavigationBarTextButton>
			);
		},
		renderRight(route) {
			return (
				<NavigationBarTextButton onPress={() => route.params.onSave()}>
					Save
				</NavigationBarTextButton>
			);
		},
	},
};

CreateProjectScreen.propTypes = {
	actions: PropTypes.object.isRequired,
	error: PropTypes.string.isRequired,
	navigator: PropTypes.shape({
		pop: PropTypes.func,
		replace: PropTypes.func,
		updateCurrentRouteParams: PropTypes.func,
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
			createProjectWithDefaultGroup,
			getProjects,
			getShoppingLists,
		}, dispatch),
	};
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(withScreen(CreateProjectScreen)));
