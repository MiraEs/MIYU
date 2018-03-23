import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import Spacer from 'react-native-keyboard-spacer';

export class KeyboardSpacer extends Component {

	render() {
		return <Spacer topSpacing={this.props.topSpacing} />;
	}

}

KeyboardSpacer.propTypes = {
	topSpacing: PropTypes.number,
};

KeyboardSpacer.defaultProps = {
	topSpacing: 0,
};

export default KeyboardSpacer;
