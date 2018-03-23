import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

class QuillUnorderedListItem extends PureComponent {
	static propTypes = {
		children: PropTypes.node,
		listIndent: PropTypes.number,
		textColor: PropTypes.string,
	};

	getStyle = () => {
		return {
			color: this.props.textColor,
			marginLeft: this.props.listIndent,
		};
	};

	render() {
		return (
			<Text style={this.getStyle()}>• {this.props.children}</Text>
		);
	}
}

export default QuillUnorderedListItem;
