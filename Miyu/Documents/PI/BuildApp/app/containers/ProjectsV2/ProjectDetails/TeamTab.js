'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import {
	Button,
	ListView,
	ScrollView,
	Text,
	withScreen,
} from 'BuildLibrary';
import styles from '../../../lib/styles';
import helpers from '../../../lib/helpers';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TrackingActions from '../../../lib/analytics/TrackingActions';
import {
	getTeam,
	getInvitees,
	resendProjectInvite,
	resendAllInvitesForProject,
} from '../../../actions/TeamActions';
import TappableListItem from '../../../components/TappableListItem';
import Avatar from '../../../components/Avatar';
import Icon from 'react-native-vector-icons/Ionicons';
import { splitName } from '../../../lib/Validations';
import pluralize from 'pluralize';
import { withNavigation } from '@expo/ex-navigation';

const componentStyles = StyleSheet.create({
	tab: {
		width: styles.dimensions.width,
	},
	inviteContainer: {
		flex: 1,
		backgroundColor: styles.colors.primaryLight,
		alignItems: 'center',
		justifyContent: 'center',
	},
	inviteDialogWrapper: {
		padding: styles.measurements.gridSpace1,
		alignItems: 'center',
	},
	inviteDialogText: {
		paddingHorizontal: styles.measurements.gridSpace2,
	},
	inviteDialogButtonWrapper: {
		flexDirection: 'row',
		borderTopWidth: styles.dimensions.borderWidth,
		borderTopColor: styles.colors.greyLight,
		marginTop: styles.measurements.gridSpace1,
	},
	inviteDialogButton: {
		flexGrow: 1,
	},
	inviteTeamTextWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	inviteTeamText: {
		marginLeft: styles.measurements.gridSpace1,
	},
	pendingFooterWrapper: {
		backgroundColor: styles.colors.primaryLight,
		padding: styles.measurements.gridSpace2,
	},
	pendingFooterText: {
		paddingBottom: styles.measurements.gridSpace2,
	},
	pendingHeader: {
		backgroundColor: styles.colors.white,
		borderBottomColor: styles.colors.grey,
		borderBottomWidth: styles.dimensions.borderWidth,
		padding: styles.measurements.gridSpace2,
	},
	spreadTextWrapper: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	verticalSpace: {
		marginTop: styles.measurements.gridSpace1,
	},
	teamMemberRow: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	teamMemberNameWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		overflow: 'hidden',
	},
	teamMemberName: {
		marginLeft: styles.measurements.gridSpace1,
	},
	shareProjectButton: {
		marginTop: styles.measurements.gridSpace2,
		marginHorizontal: styles.measurements.gridSpace2,
		marginBottom: styles.measurements.gridSpace2,
	},
	horizontalRule: {
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.primary,
		width: 60,
		marginVertical: styles.measurements.gridSpace1,
	},
	secondaryText: {
		marginRight: styles.measurements.gridSpace1,
	},
});

export class TeamTab extends Component {

