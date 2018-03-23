import React, {
	Component,
} from 'react';

import PropTypes from 'prop-types';
import {
	StyleSheet,
	ViewPropTypes,
} from 'react-native';
import { connect } from 'react-redux';
import { Image } from 'BuildLibrary';
import { Device } from 'BuildNative';

const componentStyles = StyleSheet.create({
	icon: {
		position: 'absolute',
		top: 0,
		left: 0,
	},
});

export class ArIcon extends Component {

	render() {
		if (this.props.isArProduct && Device.isArKitEnabled()) {
			return (
				<Image
					style={this.props.style || componentStyles.icon}
					source={require('../images/AR_Icon.png')}
				/>
			);
		} else {
			return null;
		}
	}

}

ArIcon.propTypes = {
	isArProduct: PropTypes.bool,
	compositeId: PropTypes.number.isRequired,
	style: ViewPropTypes.style,
};

export default connect((state, ownProps) => ({isArProduct: state.productDetailReducer.arProducts.includes(ownProps.compositeId)}))(ArIcon);
