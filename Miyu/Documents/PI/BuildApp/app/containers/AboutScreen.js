import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Image,
	StyleSheet,
} from 'react-native';
import { Device } from 'BuildNative';
import {
	LinkButton,
	ScrollView,
	Text,
	withScreen,
} from 'BuildLibrary';
import styles from '../lib/styles';
import EventEmitter from '../lib/eventEmitter';
import PhoneHelper from '../lib/PhoneHelper';

const componentStyles = StyleSheet.create({
	container: {
		padding: styles.measurements.gridSpace1,
	},
	logo: {
		marginBottom: styles.measurements.gridSpace2,
		alignSelf: 'center',
		height: 100,
		width: 200,
	},
	topTextContainer: {
		alignItems: 'center',
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.grey,
		paddingBottom: styles.measurements.gridSpace3,
	},
	middleTextContainer: {
		paddingTop: styles.measurements.gridSpace3,
	},
	bottomTextContainer: {
		paddingTop: styles.measurements.gridSpace3,
		paddingBottom: styles.measurements.gridSpace3,
	},
	versionContainer: {
		paddingTop: styles.measurements.gridSpace3,
		paddingBottom: styles.measurements.gridSpace3,
		alignItems: 'center',
	},
	versionText: {
		width: 100,
		marginRight: styles.measurements.gridSpace1,
	},
	row: {
		flexDirection: 'row',
	},
	sitesContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderTopWidth: styles.dimensions.borderWidth,
		borderTopColor: styles.colors.grey,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.grey,
		marginHorizontal: styles.measurements.gridSpace1,
	},
	siteImage: {
		width: 140,
		height: 50,
	},
	spacer: {
		height: styles.measurements.gridSpace1,
	},
});

export class AboutScreen extends Component {

	setScreenTrackingInformation() {
		return {
			name: 'build:app:more:about',
		};
	}
	render() {
		const phone = PhoneHelper.getGeneralPhoneNumber();

		return (
			<ScrollView
				style={[styles.elements.screenWithHeader, componentStyles.container]}
				scrollsToTop={true}
			>
				<Image
					resizeMode="contain"
					style={componentStyles.logo}
					source={require('../images/network_images/build_com_network.png')}
				/>
				<View style={componentStyles.sitesContainer}>
					<View>
						<Image
							resizeMode="contain"
							style={componentStyles.siteImage}
							source={require('../images/network_images/fd.jpg')}
						/>
						<Image
							resizeMode="contain"
							style={componentStyles.siteImage}
							source={require('../images/network_images/vd.jpg')}
						/>
						<Image
							resizeMode="contain"
							style={componentStyles.siteImage}
							source={require('../images/network_images/pd.jpg')}
						/>
						<Image
							resizeMode="contain"
							style={componentStyles.siteImage}
							source={require('../images/network_images/fm.jpg')}
						/>
						<Image
							resizeMode="contain"
							style={componentStyles.siteImage}
							source={require('../images/network_images/lsp.png')}
						/>
						<Image
							resizeMode="contain"
							style={componentStyles.siteImage}
							source={require('../images/network_images/aaa.png')}
						/>
						<Image
							resizeMode="contain"
							style={componentStyles.siteImage}
							source={require('../images/network_images/keg.png')}
						/>
						<Image
							resizeMode="contain"
							style={componentStyles.siteImage}
							source={require('../images/network_images/wcd.png')}
						/>
					</View>
					<View>
						<Image
							resizeMode="contain"
							style={componentStyles.siteImage}
							source={require('../images/network_images/ld.jpg')}
						/>
						<Image
							resizeMode="contain"
							style={componentStyles.siteImage}
							source={require('../images/network_images/hs.jpg')}
						/>
						<Image
							resizeMode="contain"
							style={componentStyles.siteImage}
							source={require('../images/network_images/vp.jpg')}
						/>
						<Image
							resizeMode="contain"
							style={componentStyles.siteImage}
							source={require('../images/network_images/f.jpg')}
						/>
						<Image
							resizeMode="contain"
							style={componentStyles.siteImage}
							source={require('../images/network_images/imd.png')}
						/>
						<Image
							resizeMode="contain"
							style={componentStyles.siteImage}
							source={require('../images/network_images/ca.png')}
						/>
						<Image
							resizeMode="contain"
							style={componentStyles.siteImage}
							source={require('../images/network_images/lvg.png')}
						/>
					</View>
				</View>
				<View style={componentStyles.middleTextContainer} >
					<Text>
						Our friendly home improvement experts are here to make shopping for your next project fun and stress-free. We specialize in great product advice and personalized service to help you find the perfect match for your style and budget. With more than 700,000 items to choose from, everything you need is in one place.
					</Text>
				</View>
				<View style={componentStyles.bottomTextContainer} >
					<Text
						style={componentStyles.container}
						textAlign="center"
					>
						Build.com, Inc. {'\n'}
						402 Otterson Dr. Ste 100, {'\n'}
						Chico, CA 95928
					</Text>
					<LinkButton
						onPress={() => EventEmitter.emit('onCallUs', phone)}
						textAlign="center"
					>
						<Text textAlign="center">
							Phone: <Text color="primary">{PhoneHelper.formatPhoneNumber(phone)}</Text>
						</Text>
					</LinkButton>
					<View style={componentStyles.spacer}/>
					<LinkButton
						onPress={() => this.props.navigation.getNavigator('root').push('email')}
						textAlign="center"
					>
						<Text textAlign="center">
							Email: <Text color="primary">cs@build.com</Text>
						</Text>
					</LinkButton>
				</View>
				<View style={componentStyles.versionContainer}>
					<View style={componentStyles.row}>
						<Text
							style={componentStyles.versionText}
							textAlign="right"
						>Version:</Text>
						<Text
							style={componentStyles.versionText}
							color="accent"
						>{Device.appVersion}</Text>
					</View>
					<View style={componentStyles.row}>
						<Text
							style={componentStyles.versionText}
							textAlign="right"
						>Build:</Text>
						<Text
							style={componentStyles.versionText}
							color="accent"
						>{Device.appBuild}</Text>
					</View>
				</View>
			</ScrollView>
		);
	}
}

AboutScreen.route = {
	navigationBar: {
		title: 'About Build.com',
	},
};

AboutScreen.propTypes = {
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
};

export default (withScreen(AboutScreen));
