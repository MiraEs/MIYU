'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	TouchableOpacity,
	ViewPropTypes,
} from 'react-native';
import { Text } from 'BuildLibrary';
import styles from '../../../lib/styles';
import helpers from '../../../lib/helpers';
import store from '../../../store/configStore';
import { trackAction } from '../../../actions/AnalyticsActions';

class LinkButton extends Component {

	getTextProps = () => {
		return {
			color: 'primary',
			lineHeight: this.props.lineHeight,
			textAlign: this.props.textAlign,
			size: this.props.size,
		};
	};

	renderChildren = () => {
		const { children, wrapChildren } = this.props;

		if (wrapChildren) {
			return <Text {...this.getTextProps()}>{children}</Text>;
		}

		return children;
	};

	render() {
		const { onPress, style, analyticsData } = this.props;
		return (
			<TouchableOpacity
				onPress={() => {
					onPress();
					if (analyticsData) {
						store.dispatch(trackAction(analyticsData.trackName, analyticsData.trackData));
					}
				}}
				hitSlop={{
					top: styles.measurements.gridSpace1,
					right: styles.measurements.gridSpace1,
					bottom: styles.measurements.gridSpace1,
					left: styles.measurements.gridSpace1,
				}}
				style={style}
			>
				{this.renderChildren()}
			</TouchableOpacity>
		);
	}

}

LinkButton.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element,
		PropTypes.array,
	]).isRequired,
	onPress: PropTypes.func,
	lineHeight: PropTypes.bool,
	textAlign: PropTypes.oneOf([
		'auto',
		'left',
		'right',
		'center',
		'justify',
	]),
	size: PropTypes.string,
	style: ViewPropTypes.style,
	wrapChildren: PropTypes.bool,
	analyticsData: PropTypes.shape({
		trackName: PropTypes.string.isRequired,
		trackData: PropTypes.object,
	}),
};

LinkButton.defaultProps = {
	onPress: helpers.noop,
	wrapChildren: true,
};

export default LinkButton;
