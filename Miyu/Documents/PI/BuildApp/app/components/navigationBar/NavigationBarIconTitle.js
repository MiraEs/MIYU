'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from 'build-library';
import helpers from '../../lib/helpers';
import styles from '../../lib/styles';

const componentStyles = StyleSheet.create({
	title: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: helpers.isIOS() ? 'center' : 'flex-start',
		alignItems: 'center',
		marginTop: helpers.isAndroid() ? 6 : 0,
	},
	icon: {
		marginRight: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace1,
	},
});

class NavigationBarIconTitle extends Component {

	getColor = () => {
		const { color } = this.props;

		return {
			color: styles.colors[color],
		};
	};

	render() {
		const { color, iconName } = this.props;

		return (
			<View
				style={componentStyles.title}
			>
				<Icon
					style={componentStyles.icon}
					name={helpers.getIcon(iconName)}
					color={styles.colors[color]}
					size={27}
				/>
				<Text
					style={[styles.elements.navigationBarTitle, this.getColor()]}
				>
					{this.props.children}
				</Text>
			</View>
		);
	}

}

NavigationBarIconTitle.propTypes = {
	children: PropTypes.node,
	color: PropTypes.oneOf([
		'greyLight',
		'greyDark',
		'secondary',
	]),
	iconName: PropTypes.string,
};

NavigationBarIconTitle.defaultProps = {
	color: 'greyLight',
	iconName: 'lock',
};

export default NavigationBarIconTitle;
