import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import ReactNative, {
	StyleSheet,
} from 'react-native';


const defaults = {
	weight: 'normal',
	size: 'regular',
	color: 'secondary',
	family: 'proxima-nova',
	fontStyle: 'normal',
	textAlign: 'auto',
};

const fontWeights = {
	normal: '400',
	bold: '700',
};

const fontSizes = {
	xsmall: 11,
	small: 13,
	regular: 16,
	large: 19,
	larger: 22,
	xlarge: 32,
};

const lineHeights = {
	xsmall: 14,
	small: 21,
	regular: 21,
	large: 28,
	larger: 28,
	xlarge: 40,
};

const colors = {
	primary: '#00A499',
	primaryDark: '#018F85',
	primaryLight: '#CCEEEC',
	secondary: '#63666A',
	grey: '#D0D3D4',
	greyLight: '#EBEDEF',
	greyDark: '#B1B2B4',
	accent: '#D45D00',
	error: '#A94442',
	white: '#FFFFFF',
};

const fontFamilies = {
	'proxima-nova-normal-normal': 'ProximaNova-Regular',
	'proxima-nova-normal-italic': 'ProximaNova-RegularIt',
	'proxima-nova-bold-normal': 'ProximaNova-Bold',
	'archer-normal-normal': 'Archer-Medium',
	'archer-normal-italic': 'Archer-MediumItalic',
	'archer-bold-normal': 'Archer-Bold',
};

class Text extends Component {

	getPropValueByName(propName) {
		const { parentProps } = this.props;
		if (this.props[propName]) {
			return this.props[propName];
		}
		if (parentProps && parentProps[propName]) {
			return parentProps[propName];
		}
		return defaults[propName];
	}

	getStyleProp(propType, propName) {
		const { parentProps } = this.props;
		if (this.props[propName]) {
			return propType[this.props[propName]];
		}
		if (parentProps && parentProps[propName]) {
			return propType[parentProps[propName]];
		}
		return propType[defaults[propName]];
	}

	/**
	 * Get the font family and warn dev if it doesn't have a match
	 */
	getFontFamily() {
		const family = this.getPropValueByName('family');
		const weight = this.getPropValueByName('weight');
		const fontStyle = this.getPropValueByName('fontStyle');
		if (__DEV__ && (!family || !weight || !fontStyle)) {
			console.warn('Was missing either a family, weight, or fontStyle prop. These are required to get the font family.');
		}
		const key = `${family}-${weight}-${fontStyle}`;
		const fontFamily = fontFamilies[key];
		if (__DEV__ && !fontFamily) {
			console.warn(`No font family was found for key ${key}`);
		}
		return fontFamily;
	}

	/**
	 * Get the base styles for <Text />
	 */
	getStyles() {
		return {
			fontWeight: this.getStyleProp(fontWeights, 'weight'),
			fontSize: this.getStyleProp(fontSizes, 'size'),
			lineHeight: this.props.lineHeight || this.getStyleProp(lineHeights, 'size'),
			color: this.getStyleProp(colors, 'color'),
			fontFamily: this.getFontFamily(),
			textAlign: this.props.textAlign,
			textDecorationLine: this.props.decoration,
		};
	}

	render() {
		/**
		 * Clone the children so we can pass in the parentProps to that child.
		 * This is needed so we can properly "cascade" style props through to lower
		 * Text children.
		 */
		const children = React.Children.map(this.props.children, (child) => {
			if (!React.isValidElement(child)) {
				return child;
			}
			return React.cloneElement(child, {
				parentProps: {
					...(this.props.parentProps || {}),
					...this.props,
				},
			});
		});

		return (
			<ReactNative.Text
				{...this.props}
				style={[this.getStyles(), this.props.style]}
				parentProps={this.props}
			>
				{children}
			</ReactNative.Text>
		);
	}

}

Text.weights = fontWeights;
Text.sizes = fontSizes;
Text.lineHeights = lineHeights;
Text.colors = colors;

Text.defaultProps = {
	allowFontScaling: false,
};

Text.propTypes = {
	children: PropTypes.node,
	color: PropTypes.oneOf([
		'primary',
		'primaryDark',
		'primaryLight',
		'secondary',
		'grey',
		'greyLight',
		'greyDark',
		'accent',
		'error',
		'white',
	]),
	family: PropTypes.oneOf([
		'archer',
		'proxima-nova',
	]),
	fontStyle: PropTypes.oneOf([
		'normal',
		'italic',
	]),
	size: PropTypes.oneOf([
		'xsmall',
		'small',
		'regular',
		'large',
		'larger',
		'xlarge',
	]),
	decoration: PropTypes.oneOf([
		'none',
		'underline',
		'line-through',
		'underline line-through',
	]),
	weight: PropTypes.oneOf([
		'normal',
		'bold',
	]),
	lineHeight: PropTypes.number,
	style: ReactNative.Text.propTypes.style,
};

export default Text;
