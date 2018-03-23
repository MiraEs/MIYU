import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Alert,
	NativeModules,
	StyleSheet,
	View,
} from 'react-native';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';
import {
	KeyboardSpacer,
	ScrollView,
	Text,
	withScreen,
} from 'BuildLibrary';
import { LinkingManager } from 'BuildNative';
import TappableListItem from '../../components/TappableListItem';
import TrackingActions from '../../lib/analytics/TrackingActions';
import InviteContactForm from '../../components/InviteContactForm';
import FixedBottomButton from '../../components/FixedBottomButton';
import Permissions from '../../lib/Permissions';
import { sendProjectInvites } from '../../actions/TeamActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EventEmitter from '../../lib/eventEmitter';
import { withNavigation } from '@expo/ex-navigation';
import { showAlert } from '../../actions/AlertActions';

const { ContactPicker } = NativeModules;

const componentStyles = StyleSheet.create({
	header: {
		height: 57,
		justifyContent: 'center',
		padding: styles.measurements.gridSpace2,
	},
	inviteFormWrapper: {
		borderBottomWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
		marginTop: styles.measurements.gridSpace1,
		paddingVertical: styles.measurements.gridSpace2,
		backgroundColor: styles.colors.white,
	},
	inviteFromContacts: {
		borderTopWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
	},
	addTeammate: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: styles.measurements.gridSpace2,
	},
	addIcon: {
		paddingRight: styles.measurements.gridSpace1,
	},
});

export class InviteTeammateScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			emailAddress: '',
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.inviteeError) {
			EventEmitter.emit('showScreenAlert', {
				message: 'Failed to send invite. Try Again',
				type: 'error',
			});
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:invite',
		};
	}

	launchContactPicker = () => {
		if (helpers.isAndroid()) {
			Permissions.requestContacts().then((contactsPermStatus) => {
				if (Permissions.isGranted(contactsPermStatus)) {
					this.pickContact();
				}
			}).catch(helpers.noop).done();
		} else {
			this.pickContact();
		}
	};

	pickContact = () => {
		ContactPicker.pickContact().then((data) => {
			if (data && data.length) {
				this.setEmailToInvite(data[0]);
			} else {
				this.props.actions.showAlert('Selected contact does not have an email', 'warning');
			}
		}).catch(() => {
			if (helpers.isIOS()) {
				Alert.alert(
					'Contact Access Disabled',
					'Build.com needs access to your contacts to invite teammates.',
					[
						{
							text: 'Settings',
							onPress: LinkingManager.openBuildAppSettings,
						},
						{
							text: 'Ok',
							onPress: helpers.noop,
						},
					]
				);
			}
		}).done();
	};

	setEmailToInvite = (emailAddress) => {
		this.setState({ emailAddress });
	};

	onPressSendInvitation = () => {
		const { emailAddress } = this.state;
		const { projectId, actions, navigator } = this.props;
		if (emailAddress) {
			actions.sendProjectInvites({
				projectId,
				emailAddresses: [emailAddress],
			}).then(() => {
				this.props.actions.showAlert(
					'Invitation sent.',
					'success',
					null,
					navigator.pop,
				);
			}).done();
		}
	};

	renderInviteFromContacts = () => {
		return (
			<View style={componentStyles.inviteFromContacts}>
				<TappableListItem
					onPress={this.launchContactPicker}
					body="Invite from Contacts"
					icon={helpers.getIcon('arrow-forward')}
					accessibilityLabel="Invite from Contacts"
					leadIcon={helpers.getIcon('contacts')}
					analyticsData={{ trackName: TrackingActions.INVITE_TEAMMATES_INVITE_FROM_CONTACT_TAP }}
				/>
			</View>
		);
	};

	renderSendInviteButton = () => {
		return (
			<FixedBottomButton
				buttonText="Send Invitation"
				onPress={this.onPressSendInvitation}
				trackAction={TrackingActions.INVITE_TEAMMATES_SEND_INVITATION}
				accessibilityLabel="Send Invitation"
				hideOnKeyboardShow={true}
				disabled={!this.state.emailAddress}
			/>
		);
	};

	renderInviteForm = () => {
		return (
			<View style={componentStyles.inviteFormWrapper}>
				<InviteContactForm
					email={this.state.emailAddress}
					onHandleChange={this.setEmailToInvite}
				/>
			</View>
		);
	};

	render() {
		return (
			<View style={styles.elements.screenGreyLight}>
				<ScrollView>
					<View style={componentStyles.header}>
						<Text
							size="small"
							color="secondary"
						>
							Who will you be working with on this project?
						</Text>
					</View>
					{this.renderInviteFromContacts()}
					{this.renderInviteForm()}
				</ScrollView>
				<KeyboardSpacer />
				{this.renderSendInviteButton()}
			</View>
		);
	}
}

InviteTeammateScreen.propTypes = {
	actions: PropTypes.object,
	inviteeError: PropTypes.string,
	navigator: PropTypes.shape({
		pop: PropTypes.func,
	}),
	projectId: PropTypes.number.isRequired,
};

InviteTeammateScreen.displayName = 'Invite Teammates Modal';

InviteTeammateScreen.route = {
	navigationBar: {
		title: 'Invite Teammate',
	},
};

const mapStateToProps = (state) => {
	return {
		inviteeError: state.teamReducer.inviteeError,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			sendProjectInvites,
			showAlert,
		}, dispatch),
	};
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(withScreen(InviteTeammateScreen)));
