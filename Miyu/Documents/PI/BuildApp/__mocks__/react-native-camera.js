import {
	createElement,
	Component,
} from 'react';
import PropTypes from 'prop-types';

class Camera extends Component {
	static constants = {
		Aspect: {},
		CaptureTarget: {},
		Type: {
			back: 'back',
			front: 'front',
		},
	};
	static propTypes = {
		children: PropTypes.any,
	};
	constructor() {
		super();
		this.capture = jest.fn(() => ({
			then: jest.fn(),
		}));
	}

	render() {
		return createElement('Camera', this.props, this.props.children);
	}
}

module.exports = Camera;
