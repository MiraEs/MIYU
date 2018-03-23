import React, {
	PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	ViewPropTypes,
} from 'react-native';
import { Text } from 'BuildLibrary';

const componentStyles = StyleSheet.create({
	default: {
		backgroundColor: 'transparent',
	},
	shadow: {
		textShadowColor: '#00000080',
		textShadowRadius: 3,
		textShadowOffset: {
			width: 1,
			height: 1,
		},
	},
});

export default class AtomText extends PureComponent {

	getStyle = () => {
		const { shadow, style } = this.props;
		const styles = [ style ];
		if (shadow) {
			styles.push(componentStyles.shadow);
		}
		return styles;
	};

	render() {
		if (this.props.text && this.props.text.length) {
			return (
				<Text
					{...this.props}
					style={this.getStyle()}
				>
					{this.props.text}
				</Text>
			);
		}
		return null;
	}

}

AtomText.propTypes = {
	shadow: PropTypes.bool,
	style: ViewPropTypes.style,
	text: PropTypes.string.isRequired,
};

AtomText.defaultProps = {
	style: componentStyles.default,
};
