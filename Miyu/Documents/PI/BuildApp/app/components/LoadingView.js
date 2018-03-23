'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	ActivityIndicator,
	View,
	StyleSheet,
} from 'react-native';
import helpers from '../lib/helpers';
import styles from '../lib/styles';

const componentStyles = StyleSheet.create({
	fullScreen: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
});

class LoadingView extends Component {

	constructor(props) {
		super(props);
		this.displayName = 'Loading Screen';
	}

	getStyles() {
		const compStyles = [
			{
				flex: 1,
				backgroundColor: this.props.backgroundColor || styles.colors.none,
			},
			styles.elements.centering,
		];
		if (this.props.overlay) {
			compStyles.push(componentStyles.fullScreen);
		}
		return compStyles;
	}

	renderLoadingView() {
		return (
			<ActivityIndicator
				color={helpers.isAndroid() ? styles.colors.primary : undefined}
				style={styles.elements.centering}
			/>
		);
	}

	render() {
		return (
			<View style={this.getStyles()}>
				{this.renderLoadingView()}
			</View>
		);
	}

}

LoadingView.propTypes = {
	backgroundColor: PropTypes.string,
	overlay: PropTypes.bool,
};

export default LoadingView;
