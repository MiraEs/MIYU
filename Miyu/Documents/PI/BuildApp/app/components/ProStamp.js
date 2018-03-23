import React, {
	Component,
} from 'react';
import {
	StyleSheet,
	View,
} from 'react-native';
import styles from '../lib/styles';
import { Text } from 'BuildLibrary';

const componentStyles = StyleSheet.create({
	proLogoBlock: {
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: styles.colors.accent,
		borderWidth: styles.dimensions.borderWidthLarge,
		paddingLeft: 2,
		paddingRight: 1,
	},
	proLogoContainer: {
		marginLeft: styles.measurements.gridSpace1,
		justifyContent: 'center',
	},
});

export default class ProStamp extends Component {

	render() {
		return (
			<View style={componentStyles.proLogoContainer}>
				<View style={componentStyles.proLogoBlock}>
					<Text
						size="small"
						color="accent"
						weight="bold"
						lineHeight={false}
						family="archer"
					>
						PRO
					</Text>
				</View>
			</View>
		);
	}

}
