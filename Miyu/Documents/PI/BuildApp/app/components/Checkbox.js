import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	ViewPropTypes,
} from 'react-native';
import styles from '../lib/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from 'BuildLibrary';

const componentStyles = StyleSheet.create({
	component: {
		paddingVertical: styles.measurements.gridSpace2,
	},
	box: {
		height: 20,
		width: 20,
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
		marginLeft: styles.measurements.gridSpace1,
		marginRight: styles.measurements.gridSpace2,
		backgroundColor: styles.colors.white,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	selected: {
		borderColor: styles.colors.accent,
		backgroundColor: styles.colors.accent,
	},
	checkmark: {
		backgroundColor: 'transparent',
	},
});

export default class Checkbox extends Component {

	constructor(props, context) {
		super(props);

		if (context && context.registerInputWithForm && typeof context.registerInputWithForm === 'function') {
			context.registerInputWithForm(this);
		}
	}

	handleChange = () => {
		const { name, onChange, value } = this.props;
		const { onInputValueChange } = this.context;

		// pass the changes up the chain
		if (typeof onInputValueChange === 'function') {
			onInputValueChange(name, !value, true);
		}
		if (typeof onChange === 'function') {
			onChange(!value, true);
		}
	};

	// this function is here so Checkbox can be wrapped in a Form
	isValid = () => {
		return true;
	};

	// this function is here so Checkbox can be wrapped in a Form
	triggerValidation = () => {
		return true;
	};

	render() {
		const {
			value,
			label,
			style,
		} = this.props;

		return (
			<TouchableOpacity
				style={[componentStyles.component, style]}
				onPress={this.handleChange}
				underlayColor="rgba(0, 0, 0, .1)"
			>
				<View style={styles.elements.centeredFlexRow}>
					<View style={[componentStyles.box, value ? componentStyles.selected : null]}>
						<Icon
							size={20}
							name="md-checkmark"
							color={styles.colors.white}
							style={componentStyles.checkmark}
						/>
					</View>
					<Text style={styles.elements.flex}>{label}</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

Checkbox.contextTypes = {
	formHandle: PropTypes.object,
	inputFocusOffset: PropTypes.number,
	onSubmitEditing: PropTypes.func,
	registerInputWithForm: PropTypes.func,
	onInputValueChange: PropTypes.func,
};

Checkbox.propTypes = {
	name: PropTypes.string.isRequired,
	label: PropTypes.string,
	onChange: PropTypes.func,
	value: PropTypes.bool,
	style: ViewPropTypes.style,
};

Checkbox.defaultProps = {
	label: '',
	value: false,
};
