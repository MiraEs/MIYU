import React, {
	Component,
	PropTypes,
} from 'react';
import {
	StyleSheet,
	View,
} from 'react-native';
import { TouchableOpacity } from 'BuildLibrary';
import { Text } from 'build-library';
import styles from '../lib/styles';
import Icon from 'react-native-vector-icons/Ionicons';

const componentStyles = StyleSheet.create({
	container: {
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.iOSDivider,
	},
	touchableText: {
		flex: 1,
	},
	touchableToggle: {
		padding: styles.measurements.gridSpace2,
		flexDirection: 'row',
		alignItems: 'center',
	},
	expandContainer: {
		paddingHorizontal: styles.measurements.gridSpace2,
		paddingBottom: styles.measurements.gridSpace2,
	},
});

class ExpandableListItem extends Component {

	state = {
		isCollapsed: true,
	};

	toggleState = () => {
		this.setState(({ isCollapsed }) => {
			return {
				isCollapsed: !isCollapsed,
			};
		});
	};

	renderIcon = () => {
		const icon = this.state.isCollapsed ? 'ios-arrow-down' : 'ios-arrow-up';
		return (
			<Icon
				name={icon}
				size={25}
				color={styles.colors.mediumGray}
			/>
		);
	};


	renderChildren = () => {
		if (!this.state.isCollapsed) {
			return (
				<View style={componentStyles.expandContainer}>
					{this.props.children}
				</View>
			);
		}
	};

	render() {
		return (
			<View style={componentStyles.container}>
				<TouchableOpacity
					onPress={this.toggleState}
					style={componentStyles.touchableToggle}
					trackAction={this.props.trackAction}
				>
					<Text style={componentStyles.touchableText}>{this.props.body}</Text>
					{this.renderIcon()}
				</TouchableOpacity>
				{this.renderChildren()}
			</View>
		);
	}

}

ExpandableListItem.propTypes = {
	body: PropTypes.string,
	children: PropTypes.node,
	trackAction: PropTypes.string,
};

ExpandableListItem.defaultProps = {};

export default ExpandableListItem;

