import React from 'react';
import PropTypes from 'prop-types';
import {
	requireNativeComponent,
	StyleSheet,
} from 'react-native';

let RNApplePayButton;
const componentStyles = StyleSheet.create({
	component: {
		flex: 1,
		height: 44,
	},
});

class ApplePayButton extends React.Component {
	static propTypes = {
		onPress: PropTypes.func.isRequired,
		style: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.object,
			PropTypes.array,
		]),
	};

	constructor(props) {
		super(props);
	}

	onPress = (event) => {
		this.props.onPress(event.nativeEvent);
	};

	render() {
		const {style} = this.props;

		return (
			<RNApplePayButton
				onPress={this.onPress}
				style={[componentStyles.component, style]}
			/>
		);
	}
}

RNApplePayButton = requireNativeComponent('RNApplePayButton', ApplePayButton);

export default ApplePayButton;
