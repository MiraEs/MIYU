'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Animated,
	ViewPropTypes,
} from 'react-native';
import helpers from '../lib/helpers';
import styles from '../lib/styles';

const componentStyles = {
	iconBadgeWrap: {
		backgroundColor: styles.colors.accent,
		borderRadius: 50,
		position: 'absolute',
		overflow: 'hidden',
		justifyContent: 'center',
	},
	badgeCountStyle: {
		color: styles.colors.white,
		textAlign: 'center',
		fontFamily: styles.fonts.mainRegular,
	},
};

const duration = 400;
const badgeSizeNormal = 14;
const badgeSizeLarge = 28;

export default class IconBadge extends Component {
	constructor(props) {
		super(props);
		this.state = {
			badgeDimensions: new Animated.ValueXY(this.getBadgeSize(badgeSizeNormal, props.badgeCount)),
			fontSize: new Animated.Value(this.getTextSize(styles.fontSize.small, props.badgeCount)),
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.badgeCount !== this.props.badgeCount) {
			Animated.parallel([
				Animated.timing(
					this.state.fontSize,
					{
						toValue: this.getTextSize(styles.fontSize.large, nextProps.badgeCount),
						duration,
					}
				),
				Animated.timing(
					this.state.badgeDimensions,
					{
						toValue: this.getBadgeSize(badgeSizeLarge, nextProps.badgeCount),
						duration,
					}
				),
			]).start(() => {
				Animated.parallel([
					Animated.timing(
						this.state.fontSize,
						{
							toValue: this.getTextSize(styles.fontSize.small, nextProps.badgeCount),
							duration,
						}
					),
					Animated.timing(
						this.state.badgeDimensions,
						{
							toValue: this.getBadgeSize(badgeSizeNormal, nextProps.badgeCount),
							duration,
						}
					),
				]).start();
			});
		}
	}

	getBadgeSize(value, count) {
		const extraBadgeSize = count && count > 9 ? 7 : 0;
		return {x: (value + extraBadgeSize), y: helpers.isIOS() ? (value + extraBadgeSize) : (value + extraBadgeSize + 1)};
	}
	getTextSize(value, count) {
		const extraTextSize = count && count > 99 ? 3 : 0;
		return value - extraTextSize;
	}

	render() {
		const { isHiddenWhenNoCount, badgeCount, style } = this.props,
			badgeSize = {width: this.state.badgeDimensions.x, height: this.state.badgeDimensions.y},
			fontSize = {fontSize: this.state.fontSize};
		if (isHiddenWhenNoCount && badgeCount === 0) {
			return null;
		}
		return (
			<Animated.View style={[componentStyles.iconBadgeWrap, badgeSize, style]}>
				<Animated.Text
					allowFontScaling={false}
					style={[componentStyles.badgeCountStyle, fontSize]}
				>
					{badgeCount > 99 ? '99+' : badgeCount}
				</Animated.Text>
			</Animated.View>
		);
	}
}

IconBadge.propTypes = {
	badgeCount: PropTypes.number,
	style: PropTypes.oneOfType([
		PropTypes.object,
		ViewPropTypes.style,
	]),
	isHiddenWhenNoCount: PropTypes.bool,
};

IconBadge.defaultProps = {
	badgeCount: 0,
	isHiddenWhenNoCount: false,
};
