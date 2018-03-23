'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import styles from '../../lib/styles';
import Form from '../Form';
import FormInput from '../FormInput';
import FixedBottomButton from '../FixedBottomButton';
import helpers from '../../lib/helpers';
import TrackingActions from '../../lib/analytics/TrackingActions';

const componentStyles = StyleSheet.create({
	description: {
		height: 72,
	},
	form: {
		paddingHorizontal: styles.measurements.gridSpace1,
	},
});

export default class ProjectEditSettingsForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
			description: {
				value: props.description,
				valid: true,
			},
			formValid: true,
			name: {
				value: props.name,
				valid: true,
			},
		};
	}

	handleChange = ({ name = this.state.name, description = this.state.description}, formValid) => {
		this.setState({
			description,
			formValid,
			name,
		});
	}

	onPressSave = () => {
		const {
			description = {},
			formValid,
			name = {},
		} = this.state;

		if (formValid) {
			this.props.onSave({
				description: description.value,
				name: name.value,
			});
		}
	}

	render() {
		const { description, formValid, name } = this.state;
		const { isLoading } = this.props;

		return (
			<View style={styles.elements.flex}>
				<Form
					onChange={this.handleChange}
					scrollsToTop={true}
					style={componentStyles.form}
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
				<FixedBottomButton
					accessibilityLabel="Save"
					disabled={!formValid}
					isLoading={isLoading}
					onPress={this.onPressSave}
					pinToKeyboard={false}
					buttonText="Update Settings"
					trackAction={TrackingActions.PROJECT_DETAILS_EDIT_SAVE}
				/>
			</View>
		);
	}
}

ProjectEditSettingsForm.displayName = 'Project Edit Settings Form';

ProjectEditSettingsForm.propTypes = {
	isLoading: PropTypes.bool,
	name: PropTypes.string.isRequired,
	description: PropTypes.string,
	onSave: PropTypes.func.isRequired,
};

ProjectEditSettingsForm.defaultProps = {
	description: '',
	isLoading: false,
	name: '',
	onSave: helpers.noop,
};
