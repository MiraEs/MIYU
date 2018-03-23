import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class BannerGradient extends Component {

	render() {
		return (
			<LinearGradient
				start={{ x: 0.0, y: 0.0 }}
				end={{ x: 0.0, y: .75 }}
				colors={['#ffffff00', '#261f1730']}
				style={this.props.style}
			>
				{this.props.children}
			</LinearGradient>
		);
	}

}

BannerGradient.propTypes = {
	children: PropTypes.node,
	style: ViewPropTypes.style,
};
