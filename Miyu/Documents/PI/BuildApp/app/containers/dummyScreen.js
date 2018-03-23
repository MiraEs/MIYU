'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	StyleSheet,
} from 'react-native';
import styles from '../lib/styles';
import {connect} from 'react-redux';

const componentStyles = StyleSheet.create({
	myDummyView: {
		alignItems: 'center',
	},
});

class DummyScreen extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={[styles.elements.screenWithHeader, componentStyles.myDummyView]}>
				<Text>{this.props.text}</Text>
			</View>
		);
	}
}

DummyScreen.propTypes = {
	text: PropTypes.string,
};

export default connect()(DummyScreen);
