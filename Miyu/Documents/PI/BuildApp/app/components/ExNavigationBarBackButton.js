/**
 * This component is basically a copy of the back button provided automatically by ex-navigation
 * They expose it from the library but don't make the onPress function override-able which makes
 * it useless for the case here. Hopefully once we move over to React Navigation we can remove this
 * and they will have a good solution for adding functionality to pressing the back button.
 */

import React, {
	PureComponent,
} from 'react';
import {
	Image,
	Platform,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { withNavigation } from '@expo/ex-navigation';

const BACK_BUTTON_HIT_SLOP = { top: 0, bottom: 0, left: 0, right: 30 };

const backIcon = {
	uri: Platform.select({
		ios: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAACBCAYAAABuFIx8AAAAAXNSR0IArs4c6QAAA6ZJREFUeAHt3LmO1DAYAODfI6Cmo0LiGRAdDQ1UUAHvgHiFpUix21MBb0ADHd02lBR0PAAgRIFotl4KY88oc+zksB0f/2VpJlEmv518Y0s5bANITZ29ASf2LXT2TgrBKiWIfIxH+wcfwMILt/ycgmfII8SewA7tyTbUwE+4Dg+gMz+222ZWZMENofVAkXhy4KbQEvBkwIWgReLxh4tBi8DjDZeCFojHF24JWgAeT7gcaDN4/OByok3g8YIrgTaCxweuJNo+HsB9ODO/edyr1kDb4H1zt2Z//Sr9GlcLzcAnh/bU3c9e0odrhEYbriEaXbjGaDThEKDRg0OCRgsOERodOGRoNOAQouGHQ4qGGw4xGl445Gg44Qig4YMjgoYLjhAaHjhiaDjgCKK1hyOK1haOMFo7OOJobeA2aB9dp77H/gCKpSvvCHKXU/dlDRM0/yfUg2OEVg+OGVodOIZo5eGYopWFY4xWDo45Whk4AWj54YSg5YUThJYPThhaHjiBaMvhhKItgxOMlg4nHC0NTtG8W+RjJUVbo8XBKdoWLRxO0Q7QwuAU7QhtHk7RBtGm4RRtFG0cTtEm0YbhFG0W7RhO0YLQDuEULRhtB6doUWgbOEWLRvMB1+AS3rsl6Q4wSWe+MMgPLf+yMI/pcAO/4BY860cWT+9M59eVez7yqOjhWrgNf+A1WFuvg0/RE9pkvnLjzJ87vK9Fy/IT3L2CN5zwNrWgszfdzH3nrrPfvaKABt7BKbwEY2zRcipkvms+ihfFvYPzYYoXjHcIp3gL4BQvCO+4xvVh2mx7icHlOJzfXfEG0fzGaTi/h+J5haM0D+dDFC8RTvEWwCneAV5YU90P0Wa71oiH05q3AE7xAi5H1r4jX4KbbVpT3XcUirccTmizzQMnEC8fnDC8vHCC8PLDCcErAycArxwcc7yycIzxysMxxasDxxCvHhwzvLpwjPDqwzHBawPHAK8dHHG8tnCE8drDEcXDAUcQDw8cMTxccITw8MERwcMJRwAPLxxyPNxwiPHwwyHFowGHEI8OHDI8WnCI8OjBIcGjCYcAjy5cYzzacA3x6MM1wuMBVwvPwIXr/HsXTs13P5kBj9SZCzdM/mGxYfIeDVz+Ds2D8alx/d9fok9yj3ZmtnMX8IPzgDnxBtB8ETzhcuGNoPGGW4o3gcYfLhVvBk0GXCxeAJocuFC8QDRZcHN4EWjy4MbwItFkwl3FS0DzWchN/iL5xJ67T9JEXP8BBzR5KHiXJWIAAAAASUVORK5CYII=',
		android: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAQAAAD/5HvMAAAAbklEQVR4Ae3ZxQHDMAxAUZ197sBasQu1gXuoaHhfC7ygAyFJktYysi7Oc56si7OS6uKspLo4z7hHqYtzw8HBwemNg4ODg/OtqY3zfIkD9FdSVEZq5bJvn4SEhISEhISEVHw43yGlny9Hv6ckSdIEb5dSW8V5J5sAAAAASUVORK5CYII=',
	}),
};

const buttonStyles = StyleSheet.create({
	buttonContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 44,
		minWidth: 44,
	},
	button: {
		resizeMode: 'contain',
		...Platform.select({
			ios: {
				height: 21,
				width: 13,
				marginLeft: 8,
				marginRight: 6,
			},
			android: {
				height: 24,
				width: 24,
				margin: 16,
			},
		}),
	},
});

class ExNavigationBarBackButton extends PureComponent {

	static propTypes = {
		tintColor: PropTypes.string,
		navigator: PropTypes.object,
		onPress: PropTypes.func,
		style: PropTypes.number,
	};

	onPressButton = () => {
		if (typeof this.props.onPress === 'function') {
			this.props.onPress();
		}
		this.props.navigator.pop();
	};

	render() {
		const { style, tintColor } = this.props;

		return (
			<TouchableOpacity
				onPress={this.onPressButton}
				hitSlop={BACK_BUTTON_HIT_SLOP}
				style={style || buttonStyles.buttonContainer}
			>
				<Image
					style={[buttonStyles.button, tintColor ? { tintColor } : null]}
					source={backIcon}
				/>
			</TouchableOpacity>
		);
	}
}

export default withNavigation(ExNavigationBarBackButton);
