'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native';
import styles from '../lib/styles';


class WebViewComponent extends Component {

	render() {
		return (
			<WebView
				automaticallyAdjustContentInsets={false}
				scalesPageToFit={true}
				startInLoadingState={true}
				style={styles.elements.screenWithHeader}
				url={this.props.url}
			/>
		);
	}

}

WebViewComponent.propTypes = {
	url: PropTypes.string.isRequired,
};

module.exports = WebViewComponent;
