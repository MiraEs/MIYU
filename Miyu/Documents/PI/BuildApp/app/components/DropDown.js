import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	TouchableHighlight,
	View,
	StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../lib/styles';
import { Text } from 'BuildLibrary';

const componentStyles = StyleSheet.create({
	button: {
		marginHorizontal: styles.measurements.gridSpace2,
		marginVertical: styles.measurements.gridSpace1,
		padding: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
	},
	buttonText: {
		fontFamily: styles.fonts.mainRegular,
		fontSize: styles.fontSize.regular,
		lineHeight: styles.lineHeight.regular,
		color: styles.colors.secondary,
		textAlign: 'left',
		flex: 1,
		marginLeft: styles.measurements.gridSpace1,
	},
	icon: {
		alignSelf: 'flex-end',
		marginRight: styles.measurements.gridSpace1,
	},
	row: {
		flexDirection: 'row',
	},
});

export default class DropDown extends Component {

	renderIcon = (icon, style) => {
		if (icon !== 'none') {
			return (
				<Icon
					name={icon}
					size={25}
					color={styles.colors.mediumGray}
					style={style}
				/>
			);
		}
	};

	renderText = () => {
		const { text, placeholder } = this.props;

		if (text) {
			return text;
		}

		return (
			<Text weight="bold">
				{placeholder}
			</Text>
		);
	};

	render() {
		const { onPress, buttonStyle } = this.props;
		return (
			<TouchableHighlight
				onPress={onPress}
				underlayColor="rgba(0, 0, 0, 0.05)"
				style={[componentStyles.button, buttonStyle]}
				accessibilityLabel={this.props.accessibilityLabel}
			>
				<View style={componentStyles.row}>
					<Text style={componentStyles.buttonText}>
						{this.renderText()}
					</Text>
					<Icon
						name={'ios-arrow-down'}
						size={25}
						color={styles.colors.mediumGray}
						style={componentStyles.icon}
					/>
				</View>
			</TouchableHighlight>
		);
	}

}

DropDown.propTypes = {
	buttonStyle: TouchableHighlight.propTypes.style,
	text: PropTypes.string,
	placeholder: PropTypes.string,
	onPress: PropTypes.func,
	accessibilityLabel: PropTypes.string.isRequired,
};

DropDown.defaultProps = {};
