'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	ViewPropTypes,
} from 'react-native';

class Round extends Component {

	getStyle = () => {
		const { backgroundColor, diameter } = this.props;
		return {
			backgroundColor,
			width: diameter,
			height: diameter,
			alignItems: 'center',
			justifyContent: 'center',
			borderRadius: diameter / 2,
		};
	};

	render() {
		return (
			<View style={[this.getStyle(), this.props.style]}>
				{this.props.children}
			</View>
		);
	}
}

Round.propTypes = {
	children: PropTypes.node,
	backgroundColor: PropTypes.string.isRequired,
	diameter: PropTypes.number.isRequired,
	style: ViewPropTypes.style,
};

export default Round;
