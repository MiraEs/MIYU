'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	TouchableOpacity,
	StyleSheet,
	Platform,
	Alert,
	NativeModules,
} from 'react-native';
const { ContactPicker } = NativeModules;
import {
	DELETE_PENDING,
} from '../constants/constants';
import {
	ScrollView,
	Text,
	ListView,
} from 'BuildLibrary';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import helpers from '../lib/helpers';
import {
	getTeam,
	getInvitees,
	sendProjectInvites,
	updateProjectInvites,
	resendProjectInvite,
	rejectProjectInvite,
	deleteProjectTeamMember,
} from '../actions/TeamActions';
import {
	trackState,
	trackAction,
} from '../actions/AnalyticsActions';
import EventEmitter from '../lib/eventEmitter';
import styles from '../lib/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import Avatar from '../components/Avatar';
import LoadError from '../components/loadError';
import LoadingView from '../components/LoadingView';
import Permissions from '../lib/Permissions';

const componentStyles = StyleSheet.create({
	borderBottom: {
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.iOSDivider,
	},
	padding: {
		padding: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
	},
	tag: {
		marginLeft: styles.measurements.gridSpace1,
		marginBottom: 2,
	},
	header: {
		backgroundColor: styles.colors.greyLight,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.iOSDivider,
	},
	invitePeople: {
		backgroundColor: styles.colors.white,
	},
	invitePeopleText: {
		backgroundColor: styles.colors.white,
		flex: 1,
	},
	resend: {
		backgroundColor: styles.colors.primary,
		marginLeft: styles.measurements.gridSpace1,
	},
	remove: {
		backgroundColor: styles.colors.error,
		marginLeft: styles.measurements.gridSpace1,
	},
	teamMemberEmail: {
		marginLeft: styles.measurements.gridSpace1,
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
	},
	marginLeft: {
		marginLeft: styles.measurements.gridSpace1,
	},
	deleteMember: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
	},
});

export class ManagePeople extends Component {
	componentWillMount() {
		const { projectId, actions } = this.props;
		actions.getTeam(projectId);
		actions.getInvitees(projectId);
	}

	componentDidMount() {
		this.props.actions.trackState('build:app:managePeople');
	}

	rejectProjectInvite = (teamMemberId) => {
		this.props.actions.rejectProjectInvite({
			projectId: this.props.projectId,
			inviteId: teamMemberId,
		});
	};

	launchContactPicker = () => {
		if (helpers.isAndroid()) {
			Permissions.requestContacts().then((contactsPermStatus) => {
				if (Permissions.isGranted(contactsPermStatus)) {
					this.pickContact();
				} else {
					this.navigateToInviteScreen();
				}
			}).catch(() => {
				this.navigateToInviteScreen();
			}).done();
		} else {
			this.pickContact();
		}
	};

	pickContact = () => {
		ContactPicker.pickContact().then((data) => {
			if (data && data.length) {
				this.navigateToInviteScreen(data);
			} else {
				this.navigateToInviteScreen(null, true);
			}
		}).catch(() => {
			if (Platform.OS === 'ios') {
				Alert.alert('Contact Access Disabled', 'Build.com does not have access to your Contacts. To enable access open the Settings app, tap Privacy, tap Contacts, and toggle the Build switch. This will restart the Build App.');
			}
			this.navigateToInviteScreen();
		});
	};

	resendProjectInvite = (teamMemberId) => {
		this.props.actions.resendProjectInvite({
			projectId: this.props.projectId,
			inviteId: teamMemberId,
		});
	};

	deleteProjectTeamMember = (teamMemberId) => {
		this.props.actions.trackAction('delete_team_member', {
			projectId: this.props.projectId,
			owner: this.props.owner,
			teamMemberId,
		});

		this.props.actions.deleteProjectTeamMember({
			projectId: this.props.projectId,
			deleteFromSharedProjects: !this.props.owner,
			teamMemberId,
		});
		if (!this.props.owner) {
			this.props.navigator.push('projects');
		}
	};

	navigateToInviteScreen = (contactEmails, pickerFailure) => {
		this.props.navigator.push('sendInvites', {
			projectId: this.props.projectId,
			fromManagePeopleScreen: true,
			contactEmails,
			pickerFailure,
		});
	};

	openActionSheet = () => {
		EventEmitter.emit('showActionSheet', {
			title: 'Add People to Your Team',
			options: [{
				text: 'Add by Email',
				onPress: this.navigateToInviteScreen,
			}, {
				text: 'Add from Contacts',
				onPress: this.launchContactPicker,
			}, {
				text: 'Cancel',
				onPress: helpers.noop,
			}],
		});
	};

	renderHeader = (data, sectionId) => {
		const text = sectionId === 'team' ? 'TEAM MEMBERS' : 'THE TEAM';
		return (
			<View style={componentStyles.header}>
				<Text
					weight="bold"
					family="archer"
					style={styles.elements.listHeader}
					lineHeight={false}
				>{text}</Text>
			</View>
		);
	};

	renderCreatorTag = (teamMember) => {
		if (!teamMember.id) {
			return (
				<View style={componentStyles.tag}>
					<Text
						size="small"
						color="accent"
						lineHeight={false}
					>
						PROJECT OWNER
					</Text>
				</View>
			);
		}
	};

	renderMemberBadge = (teamMember) => {
		if (teamMember.id) {
			return (
				<View
					style={styles.elements.centeredFlexRow}
				>
					<Text>
						Member
					</Text>
					<Icon
						name="ios-arrow-forward"
						size={25}
						color={styles.colors.mediumGray}
						style={componentStyles.marginLeft}
					/>
				</View>
			);
		}
	};

