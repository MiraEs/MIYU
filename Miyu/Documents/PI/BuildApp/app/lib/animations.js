import { LayoutAnimation } from 'react-native';

module.exports = {
	fadeIn: {
		duration: 300,
		create: {
			type: LayoutAnimation.Types.easeInEaseOut,
			property: LayoutAnimation.Properties.opacity,
		},
		update: {
			type: LayoutAnimation.Types.easeInEaseOut,
			property: LayoutAnimation.Properties.opacity,
		},
	},
	spring: {
		duration: 300,
		create: {
			type: LayoutAnimation.Types.spring,
			property: LayoutAnimation.Properties.scaleXY,
		},
		update: {
			type: LayoutAnimation.Types.spring,
			property: LayoutAnimation.Properties.scaleXY,
		},
	},
};
