'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
import styles from '../../lib/styles';
import Icon from 'react-native-vector-icons/Ionicons';

const componentStyles = StyleSheet.create({
	action: {
		height: 48,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		borderTopWidth: styles.dimensions.borderWidth,
		borderTopColor: styles.colors.greyLight,
	},
	actionText: {
		textAlign: 'center',
		color: styles.colors.primary,
		fontFamily: styles.fonts.mainRegular,
		fontSize: styles.fontSize.regular,
	},
	headingContainer: {
		padding: styles.measurements.gridSpace2,
	},
	actionHeading: {
		color: styles.colors.secondary,
	},
	actionIcon: {

		marginRight: styles.measurements.gridSpace2,
	},
	eventContainer: {
		padding: styles.measurements.gridSpace1,
		paddingBottom: 0,
		alignItems: 'stretch',
		justifyContent: 'center',
	},
	icon: {
		height:35,
		width: 35,
		alignSelf: 'center',
		marginBottom: styles.measurements.gridSpace1,
	},
	heading: {
		textAlign: 'center',
		fontSize: styles.fonts.regular,
		paddingBottom: styles.measurements.gridSpace1,
		fontFamily: styles.fonts.mainRegular,
	},
	message: {
		fontSize: styles.fontSize.regular,
		textAlign: 'center',
		fontFamily: styles.fonts.mainRegular,
		paddingBottom: styles.measurements.gridSpace1,
	},
});

export default class Onboarding extends Component {

	renderActions = (actions) => {
		actions = actions || [];
		return actions.map((action, index) => {
			return (
				<TouchableOpacity
					key={`onboarding-action-${index}`}
					onPress={action.onPress}
					style={componentStyles.action}
				>
					<Icon
						name={action.icon}
						size={22}
						color={styles.colors.primary}
						style={componentStyles.actionIcon}
					/>
					<Text style={componentStyles.actionText}>{action.text}</Text>
				</TouchableOpacity>
			);
		});
	};

	render() {
		const { event } = this.props;

		if (event.actions) {
			return (
				<View style={[styles.feedEvents.section, componentStyles.eventContainer]}>
					<View style={componentStyles.headingContainer}>
						<Text style={[componentStyles.heading, componentStyles.actionHeading]}>{event.heading}</Text>
					</View>
					{this.renderActions(event.actions)}
				</View>
			);
		} else {
			return (
				<View style={[styles.feedEvents.section, componentStyles.eventContainer]}>
					<Icon
						name={event.icon}
						size={40}
						color="#353535"
						style={componentStyles.icon}
					/>
					<Text style={componentStyles.heading}>{event.heading}</Text>
					<Text style={componentStyles.message}>{event.message}</Text>
				</View>
			);
		}
	}

}

Onboarding.propTypes = {
	event: PropTypes.shape({
		heading: PropTypes.string.isRequired,
		message: PropTypes.string,
		icon: PropTypes.string,
	}),
};
