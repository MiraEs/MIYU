import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
	Platform,
} from 'react-native';
import styles from '../../lib/styles';
import { Text } from 'build-library';
import helpers from '../../lib/helpers';

const componentStyles = StyleSheet.create({
	headerSubContainer: {
		paddingBottom: styles.measurements.gridSpace1,
	},
	header: {
		alignItems: 'center',
		marginHorizontal: styles.dimensions.tapSizeMedium,
		...Platform.select({
			ios: {
				paddingTop: styles.measurements.gridSpace1 / 2,
			},
			android: {
				paddingTop: styles.measurements.gridSpace1,
			},
		}),
	},
});

class NavigationBarTitle extends Component {
	render() {
		return (
			<View>
				<View style={componentStyles.header}>
					<Text
						weight="bold"
						color={helpers.isIOS() ? 'secondary' : 'white'}
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						{this.props.title}
					</Text>
				</View>
				<View
					style={componentStyles.headerSubContainer}
				>
					<Text
						size="small"
						lineHeight={Text.sizes.small}
						color="grey"
						textAlign="center"
					>
						{this.props.subTitle}
					</Text>
				</View>
			</View>
		);
	}
}

NavigationBarTitle.propTypes = {
	subTitle: PropTypes.string,
	title: PropTypes.string,
};

export default NavigationBarTitle;
