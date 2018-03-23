import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import ReactNative from 'react-native';
import styles from '../../../lib/styles';
import helpers from '../../../lib/helpers';
import isEqual from 'lodash.isequal';

const fontFamilies = {
	'proxima-nova-weight-normal-style-normal': styles.fonts.mainRegular,
	'proxima-nova-weight-normal-style-italic': styles.fonts.regularItalics,
	'proxima-nova-weight-bold-style-normal': styles.fonts.mainBold,
	'archer-weight-normal-style-normal': styles.fonts.archerRegular,
	'archer-weight-normal-style-italic': styles.fonts.archerItalics,
	'archer-weight-bold-style-normal': styles.fonts.archerBold,
};

class Text extends Component {

	shouldComponentUpdate(nextProps) {
		const { children } = nextProps;
		const { children: oldChildren } = this.props;
		// some things we don't want to worry about checking equality
		if (React.isValidElement(oldChildren) || React.isValidElement(children)) {
			return true;
		}
		if (this.props.onPress || nextProps.onPress) {
			return true;
		}

		// style & children are the most likely things to changes so check them first
		if (!isEqual(this.props.style, nextProps.style) || !isEqual(children, oldChildren)) {
			return true;
		}

		const {
			color,
			size,
			textAlign,
			decoration,
			weight,
			lineHeight,
			numberOfLines,
			fontStyle,
			capitalize,
			family,
			selectable,
			allowFontScaling,
		} = nextProps;
		const {
			color: oldColor,
			size: oldSize,
			textAlign: oldTextAlign,
			decoration: oldDecoration,
			weight: oldWeight,
			lineHeight: oldLineHeight,
			numberOfLines: oldNumberOfLines,
			fontStyle: oldFontStyle,
			capitalize: oldCapitalize,
			family: oldFamily,
			selectable: oldSelectable,
			allowFontScaling: oldAllowFontScaling,
		} = this.props;

		// these are in order of what I thought was most to least
		// likely to change to take advantage of JS's short circuit evaluation
		return color !== oldColor || size !== oldSize || // NOSONAR
			textAlign !== oldTextAlign || decoration !== oldDecoration ||
			weight !== oldWeight || lineHeight !== oldLineHeight ||
			numberOfLines !== oldNumberOfLines || fontStyle !== oldFontStyle ||
			capitalize !== oldCapitalize || family !== oldFamily ||
			selectable !== oldSelectable || allowFontScaling !== oldAllowFontScaling;
	}

	setNativeProps(nativeProps) {
		this.text.setNativeProps(nativeProps);
	}

	getFontFamily = () => {
		const { family, weight, fontStyle } = this.props;
		return fontFamilies[`${family}-weight-${weight}-style-${fontStyle}`];
	}

	getStyle = () => {
		const { color, size, weight, fontStyle, textAlign, decoration, style } = this.props;
		let lineHeight = null;
		if (this.props.lineHeight === true) {
			lineHeight = styles.lineHeight[size];
		} else if (Number.isInteger(this.props.lineHeight)) {
			lineHeight = this.props.lineHeight;
		}
		return [
			styles.text[weight], {
				fontStyle,
				lineHeight,
				textAlign,
				color: styles.colors[color],
				fontSize: styles.fontSize[size],
				textDecorationLine: decoration,
				fontFamily: this.getFontFamily(),
			},
			style,
		];
	}

	autoCapitalize = (children, capitalize = this.props.capitalize) => {
		if (capitalize === 'none') {
			return children;
		}
		if (React.Children.count(children) > 1) {
			return React.Children.map(children, (child) => {
				if (React.isValidElement(child)) {
					return this.autoCapitalize(child, child.props.capitalize);
				}
				if (capitalize === 'all' || child === children[0]) {
					return helpers.autoCapitalize(child, capitalize === 'all');
				}
				return child;
			});
		}
		if (React.isValidElement(children)) {
			return this.autoCapitalize(children.props.children, children.props.capitalize);
		}
		switch (capitalize) {
			case 'all':
				return helpers.autoCapitalize(children, true);
			case 'first':
				return helpers.autoCapitalize(children);
			default:
				return children;
		}
	}

	render() {
		const props = {
			...this.props,
			style: [].concat(this.props.style).concat(this.getStyle()),
		};
		return (
			<ReactNative.Text
				{...props}
				ref={(ref) => this.text = ref}
			>
				{this.autoCapitalize(this.props.children)}
			</ReactNative.Text>
		);
	}

}

// add any new props to shouldComponentUpdate
Text.propTypes = {
	capitalize: PropTypes.oneOf([
		'none',
		'first',
		'all',
	]),
	children: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.string,
		PropTypes.element,
		PropTypes.number,
	]).isRequired,
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
	]).isRequired,
	family: PropTypes.oneOf([
		'archer',
		'proxima-nova',
	]).isRequired,
	fontStyle: PropTypes.oneOf([
		'normal',
		'italic',
	]).isRequired,
	onPress: PropTypes.func,
	selectable: PropTypes.bool,
	size: PropTypes.oneOf([
		'xsmall',
		'small',
		'regular',
		'large',
		'larger',
		'xlarge',
	]).isRequired,
	style: ReactNative.Text.propTypes.style,
	numberOfLines: PropTypes.number,
	textAlign: PropTypes.oneOf([
		'auto',
		'left',
		'right',
		'center',
		'justify',
	]).isRequired,
	decoration: PropTypes.oneOf([
		'none',
		'underline',
		'line-through',
		'underline line-through',
	]).isRequired,
	weight: PropTypes.oneOf([
		'normal',
		'bold',
	]).isRequired,
	lineHeight: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.bool,
	]),
	allowFontScaling: PropTypes.bool,
};

Text.defaultProps = {
	capitalize: 'none',
	children: '',
	color: 'secondary',
	fontStyle: 'normal',
	family: 'proxima-nova',
	selectable: false,
	size: 'regular',
	textAlign: 'auto',
	decoration: 'none',
	weight: 'normal',
	lineHeight: true,
	style: [],
	allowFontScaling: false,
};

export default Text;
