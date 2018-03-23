import React, {
	Component,
} from 'react';
import {
	Animated,
	StyleSheet,
	Image,
	View,
	Easing,
} from 'react-native';
import PropTypes from 'prop-types';
import { Text } from 'build-library';
import { Button } from 'BuildLibrary';
import helpers from '../lib/helpers';
import styles from '../lib/styles';
import TrackingActions from '../lib/analytics/TrackingActions';
import NavigationBarIconButton from './navigationBar/NavigationBarIconButton';
import { navigatorPopToTop } from '../actions/NavigatorActions';

import iosImage from '../../images/iphone-mockup.png';
import androidImage from '../../images/android-mockup.png';

const componentStyles = StyleSheet.create({
	screen: {
		paddingTop: styles.measurements.gridSpace1,
		flex: 1,
	},
	content: {
		paddingHorizontal: styles.measurements.gridSpace1,
		alignItems: 'center',
		flex: 1,
	},
	imageContainer: {
		height: 234,
		width: 114,
		marginBottom: styles.measurements.gridSpace2,
		marginLeft: 76,
	},
	image: {
		position: 'absolute',
		height: 234,
		width: 114,
		top: 0,
		right: 0,
	},
	magnifier: {
		position: 'relative',
		height: 153,
		width: 153,
		right: 36,
		top: 72,
	},
	button: {
		padding: styles.measurements.gridSpace2,
		backgroundColor: styles.colors.greyLight,
	},
});

class ProRegistrationSuccessScreen extends Component {

	state = {
		scale: new Animated.Value(0),
		translateX: new Animated.Value(0),
		translateY: new Animated.Value(0),
	};

	componentDidMount() {
		const config = {
			duration: 1000,
			delay: 600,
			easing: Easing.elastic(),
			useNativeDriver: true,
		};
		Animated.parallel([
			Animated.timing(this.state.scale, {
				...config,
				toValue: 1,
			}),
			Animated.timing(this.state.translateX, {
				...config,
				toValue: -50,
			}),
			Animated.timing(this.state.translateY, {
				...config,
				toValue: 20,
			}),
		]).start();
	}

	render() {
		return (
			<View style={componentStyles.screen}>
				<View style={componentStyles.content}>
					<View style={componentStyles.imageContainer}>
						<Image
							source={helpers.isIOS() ? iosImage : androidImage}
							style={componentStyles.image}
						/>
						<Animated.Image
							source={require('../../images/pro-magnifier.png')}
							style={[componentStyles.magnifier, {
								transform: [{
									scale: this.state.scale,
								}, {
									translateX: this.state.translateX,
								}, {
									translateY: this.state.translateY,
								}],
							}]}
						/>
					</View>
					<Text
						textAlign="center"
						weight="bold"
						size="large"
					>
						Registration Successful
					</Text>
					<Text
						size="large"
						textAlign="center"
						lineHeight={Text.sizes.large}
					>
						Look for the PRO badge to ensure you're getting PRO pricing. We'll contact you within 2 business days to finish verification.
					</Text>
				</View>
				<View style={componentStyles.button}>
					<Button
						accessibilityLabel="Done Button"
						trackAction={TrackingActions.PRO_REGISTRATION_DONE}
						onPress={() => this.props.navigation.getNavigator('root').popToTop()}
					>
						<Text color="white">Done</Text>
					</Button>
				</View>
			</View>
		);
	}

}

ProRegistrationSuccessScreen.route = {
	navigationBar: {
		title: '',
		visible: true,
		renderLeft() {
			return (
				<NavigationBarIconButton
					iconName={helpers.getIcon('close')}
					onPress={() => navigatorPopToTop('root')}
					color={helpers.isIOS() ? styles.colors.greyDark : styles.colors.white}
					trackAction={TrackingActions.PRO_REGISTRATION_CLOSE}
				/>
			);
		},
	},
};

ProRegistrationSuccessScreen.propTypes = {
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
};

export default ProRegistrationSuccessScreen;

