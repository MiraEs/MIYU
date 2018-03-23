'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Alert,
	View,
	Text,
	Image,
	TextInput,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
import {
	withScreen,
	ListView,
} from 'BuildLibrary';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	getTeam,
	getInvitees,
	sendProjectInvites,
	updateProjectInvites,
	resendProjectInvite,
	rejectProjectInvite,
	deleteProjectTeamMember,
} from '../actions/TeamActions';
import styles from '../lib/styles';
import Joi from 'rn-joi';
import Button from '../components/button';
import TrackingActions from '../lib/analytics/TrackingActions';
import {
	trackState,
	trackAction,
} from '../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({
	emailRow: {
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.iOSDivider,
		padding: styles.measurements.gridSpace3,
		backgroundColor: styles.colors.white,
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
	},
	emailRowWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	emailRowText: {
		flex: 1,
		fontFamily: styles.fonts.mainRegular,
	},
	imageWrapper: {
		marginHorizontal: styles.measurements.gridSpace3,
		marginTop: styles.measurements.gridSpace3,
		alignItems: 'center',
	},
	mainScreen: {
		paddingTop: styles.measurements.gridSpace3,
		flex: 1,
	},
	inputGroup: {
		marginVertical: styles.measurements.gridSpace1,
	},
});

export class InviteScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			newEmail: '',
		};
	}

	componentDidMount() {
		// We can't use autoFocus on the input because it
		// causes some jank in the modal animation (eyeroll)
		if (this.emailInput) {
			setTimeout(() => {
				this.emailInput.focus();
			}, 500);
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:invite',
		};
	}

	onInviteeChange = (newEmail) => {
		this.setState({
			newEmail,
		});
	};

	trackInvite = () => {
		const { user, projectId } = this.props;
		this.props.actions.trackAction('Invitation', {
			user_id: user.customerId,
			email: user.email,
			project_id: projectId,
			// project_status: project.archived ? 'archived' : 'active',
		});
	};

	inviteUserToProject = (email) => {
		const newEmail = email || this.state.newEmail;

		try {
			Joi.assert(newEmail, Joi.string().email());
		} catch (error) {
			Alert.alert('Please enter a valid email.');
			return !error;
		}

		this.props.actions.sendProjectInvites({
			projectId: this.props.projectId,
			emailAddresses: [newEmail],
		});
		this.trackInvite();
		this.props.navigator.pop();
	};

	renderEmailRow = (email) => {
		return (
			<TouchableOpacity
				style={componentStyles.emailRowWrapper}
				onPress={() => this.inviteUserToProject(email)}
			>
				<View style={componentStyles.emailRow}>
					<Text
						style={componentStyles.emailRowText}
						numberOfLines={1}
					>
						{email}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	renderSelectEmail = () => {
		const ds = new ListView.DataSource({
			rowHasChanged: () => true,
		}).cloneWithRows(this.props.contactEmails);
		return (
				<View
					style={[styles.elements.screenWithHeader,
						styles.elements.flex,
					]}
				>
				<ListView
					automaticallyAdjustContentInsets={false}
					dataSource={ds}
					renderRow={(email) => this.renderEmailRow(email)}
				/>
			</View>
		);
	};

	renderFailedContactPickMessage = () => {
		if (this.props.pickerFailure) {
			return <Text style={[styles.text.mediumDarkGray, styles.text.center, styles.text.errorText]}>	Whoops, looks like that contact doesn't have an email address. Please fill one out below. </Text>;
		}
	};
	render() {
		if (this.props.contactEmails) {
			return this.renderSelectEmail();
		}
		return (
			<View style={[styles.elements.screenWithHeader, componentStyles.mainScreen]}>
				{this.renderFailedContactPickMessage()}
				<Text style={[styles.text.mediumDarkGray, styles.text.center]}> Build a project team to get feedback and advice from the people you trust. Send an email to invite a new member. You can make changes to your team at any time. </Text>
				<View style={componentStyles.imageWrapper}>
					<Image
						source={require('../images/home-logo.png')}
						resizeMode={'stretch'}
					/>
				</View>
				<View style={[styles.elements.inputGroup, componentStyles.inputGroup]}>
					<TextInput
						autoCapitalize="none"
						autoCorrect={false}
						keyboardType="email-address"
						onChangeText={this.onInviteeChange}
						placeholder="Invite friends by email."
						ref={(node) => this.emailInput = node}
						style={styles.elements.inputGroupItem}
						value={this.state.newEmail}
						underlineColorAndroid="transparent"
					/>
				</View>
				<Button
					text="Send Invite"
					onPress={() => this.inviteUserToProject()}
					accessibilityLabel="Send Invite Button"
					trackAction={TrackingActions.SEND_INVITE}
				/>
			</View>
		);
	}
}

InviteScreen.route = {
	navigationBar: {
		title: 'Invite',
	},
};

InviteScreen.propTypes = {
	projectId: PropTypes.number.isRequired,
	navigator: PropTypes.shape({
		pop: PropTypes.func,
	}),
	fromManagePeopleScreen: PropTypes.bool,
	contactEmails: PropTypes.array,
	pickerFailure: PropTypes.bool,
	user: PropTypes.object.isRequired,
	actions: PropTypes.object.isRequired,
};

InviteScreen.defaultProps = {
	fromManagePeopleScreen: false,
};

const mapStateToProps = (state) => {
	return {
		user: state.userReducer.user,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getTeam,
			getInvitees,
			sendProjectInvites,
			updateProjectInvites,
			resendProjectInvite,
			rejectProjectInvite,
			deleteProjectTeamMember,
			trackState,
			trackAction,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(InviteScreen));
