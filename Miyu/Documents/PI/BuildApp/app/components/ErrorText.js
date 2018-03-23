'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import ReactNative from 'react-native';
import {
	Text,
} from 'BuildLibrary';

class ErrorText extends Component {
	render() {
		const { style, text } = this.props;

		if (!text) {
			return null;
		}

		return (
			<Text
				color="error"
				size="small"
				style={style}
			>
				{text}
			</Text>
		);
	}
}

ErrorText.propTypes = {
	text: PropTypes.string,
	style: ReactNative.Text.propTypes.style,
};

ErrorText.defaultProps = {
	text: '',
};

export default ErrorText;
