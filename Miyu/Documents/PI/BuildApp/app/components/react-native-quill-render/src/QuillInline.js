import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

class QuillInline extends Component {
	static propTypes = {
		italic: PropTypes.bool,
		textColor: PropTypes.string,
		link: PropTypes.object,
		linkColor: PropTypes.string,
		children: PropTypes.node,
		onLinkPress: PropTypes.func,
	};

	handleLinkPress = () => {
		if (typeof this.props.onLinkPress === 'function') {
			this.props.onLinkPress(this.props.link);
		}
	};

	getStyle = () => {
		const style = {
			color: this.props.textColor,
		};
		if (this.props.italic) {
			style.fontStyle = 'italic';
		}
		if (this.props.link) {
			style.color = this.props.linkColor;
			style.textDecorationLine = 'underline';
		}
		return style;
	};

	render() {
		const { children } = this.props;
		const style = this.getStyle();
		const props = {
			style,
		};
		if (this.props.link) {
			props.onPress = this.handleLinkPress;
		}
		return <Text {...props}>{children}</Text>;
	};
}

export default QuillInline;
