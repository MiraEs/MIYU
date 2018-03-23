'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import ReactNative, {
	ViewPropTypes,
} from 'react-native';
import {
	Button,
	Image,
} from 'BuildLibrary';
import styles from '../../../lib/styles';

const componentStyles = ReactNative.StyleSheet.create({
	component: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	image: {
		marginRight: styles.measurements.gridSpace1,
	},
});

class ImageButton extends Component {

	render() {
		const { source } = this.props;
		const imageStyle = !!this.props.children ? componentStyles.image : {};

		return (
			<Button {...this.props}>
				<ReactNative.View
					style={componentStyles.component}
				>
					<Image
						resizeMode="contain"
						size="none"
						source={source}
						style={imageStyle}
					/>
					{this.props.children}
				</ReactNative.View>
			</Button>
		);
	}
}

ImageButton.propTypes = {
	onPress: PropTypes.func.isRequired,
	color: PropTypes.oneOf([
		'primary',
		'white',
		'black',
	]),
	children: PropTypes.element,
	borders: PropTypes.bool,
	source: PropTypes.any.isRequired,
	style: ViewPropTypes.style,
	text: PropTypes.string,
	accessibilityLabel: PropTypes.string.isRequired,
};

ImageButton.defaultProps = {
	color: 'white',
	borders: true,
};

export default ImageButton;