	showMemberActionSheet = (teamMemberId, teamMemberEmail) => {
		const removeSelf = teamMemberEmail === this.props.userEmail;
		if (teamMemberId && (this.props.owner || removeSelf)) {
			EventEmitter.emit('showActionSheet', {
				description: 'Team Member Actions',
				options: [{
					text: removeSelf ? 'Leave Project' : 'Remove From Project',
					onPress: () => {
						this.deleteProjectTeamMember(teamMemberId);
					},
				}, {
					text: 'Cancel',
					onPress: helpers.noop,
				}],
			});
		}

	};

	showInviteeActionSheet = (teamMemberId) => {

		let rejectOption = [];

		if (this.props.owner) {
			rejectOption = [{
				text: 'Cancel Invitation',
				onPress: () => {
					this.rejectProjectInvite(teamMemberId);
				},
			}];
		}

		EventEmitter.emit('showActionSheet', {
			description: 'Manage this invitation',
			options: [{
				text: 'Send Again',
				onPress: () => {
					this.resendProjectInvite(teamMemberId);
				},
			},
				...rejectOption,
			{
				text: 'Cancel',
				onPress: helpers.noop,
			}],
		});
	};

	renderTeam = (teamMember) => {

		if (this.props.loadError) {
			return <LoadError message={this.props.loadError} />;
		}
		if (teamMember.user && teamMember._status !== DELETE_PENDING) {
			return (
				<TouchableOpacity
					style={[componentStyles.borderBottom, componentStyles.padding, componentStyles.deleteMember]}
					onPress={() => this.showMemberActionSheet(teamMember.id, teamMember.email)}
				>
					<View>
						<Avatar
							fullName={teamMember.user.name}
							firstName={teamMember.user.firstName}
							lastName={teamMember.user.lastName}
						/>
					</View>
					<View style={[componentStyles.marginLeft, styles.elements.flex]}>
						<View style={styles.elements.rightFlextRow}>
							<View>
								<Text weight="bold">{teamMember.user.name}</Text>
							</View>
							{this.renderCreatorTag(teamMember)}
						</View>
						<View>
							<Text>{teamMember.email}</Text>
						</View>
					</View>
					{this.renderMemberBadge(teamMember)}
				</TouchableOpacity>
			);
		} else if (teamMember._status !== DELETE_PENDING) {
			return (
				<TouchableOpacity
					style={[componentStyles.borderBottom, componentStyles.padding, styles.elements.centeredFlexRow]}
					onPress={() => this.showInviteeActionSheet(teamMember.id)}
				>
					<View>
						<Avatar />
					</View>
					<View style={componentStyles.teamMemberEmail}>
						<Text
							style={styles.elements.flex}
							numberOfLines={1}
						>
							{teamMember.email}
						</Text>
						<View
							style={styles.elements.centeredFlexRow}
						>
							<Text>
								Invited
							</Text>
							<Icon
								name="ios-arrow-forward"
								size={25}
								color={styles.colors.mediumGray}
								style={componentStyles.marginLeft}
							/>
						</View>
					</View>
				</TouchableOpacity>
			);
		} else {
			return <View/>;
		}


	};

	renderInviteUI = () => {

		if (!this.props.owner) {
			return null;
		}

		return (
			<View>
				<View style={componentStyles.header}>
					<Text
						weight="bold"
						family="archer"
						style={styles.elements.listHeader}
					>
						BUILD YOUR TEAM
					</Text>
				</View>
				<TouchableOpacity
					style={componentStyles.invitePeople}
					onPress={this.openActionSheet}
				>
					<View style={styles.elements.row}>
						<Text
							lineHeight={false}
							weight="bold"
							size="small"
							style={componentStyles.invitePeopleText}
						>
							Invite People To Project
						</Text>
						<Icon
							name="ios-arrow-forward"
							size={25}
							color={styles.colors.mediumGray}
						/>
					</View>
				</TouchableOpacity>
			</View>
		);
	};

	render() {

		if (this.props.isLoading) {
			return <LoadingView />;
		}

		return (
			<View style={styles.elements.screenWithHeader}>
				{this.renderInviteUI()}
				<ScrollView
					automaticallyAdjustContentInsets={false}
					style={{backgroundColor: styles.colors.greyLight}}
					scrollsToTop={true}
				>
					<ListView
						enableEmptySections={true}
						automaticallyAdjustContentInsets={false}
						dataSource={this.props.team}
						renderSectionHeader={this.renderHeader.bind(this)}
						renderRow={this.renderTeam.bind(this)}
					/>
				</ScrollView>
			</View>
		);
	}

}

ManagePeople.propTypes = {
	projectId: PropTypes.number.isRequired,
	actions: PropTypes.object.isRequired,
	owner: PropTypes.bool,
	userEmail: PropTypes.string,
	loadError: PropTypes.string,
	isLoading: PropTypes.bool.isRequired,
	team: PropTypes.object,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
};

ManagePeople.route = {
	navigationBar: {
		title: (props) => props.projectName ? `The ${props.projectName} Team` : 'The Team',
	},
};

const mapStateToProps = (state) => {
	return {
		team: new ListView.DataSource({
			rowHasChanged: () => true,
		}).cloneWithRows(state.teamReducer.team.members.concat(state.teamReducer.team.invitees)),
		loadError: state.teamReducer.error,
		inviteeError: state.teamReducer.inviteesError,
		isLoading: false,
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

export default connect(mapStateToProps, mapDispatchToProps)(ManagePeople);
