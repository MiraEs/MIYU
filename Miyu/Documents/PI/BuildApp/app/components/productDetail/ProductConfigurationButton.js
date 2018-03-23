import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { Text } from 'build-library';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../../lib/styles';
import TrackingActions from '../../lib/analytics/TrackingActions';

const componentStyles = StyleSheet.create({
	button: {
		backgroundColor: styles.colors.white,
		padding: styles.measurements.gridSpace1,
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
		marginHorizontal: styles.measurements.gridSpace1,
		marginTop: styles.measurements.gridSpace1,
	},
	divider: {
		height: 1,
		backgroundColor: styles.colors.grey,
		marginVertical: styles.measurements.gridSpace1,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
	},
});

class ProductConfigurationButton extends Component {

	render() {
		return (
			<TouchableOpacity
				onPress={this.props.onPress}
				style={componentStyles.button}
				trackAction={TrackingActions.PDP_VARIATION}
			>
				<View style={componentStyles.row}>
					<Text style={styles.elements.flex1}>{this.props.label}</Text>
					<Icon
						name="ios-arrow-forward"
						size={28}
						color={styles.colors.grey}
					/>
				</View>
				<View style={componentStyles.divider} />
				{this.props.options.map((option, index) => {
					return <Text key={index}>{option.name}: <Text weight="bold">{option.value}</Text></Text>;
				})}
			</TouchableOpacity>

		);
	}

}

ProductConfigurationButton.propTypes = {
	onPress: PropTypes.func,
	label: PropTypes.string,
	options: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string,
		value: PropTypes.string,
	})),
};

export default ProductConfigurationButton;

