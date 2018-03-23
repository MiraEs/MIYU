'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {View, Text, Image } from 'react-native';
import styles from '../../lib/styles';
import Avatar from '../Avatar';
import Comments from './Comments';

class TeamMemberComponent extends Component {

	constructor(props) {
		super(props);
		this.displayName = 'Team Member Component';
	}

	_getUserAvatar() {
		if (this.props.event.image) {
			return (
				<Image
					source={require('../../images/event-shipping-icon.png')}
					style={styles.feedEvents.icon}
				/>
			);
		}
		return (
			<Avatar
				fullName={this.props.event.user.name}
				firstName={this.props.event.user.firstName}
				lastName={this.props.event.user.lastName}
				url={this.props.event.user.avatar}
			/>
		);

	}

	render() {
		return (
			<View style={styles.feedEvents.section}>
				<View style={[styles.feedEvents.heading, styles.feedEvents.padding]}>
					<View>
						{this._getUserAvatar.call(this)}
					</View>
					<View style={styles.feedEvents.headingText}>
						<Text style={styles.feedEvents.creator}>{this.props.event.user.name}</Text>
						<Text style={styles.feedEvents.boldGray}>Team Member</Text>
					</View>
				</View>
				<View style={[styles.feedEvents.body, styles.feedEvents.padding]}>
					<Text style={{ color: styles.colors.mediumDarkGray, fontFamily: styles.fonts.mainRegular }}>Part of the team for {this.props.event.projectName}.</Text>
				</View>
				<Comments
					comments={this.props.event.comments}
					eventId={this.props.event.eventId}
					eventStoreType={this.props.eventStoreType}
				/>
			</View>
		);
	}

}

TeamMemberComponent.propTypes = {
	event: PropTypes.shape({
		eventId: PropTypes.number.isRequired,
		image: PropTypes.string,
		projectName: PropTypes.string,
		comments: PropTypes.array,
		user: PropTypes.shape({
			name: PropTypes.string,
			firstName: PropTypes.string,
			lastName: PropTypes.string,
			avatar: PropTypes.string,
		}),
	}),
	eventStoreType: PropTypes.string.isRequired,
};

module.exports = TeamMemberComponent;