	constructor(props) {
		super(props);
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
		});
		this.state = {
			teamInvitees: ds.cloneWithRows(props.teamInvitees),
			teamMembers: ds.cloneWithRows(props.teamMembers),
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.teamInvitees !== this.props.teamInvitees) {
			this.setState({ teamInvitees: this.state.teamInvitees.cloneWithRows(nextProps.teamInvitees) });
		}
		if (nextProps.teamMembers !== this.props.teamMembers) {
			this.setState({ teamMembers: this.state.teamMembers.cloneWithRows(nextProps.teamMembers) });
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:projects:details:team',
		};
	}

	getScreenData = () => {
		const { projectId, actions } = this.props;
		actions.getTeam(projectId);
		actions.getInvitees(projectId);
	};

	getStyle = () => {
		const style = [];
		if (this.shouldShowInviteDialog()) {
			style.push(componentStyles.inviteContainer);
		}
		return style;
	};

	shouldShowInviteDialog = () => {
		const { teamInvitees = [], teamMembers = [] } = this.props;
		return !teamInvitees.length || (!teamInvitees.length && teamMembers.length === 1);
	};

	onPageChanged = (selectedTabIndex) => {
		if (this.pager) {
			this.pager.goToPage(selectedTabIndex);
			this.setState({ selectedTabIndex });
		}
	};

	onPressInviteTeammates = () => {
		this.props.navigator.push('inviteTeammate', { projectId: this.props.projectId });
	};

	renderInviteDialog = () => {
		if (this.shouldShowInviteDialog()) {
			return (
				<View style={componentStyles.inviteDialogWrapper}>
					<Icon
						name={helpers.getIcon('person-add')}
						size={35}
						color={styles.colors.primary}
					/>
					<Text weight="bold">Invite Teammates</Text>
					<Text
						size="larger"
						family="archer"
					>
						Stay Connected
					</Text>
					<View style={componentStyles.horizontalRule} />
					<Text
						textAlign="center"
						size="small"
						style={componentStyles.inviteDialogText}
					>
						Keep everyone connected on your project. Collaborate on shopping lists,
						track orders and share progress photos. Home improvements is hard, we
						help make it easier! Start building your team today for free.
					</Text>
					<View style={componentStyles.inviteDialogButtonWrapper}>
						<Button
							accessibilityLabel="Invite"
							borders={false}
							color="primary"
							onPress={this.onPressInviteTeammates}
							style={componentStyles.inviteDialogButton}
							trackAction={TrackingActions.TEAM_INVITE_TEAMMATES_TAP}
						>
							{this.renderInviteTeammatesText()}
						</Button>
					</View>
				</View>
			);
		}
	};

	renderInviteeStatus = ({ status = '' }) => {
		if (status) {
			return (
				<Text
					capitalize="first"
					color="greyDark"
					fontStyle="italic"
					size="small"
					style={componentStyles.secondaryText}
				>
					{status.toLowerCase()}
				</Text>
			);
		}
	};

	renderInviteTappable = () => {
		if (!this.shouldShowInviteDialog()) {
			const contents = (
				<View style={componentStyles.spreadTextWrapper}>
					{this.renderInviteTeammatesText('greyDark')}
					<Text
						size="small"
						color="greyDark"
						style={componentStyles.secondaryText}
					>
						{pluralize('Member', this.props.teamMembers.length, true)}
					</Text>
				</View>
			);
			return (
				<View style={componentStyles.verticalSpace}>
					<TappableListItem
						onPress={this.onPressInviteTeammates}
						title={contents}
						accessibilityLabel="Invite Teammates tappable"
						analyticsData={{ trackName: TrackingActions.TEAM_INVITE_TEAMMATES_TAP }}
					/>
				</View>
			);
		}
	};

	renderInviteTeammatesText = (color = 'white') => {
		const textColor = color === 'white' ? color : 'greyDark';
		const iconColor = color === 'white' ? styles.colors.white : styles.colors.greyDark;
		return (
			<View style={componentStyles.inviteTeamTextWrapper}>
				<Icon
					name={helpers.getIcon('person-add')}
					size={25}
					color={iconColor}
				/>
				<Text
					color={textColor}
					style={componentStyles.inviteTeamText}
				>
					Invite Teammates
				</Text>
			</View>
		);
	};

	renderPendingFooter = () => {
		return (
			<View style={componentStyles.pendingFooterWrapper}>
				<Text
					size="small"
					style={componentStyles.pendingFooterText}
				>
					They havent accepted your invitation to collaborate,
					yet. <Text
						weight="bold"
						size="small"
					>
						Re-send invitations
					</Text> or
					copy and share this Project Invitation link to remind them!
				</Text>
				<Button
					accessibilityLabel="Resend Invitations"
					onPress={() => {
						const { actions, projectId, teamInvitees } = this.props;
						const inviteIds = teamInvitees.map((teamInvite) => teamInvite.id);
						actions.resendAllInvitesForProject(projectId, inviteIds);
					}}
					text="Resend Invitations"
					trackAction={TrackingActions.TEAM_RESEND_INVITES}
					isLoading={this.props.isResendingInvites}
				/>
			</View>
		);
	};

	renderPendingHeader = () => {
		return (
			<View style={componentStyles.pendingHeader}>
				<Text
					size="small"
					weight="bold"
				>
					Pending Teammates
				</Text>
			</View>
		);
	};

	renderPendingTeamList = () => {
		if (this.props.teamInvitees.length) {
			return (
				<View style={componentStyles.verticalSpace}>
					<ListView
						automaticallyAdjustContentInsets={false}
						dataSource={this.state.teamInvitees}
						renderFooter={this.renderPendingFooter}
						renderHeader={this.renderPendingHeader}
						renderRow={this.renderTeamMember.bind(this, this.renderInviteeStatus, true)}
					/>
				</View>
			);
		}
	};

	renderProjectOwner = (teamMember) => {
		if (teamMember.isOwner) {
			return (
				<Text
					size="small"
					color="greyDark"
					style={componentStyles.secondaryText}
				>
					Project Owner
				</Text>
			);
		}
	};

	renderTeamMember = (getSecondaryInfo, pending, teamMember) => {
		const {
			email,
			user = {},
		} = teamMember;
		if ((!user.firstName || !user.lastName) && user.name) {
			const { firstName, lastName } = splitName(user.name);
			user.firstName = firstName;
			user.lastName = lastName;
		}

		const { name = email } = user;
		const contents = (
			<View style={componentStyles.spreadTextWrapper}>
				<View style={componentStyles.teamMemberNameWrapper}>
					<Avatar
						firstName={user.firstName}
						lastName={user.lastName}
						size="small"
						backgroundColor={pending ? styles.colors.grey : styles.colors.primary}
					/>
					<Text style={componentStyles.teamMemberName}>{name}</Text>
				</View>
				{getSecondaryInfo(teamMember)}
			</View>
		);

		return (
			<TappableListItem
				onPress={helpers.noop}
				title={contents}
				accessibilityLabel="Teammate tappable"
				analyticsData={{
					trackName: TrackingActions.TEAM_MEMBER_TAP,
					trackData: { status: pending ? 'Pending': 'Member' },
				}}
			/>
		);
	};

	renderTeamList = () => {
		if (!this.shouldShowInviteDialog()) {
			return (
				<View style={componentStyles.verticalSpace}>
					<ListView
						automaticallyAdjustContentInsets={false}
						dataSource={this.state.teamMembers}
						renderRow={this.renderTeamMember.bind(this, this.renderProjectOwner, false)}
					/>
				</View>
			);
		}
	};

	render() {
		return (
			<ScrollView
				style={[styles.elements.screenGreyLight, componentStyles.tab]}
				contentContainerStyle={this.getStyle()}
			>
				{this.renderInviteDialog()}
				{this.renderInviteTappable()}
				{this.renderTeamList()}
				{this.renderPendingTeamList()}
			</ScrollView>
		);
	}
}

TeamTab.displayName = 'Team Tab';

TeamTab.propTypes = {
	actions: PropTypes.object,
	error: PropTypes.string,
	projectId: PropTypes.number.isRequired,
	loading: PropTypes.bool,
	isResendingInvites: PropTypes.bool,
	modal: PropTypes.object,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
	teamInvitees: PropTypes.array,
	teamMembers: PropTypes.array,
};

TeamTab.defaultProps = {
	customerId: 0,
	selectedTabIndex: 0,
	teamInvitees: [],
	teamMembers: [],
};

const mapStateToProps = (state) => {
	return {
		customerId: state.userReducer.user.customerId,
		error: state.projectsReducer.error,
		inviteeError: state.teamReducer.inviteeError,
		isResendingInvites: state.teamReducer.isResendingInvites,
		loadError: state.teamReducer.error,
		loading: state.projectsReducer.isLoading,
		modal: state.referenceReducer.modal,
		teamInvitees: state.teamReducer.team.invitees,
		teamMembers: state.teamReducer.team.members,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getTeam,
			getInvitees,
			resendProjectInvite,
			resendAllInvitesForProject,
		}, dispatch),
	};
};


export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(withScreen(TeamTab)));
