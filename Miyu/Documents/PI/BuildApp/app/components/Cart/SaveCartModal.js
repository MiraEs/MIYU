'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';
import FixedBottomButton from '../FixedBottomButton';
import Form from '../Form';
import FormInput from '../FormInput';
import { SAVE_CART } from '../../lib/analytics/TrackingActions';

const componentStyles = StyleSheet.create({
	content: {
		flex: 1,
		backgroundColor: styles.colors.white,
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingVertical: styles.measurements.gridSpace2,
	},
});

class SaveCartModal extends Component {

	constructor(props) {
		super(props);

		this.state = {
			cartName: null,
		};
	}

	onSave = () => {
		this.saveForm.triggerValidation();

		if (this.state.cartName) {
			this.props.onSave(this.state.cartName);
			this.setState({ cartName: null });
		}
	};

	onChange = (saveForm) => {
		const formState = {};

		for (const key in saveForm) {
			formState[key] = saveForm[key].value;
		}

		this.setState(formState);
	};

	renderKeyboardSpacer = () => {
		return helpers.isIOS() ? <KeyboardSpacer/> : null;
	};

	render() {
		return (
			<View style={componentStyles.content}>
				<Form
					ref={(ref) => this.saveForm = ref}
					onChange={this.onChange}
				>
					<FormInput
						name="cartName"
						hideErrorText={true}
						isRequired={true}
						label="Cart Name"
						returnKeyType="done"
						value={this.state.cartName}
						accessibilityLabel="Cart Name Field"
					/>
				</Form>
				{this.renderKeyboardSpacer()}
				<FixedBottomButton
					buttonText="Save"
					onPress={this.onSave}
					accessibilityLabel="Save Cart Button"
					trackAction={SAVE_CART}
				/>
			</View>
		);
	}
}

SaveCartModal.propTypes = {
	onSave: PropTypes.func.isRequired,
};

export default SaveCartModal;
