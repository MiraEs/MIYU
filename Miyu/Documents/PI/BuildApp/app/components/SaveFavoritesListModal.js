import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import styles from '../lib/styles';
import Form from '../components/Form';
import FormInput from '../components/FormInput';
import FixedBottomButton from '../components/FixedBottomButton';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import helpers from '../lib/helpers';
import TrackingActions from '../lib/analytics/TrackingActions';
import { Text } from 'BuildLibrary';

const componentStyles = StyleSheet.create({
	content: {
		flex: 1,
		padding: styles.measurements.gridSpace1,
		paddingTop: styles.measurements.gridSpace2,
	},
	button: {
		marginTop: styles.measurements.gridSpace9,
	},
});

export default class SaveFavoritesListModal extends Component {

	constructor(props) {
		super(props);
		this.state = {
			favoritesName: props.favorite ? props.favorite.name : null,
		};
	}

	onSave = () => {
		if (this.saveForm.triggerValidation()) {
			this.props.onSavePress(this.state.favoritesName);
		}
	};

	renderKeyboardSpacer = () => {
		return helpers.isIOS() ? <KeyboardSpacer/> : null;
	};

	onChange = (saveForm) => {
		const formState = {};

		for (const key in saveForm) {
			formState[key] = saveForm[key].value;
		}

		this.setState(formState);
	};

	render() {
		return (
			<View style={componentStyles.content}>
				<Form
					ref={(ref) => this.saveForm = ref}
					onChange={this.onChange}
				>
					<FormInput
						name="favoritesName"
						hideErrorText={true}
						isRequired={true}
						label="List Name"
						returnKeyType="go"
						onSubmitEditing={this.onSave}
						value={this.state.favoritesName}
						accessibilityLabel="List Name Input"
					/>
					<Text
						color="error"
						textAlign="center"
					>
						{this.props.error}
					</Text>
				</Form>
				{this.renderKeyboardSpacer()}
				<FixedBottomButton
					buttonText="Save Favorites List"
					onPress={this.onSave}
					accessibilityLabel="Save List Button"
					trackAction={this.props.favorite ? TrackingActions.FAVORITE_EDIT_LIST : TrackingActions.FAVORITE_CREATE_LIST}
				/>
			</View>
		);
	}

}

SaveFavoritesListModal.propTypes = {
	onSavePress: PropTypes.func.isRequired,
	error: PropTypes.string,
	favorite: PropTypes.object,
};
