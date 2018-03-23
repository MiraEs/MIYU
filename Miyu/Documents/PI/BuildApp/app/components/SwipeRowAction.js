import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import { Text } from 'BuildLibrary';
import Icon from 'react-native-vector-icons/Ionicons';
import { trackAction } from '../actions/AnalyticsActions';
import store from '../store/configStore';

const componentStyles = StyleSheet.create({
	mainWrapper: {
		flex: 1,
		justifyContent: 'center',
	},
	innerWrapper: {
		width: 75,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default class SwipeRowAction extends Component {
	constructor(props) {
		super(props);
	}

	getContainerStyle = () => {
		const { backgroundColor } = this.props;
		return [componentStyles.mainWrapper, { backgroundColor }];
	};

	render() {
		const { analyticsData, onPress, text, iconName } = this.props;
		return (
			<TouchableOpacity
				onPress={() => {
					store.dispatch(trackAction(analyticsData.trackName, analyticsData.trackData));
					onPress && onPress();
				}}
				style={this.getContainerStyle()}
				accessibilityLabel={text}
			>
				<View style={componentStyles.innerWrapper}>
					<Icon
						color={styles.colors.white}
						name={helpers.getIcon(iconName)}
						size={30}
					/>
					<Text
						textAlign="center"
						color="white"
					>
						{text}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

SwipeRowAction.propTypes = {
	backgroundColor: PropTypes.string,
	iconName: PropTypes.string,
	onPress: PropTypes.func,
	text: PropTypes.string,
	analyticsData: PropTypes.shape({
		trackName: PropTypes.string.isRequired,
		trackData: PropTypes.object,
	}).isRequired,
};

SwipeRowAction.defaultProps = {
	backgroundColor: styles.colors.primary,
};
