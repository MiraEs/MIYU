import React, {
	PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	ViewPropTypes,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const componentStyles = StyleSheet.create({
	icon: {
		height: 30,
		marginTop: 5,
	},
});

class TabBarIcon extends PureComponent {

	render() {
		return (
			<View
				style={[componentStyles.icon, {
					top: this.props.topOffset || 0,
				}]}
			>
				<Icon
					size={this.props.size}
					color={this.props.color}
					name={this.props.name}
				/>
			</View>
		);
	}

}

TabBarIcon.propTypes = {
	name: PropTypes.string,
	size: PropTypes.number,
	color: PropTypes.string,
	style: ViewPropTypes.style,
	topOffset: PropTypes.number,
};

export default TabBarIcon;
