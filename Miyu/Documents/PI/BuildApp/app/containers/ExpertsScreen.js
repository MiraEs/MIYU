'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import EventEmitter from '../lib/eventEmitter';
import styles from '../lib/styles';
import ExpertBio from '../components/ExpertBio';
import Tutorial from '../components/Tutorial';
import {
	Text,
	Image,
	Button,
	ScrollView,
	withScreen,
} from 'BuildLibrary';
import trackingActions from '../lib/analytics/TrackingActions';
import { trackState } from '../actions/AnalyticsActions';
import { bindActionCreators } from 'redux';
import PhoneHelper from '../lib/PhoneHelper';
import moment from 'moment';
import ListHeader from '../components/listHeader';
import TappableListItem from '../components/TappableListItem';
import helpersWithLoadRequirements from '../lib/helpersWithLoadRequirements';
import {
	TERMS_OF_USE_URL,
	HOME,
	RETURNS_POLICY_URL,
	SECURITY_AND_PRIVACY_URL,
} from '../constants/constants';
import { withNavigation } from '@expo/ex-navigation';
import ExpandableListItem from '../components/ExpandableListItem';
import LinkButton from '../components/Library/Button/LinkButton';

const componentStyles = StyleSheet.create({
	hoursOfOperation: {
		borderTopWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.greyLight,
		padding: styles.measurements.gridSpace2,
	},
	callOrEmail: {
		paddingBottom: styles.measurements.gridSpace2,
		paddingHorizontal: styles.measurements.gridSpace1,
	},
	orText: {
		paddingVertical: styles.measurements.gridSpace1,
	},
	proText: {
		padding: styles.measurements.gridSpace1,
	},
	buttons: {
		flex: 1,
		flexBasis: 44,
	},
	callOrEmailBottomText: {
		paddingHorizontal: styles.measurements.gridSpace9 - 5,
		alignItems: 'center',
	},
	text: {
		marginHorizontal: styles.measurements.gridSpace1,
	},
	imageContainer: {
		paddingHorizontal: styles.measurements.gridSpace4,
	},
	image: {
		borderBottomWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.secondary,
		marginBottom: styles.measurements.gridSpace2,
	},
	buttonDivider: {
		width: styles.measurements.gridSpace1,
	},
	startToFinishHelp: {
		paddingBottom: styles.measurements.gridSpace1,
	},
});

export class ExpertsScreen extends Component {
	setScreenTrackingInformation() {
		return {
			name: 'build:app:experts',
		};
	}

	login = (initialScreen = 'LOGIN') => {
		this.props.navigation.getNavigator('root').push('loginModal', {
			initialScreen,
			loginSuccess: () => this.props.navigation.getNavigator('root').pop(),
		});
	};

	viewEmailScreen = () => {
		this.props.navigation.getNavigator('root').push('email');
	};

	isPro = () => {
		return !!this.props.customer.isPro;
	};

	hasAssignedExpert = () => {
		const { customer } = this.props;
		return customer && customer.rep && customer.rep.repUserID;
	};

	handleFeedbackPressed = () => {
		this.props.navigation.getNavigator('root').push('email', { initialSubjectIndex: 4 });
	};

	handleCompanyPressed = () => {
		this.props.navigator.push('about');
	};

	handleTermsOfUsePressed = () => {
		helpersWithLoadRequirements.openURL(TERMS_OF_USE_URL);
	};

	handleReturnPolicyPressed = () => {
		helpersWithLoadRequirements.openURL(RETURNS_POLICY_URL);
	};

	handleSecurityAndPrivacyPressed = () => {
		helpersWithLoadRequirements.openURL(SECURITY_AND_PRIVACY_URL);
	};

	handleAppTourPressed = () => {
		this.props.navigation.performAction(({ tabs }) => tabs('main').jumpToTab(HOME));
		EventEmitter.emit('showCustomScreenOverlay', {
			component: <Tutorial />,
			alpha: 0.5,
			overlayStyles: {
				top: 0,
			},
		});
	};

