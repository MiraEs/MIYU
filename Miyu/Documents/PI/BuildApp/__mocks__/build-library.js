/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prop-types */
import {
	createElement,
} from 'react';
import createReactClass from 'create-react-class';

module.exports = {
	Text: createReactClass({
		displayName: 'Text',
		statics: {
			sizes: {
				regular: 'regular',
				small: 'small',
			},
		},
		render() {
			return createElement('Text', this.props, this.props.children);
		},
	}),
	Switch: 'Switch',
};
