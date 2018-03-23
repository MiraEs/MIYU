'use strict';
import React, {
	Component,
} from 'react';
import {
	StyleSheet,
	View,
	ViewPropTypes,
} from 'react-native';
import {
	Text,
} from 'BuildLibrary';

const componentStyles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
	},
	text: {
		flex: 1,
	},
});

class OrSeparator extends Component {

	render() {
		const { style } = this.props;

		return (
			<View style={[componentStyles.container, style]}>
				<Text
					textAlign="center"
					lineHeight={false}
					style={componentStyles.text}
				>
					OR
				</Text>
			</View>
		);
	}
}

OrSeparator.propTypes = {
	style: 	ViewPropTypes.style,
};

export default OrSeparator;
