import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StatusBar,
	StyleSheet,
	View,
} from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import EventEmitter from '../lib/eventEmitter';
import styles from '../lib/styles';
import {
	Image,
	Text,
	LinkButton,
} from 'BuildLibrary';
import helpers from '../lib/helpers';
import SimpleStoreHelpers from '../lib/SimpleStoreHelpers';

const componentStyles = StyleSheet.create({
	wrapper: {
		flex: 1,
	},
	container: {
		top: 180,
		paddingHorizontal: styles.measurements.gridSpace4,
	},
	infoTextWrapper: {
		position: 'absolute',
		top: 220,
	},
	loginView: {
		marginTop: styles.measurements.gridSpace5,
	},
	loginButtonsRow: {
		flexDirection: 'row',
	},
	divider: {
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.greyDark,
	},
	footer: {
		position: 'absolute',
		bottom: helpers.isAndroid() ? StatusBar.currentHeight : 0,
		right: 0,
		left: 0,
		height: 50,
		paddingHorizontal: styles.measurements.gridSpace3,
	},
	footerButton: {
		alignItems: 'center',
		padding: styles.measurements.gridSpace2,
	},
	row: {
		height: 42,
		paddingHorizontal: styles.measurements.gridSpace2,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: styles.colors.white,
	},
	arrow: {
		position: 'absolute',
		top: 145,
		left: 180,
		transform: [{ rotate: '160 deg' }],
	},
	padRight: {
		paddingRight: styles.measurements.gridSpace1,
	},
});

export default class AddToProjectTutorial extends Component {

	getRowStyle = () => {
		const style = [componentStyles.row];
		const navHeight = Navigator.NavigationBar.Styles.General.TotalNavHeight;
		const rowPageY = navHeight + 42;
		style.push({ top: rowPageY });
		return style;
	};

	hideTutorial = (openLogin = true, intialScreen = 'LOGIN') => {
		this.props.onPress(openLogin, intialScreen);
		SimpleStoreHelpers.setAddToProjectTutorial(true).catch(helpers.noop).done();
		EventEmitter.emit('hideScreenOverlay');
	};

	renderLogin = () => {
		if (!this.props.isLoggedIn) {
			return (
				<View style={componentStyles.loginView}>
					<Text
						color="white"
						size="small"
					>
						Already have an Account?
					</Text>
					<View style={componentStyles.loginButtonsRow}>
						<LinkButton
							onPress={this.hideTutorial}
							style={componentStyles.padRight}
						>
							<Text
								color="primary"
								size="small"
							>
								Login
							</Text>
						</LinkButton>
						<Text
							color="white"
							size="small"
							style={componentStyles.padRight}
						>
							or
						</Text>
						<LinkButton onPress={() => this.hideTutorial(true, 'SIGNUP')}>
							<Text
								color="primary"
								size="small"
							>
								Create Account
							</Text>
						</LinkButton>
					</View>
				</View>
			);
		}
	};

	render() {
		return (
			<View style={componentStyles.wrapper}>
				<View style={this.getRowStyle()}>
					<Text
						color="secondary"
						size="small"
					>
						First Project
					</Text>
				</View>
				<Image
					width={90}
					height={90}
					resizeMode="contain"
					key="arrow_1"
					style={componentStyles.arrow}
					source={require('../images/arrows/arrow1/arrow1.png')}
				/>
				<View style={componentStyles.container}>
					<View>
						<Text
							color="white"
							size="large"
							weight="bold"
							family="archer"
						>
							Add items to a Project
						</Text>
						<Text
							color="white"
							size="small"
						>
							Create and organize a master shopping list for your home improvement project. Save
							inspiration and share your project progress!
						</Text>
					</View>
					{this.renderLogin()}
				</View>
				<View style={componentStyles.footer}>
					<View style={componentStyles.divider}/>
					<LinkButton
						onPress={() => this.hideTutorial(false)}
						style={componentStyles.footerButton}
					>
						<Text color="white">Got it!</Text>
					</LinkButton>
				</View>
			</View>
		);
	}
}

AddToProjectTutorial.propTypes = {
	isLoggedIn: PropTypes.bool.isRequired,
	onPress: PropTypes.func.isRequired,
};