	renderAllExperts = () => {
		return (
			<View style={[styles.elements.centeredFlexColumn, componentStyles.startToFinishHelp]}>
				<View style={componentStyles.imageContainer}>
					<Image
						source={require('../images/experts/directory-hero-image.png')}
						style={componentStyles.image}
					/>
				</View>
				<Text
					weight="bold"
					textAlign="center"
					fontSize="large"
				>
					Start-to-finish help
				</Text>
				<Text
					textAlign="center"
					style={componentStyles.text}
				>
					Our Project Advisors are ready to answer your questions and help you find what you need to make your project perfect. Why wait? Call or email today!
				</Text>
			</View>
		);
	};

	renderExpertView = () => {
		if (this.isPro()) {
			return <ExpertBio rep={this.props.customer.rep} />;
		}
		return this.renderAllExperts();
	};

	renderOperationHours = () => {
		const timeZone = moment().isDST() ? 'PDT' : 'PST';
		const align = this.isPro() ? 'left' : 'center';
		return (
			<View style={componentStyles.hoursOfOperation}>
				<Text
					textAlign={align}
					size="small"
				>
					Project Advisors are available:
				</Text>
				<Text
					textAlign={align}
					size="small"
				>
					Weekdays: 5am - 7pm {timeZone}
				</Text>
				<Text
					textAlign={align}
					size="small"
				>
					Weekends: 6am - 4pm {timeZone}
				</Text>
			</View>
		);
	};

	renderCallOrEmail = () => {
		const phone = PhoneHelper.getPhoneNumberByUserType(this.props.customer);
		return (
			<View>
				<View style={[componentStyles.callOrEmail, styles.elements.centeredFlexRow]}>
					<Button
						onPress={() => this.viewEmailScreen()}
						text="Email"
						color="primary"
						style={componentStyles.buttons}
						accessibilityLabel="Email an Expert Button"
						trackAction={trackingActions.EXPERTS_SCREEN_EMAIL}
					/>
					<View style={componentStyles.buttonDivider} />
					<Button
						onPress={() => EventEmitter.emit('onCallUs', phone)}
						text="Call"
						color="primary"
						style={componentStyles.buttons}
						accessibilityLabel="Call an Expert Button"
						trackAction={trackingActions.EXPERTS_SCREEN_CALL}
					/>
				</View>
			</View>
		);
	};

	renderMenuOptions = () => {
		const generalPhoneNumber = PhoneHelper.getGeneralPhoneNumber();
		const phone = PhoneHelper.formatPhoneNumber(generalPhoneNumber);
		return (
			<View>
				{
					this.isPro() &&
					<ExpandableListItem
						body="Contact Us"
						trackAction={trackingActions.EXPERTS_CONTACT_US}
					>
						<Text>General Customer Support</Text>
						<Text>Contact one of our many Project Advisors at</Text>
						<LinkButton onPress={() => EventEmitter.emit('onCallUs', phone)}>{phone}</LinkButton>
					</ExpandableListItem>
				}
				<TappableListItem
					body="Feedback"
					onPress={this.handleFeedbackPressed}
				/>
				<TappableListItem
					body="App Tour"
					onPress={this.handleAppTourPressed}
				/>
				<TappableListItem
					body="Company"
					onPress={this.handleCompanyPressed}
				/>
				<TappableListItem
					body="Return Policy"
					onPress={this.handleReturnPolicyPressed}
				/>
				<TappableListItem
					body="Security & Privacy"
					onPress={this.handleSecurityAndPrivacyPressed}
				/>
				<TappableListItem
					body="Terms of Use"
					onPress={this.handleTermsOfUsePressed}
				/>
			</View>
		);
	};

	render() {
		return (
			<View style={styles.elements.screenWithHeader}>
				<ScrollView scrollsToTop={true}>
					{this.renderExpertView()}
					{this.renderCallOrEmail()}
					{this.renderOperationHours()}
					<ListHeader text="GENERAL INFO" />
					{this.renderMenuOptions()}
				</ScrollView>
			</View>
		);
	}
}

ExpertsScreen.propTypes = {
	actions: PropTypes.object,
	customer: PropTypes.object,
	isLoggedIn: PropTypes.bool,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
		performAction: PropTypes.func,
	}),
};

const mapStateToProps = (state) => {
	return {
		customer: state.userReducer.user,
		isLoggedIn: state.userReducer.isLoggedIn,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			trackState,
		}, dispatch),
	};
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(withScreen(ExpertsScreen)));
