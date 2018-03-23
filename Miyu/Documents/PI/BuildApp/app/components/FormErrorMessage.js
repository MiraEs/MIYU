import React, {
	Component,
} from 'react';
import {
	StyleSheet,
	View,
	Platform,
	ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from 'build-library';
import styles from '../lib/styles';


const componentStyles = StyleSheet.create({
	errorContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	errorIcon: {
		marginBottom: styles.measurements.gridSpace2,
		marginRight: 4,
	},
	errorText: {
		marginBottom: styles.measurements.gridSpace2,
	},
});

const iconName = Platform.OS === 'ios' ? 'ios-close-circle' : 'md-close-circle';

class FormErrorMessage extends Component {

	render() {
		const { errorStyle, message } = this.props;

		return (
			<View style={componentStyles.errorContainer}>
				<Icon
					name={iconName}
					size={16}
					color={styles.colors.error}
					style={[
						componentStyles.errorIcon,
						errorStyle,
					]}
				/>
				<Text
					size="small"
					color="error"
					weight="bold"
					lineHeight={Text.sizes.small}
					style={[
						componentStyles.errorText,
						errorStyle,
					]}
				>
					{message}
				</Text>
			</View>
		);
	}

}

FormErrorMessage.propTypes = {
	errorStyle: ViewPropTypes.style,
	message: PropTypes.string,
};

FormErrorMessage.defaultProps = {
	errorStyle: {},
};

export default FormErrorMessage;

