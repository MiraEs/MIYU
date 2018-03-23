import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
	Text,
} from 'react-native';

class QuillHeading extends PureComponent {
	static propTypes = {
		heading1Size: PropTypes.number,
		heading2Size: PropTypes.number,
		heading3Size: PropTypes.number,
		heading4Size: PropTypes.number,
		heading5Size: PropTypes.number,
		heading6Size: PropTypes.number,
		header: PropTypes.number,
		children: PropTypes.node,
		textColor: PropTypes.string,
	};

	getStyle = () => {
		const style = {
			fontWeight: 'bold',
			color: this.props.textColor,
		};
		const { header } = this.props;
		if (header) {
			style.fontSize = this.props[`heading${header}Size`];
		}
		return style;
	};

	render() {
		return (
				<Text style={this.getStyle()}>
					{this.props.children}
				</Text>
		);
	}
}

export default QuillHeading;
