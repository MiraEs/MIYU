import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

class QuillOrderedListItem extends PureComponent {
	static propTypes = {
		number: PropTypes.number,
		textColor: PropTypes.string,
		listIndent: PropTypes.number,
		children: PropTypes.node,
	};

	getStyle = () => {
		return {
			color: this.props.textColor,
			marginLeft: this.props.listIndent,
		};
	};

	render() {
		return (
			<Text style={this.getStyle()}>{this.props.number}. {this.props.children}</Text>
		);
	}
}

export default QuillOrderedListItem;
