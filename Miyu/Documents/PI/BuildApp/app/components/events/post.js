'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Image,
	StyleSheet,
	ActivityIndicator,
	Dimensions,
} from 'react-native';
import {
	Text,
} from 'build-library';
import styles from '../../lib/styles';
import Comments from './Comments';
import Avatar from '../Avatar';
import {
	ADD_PENDING,
	ADD_FAIL,
} from '../../constants/constants';
import helpers from '../../lib/helpers';
import helpersWithLoadRequirements from '../../lib/helpersWithLoadRequirements';
import FailedToPostButton from '../FailedToPostButton';
import ParsedText from 'react-native-parsed-text';

const {
	width,
} = Dimensions.get('window');

const componentStyles = StyleSheet.create({
	headingRow: {
		flexDirection: 'row',
	},
	photoContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'stretch',
		backgroundColor: '#F5FCFF',
	},
	photo: {
		height: 350,
	},
	demoPhoto: {
		height: 350,
		width: width - 20,
	},
	spinner: {
		alignItems: 'flex-end',
	},
});

class PostEvent extends Component {

	constructor(props) {
		super(props);
		this.displayName = 'Post Event';
	}

	getPostType() {
		if (this.props.event.photos.length) {
			return 'Photo';
		}
		return 'Post';
	}

	getEventStyles() {
		const style = styles.feedEvents.section;
		if (this.props.event._status === ADD_PENDING) {
			return [style, {
				opacity: 0.5,
			}];
		}
		return style;
	}

	/**
	 * The project name if needed for the given feed
	 * @return {string} The project name if needed
	 */
	getProjectName() {
		return (
			this.props.isGlobalFeed ? ` in ${this.props.event.projectName}` : ''
		);
	}

	/**
	 * Retry posting a failed post
	 * @return {undefined} No return value
	 */
	retryPost() {
		const { actions } = this.context;
		const { eventType, message, projectId, photos, _id } = this.props.event;
		actions.saveComment({
			eventType,
			message,
			projectId,
			photos,
			_id,
		});
	}

	renderMessage() {
		if (this.props.event.message && this.props.event.message.length > 0) {
			return (
				<View>
					<ParsedText
						parse={[{
							type: 'url',
							style: styles.elements.link,
							onPress: helpersWithLoadRequirements.openURL,
						}]}
						style={styles.feedEvents.postText}
					>
						{this.props.event.message}
					</ParsedText>
				</View>
			);
		}
	}

	renderPhotos() {
		return this.props.event.photos.map((photo, index) => {
			let source;
			let style;
			if (typeof photo === 'number') {
				// if this is a number that means it's an image reference
				// example: require('../../images/blah-blah-blah.jpg')
				// this happens when we are using fake data to populate the feed
				// and are referencing an image that's bundled with the app
				source = photo;
				style = componentStyles.demoPhoto;
			} else {
				source = {
					uri: helpers.getResizedImageForUrl(photo, 355),
				};
				style = componentStyles.photo;
			}
			return (
				<Image
					key={`post-photo-${index}`}
					resizeMode="cover"
					source={source}
					style={style}
				/>
			);
		});
	}

	renderPhotosContainer() {
		if (this.props.event.photos.length) {
			return (
				<View
					style={componentStyles.photoContainer}
				>
					{this.renderPhotos.call(this)}
				</View>
			);
		}
	}

	/**
	 * In case a post fails to save to server render the error message to Retry
	 * @return {element} button with error message
	 */
	renderError() {
		if (this.props.event._status === ADD_FAIL) {
			return (
				<FailedToPostButton
					onPress={this.retryPost.bind(this)}
				/>
			);
		}
	}

	renderSpinner() {
		if (this.props.event._status === ADD_PENDING) {
			return (
				<View
					style={componentStyles.spinner}
				>
					<ActivityIndicator />
				</View>
			);
		}
	}

	render() {
		return (
			<View
				ref="eventComponent"
				style={this.getEventStyles.call(this)}
			>
				<View style={[styles.feedEvents.heading, styles.feedEvents.padding]}>
					<View>
						<Avatar
							fullName={this.props.event.user.name}
							firstName={this.props.event.user.firstName}
							lastName={this.props.event.user.lastName}
							style={styles.feedEvents.icon}
							url={this.props.event.user.avatar}
						/>
					</View>
					<View style={styles.feedEvents.headingText}>
						<View
							style={componentStyles.headingRow}
							numberOfLines={1}
						>
							<Text style={styles.feedEvents.creator}>{this.props.event.user.name}</Text>
							{this.renderError.call(this)}
							{this.renderSpinner.call(this)}
						</View>
						<Text size="small">
							{this.getPostType.call(this)}
							{this.getProjectName.call(this)}
							{' '}•{' '}{helpers.getDate(this.props.event.createdDate)}
						</Text>
					</View>
				</View>
				<View style={styles.feedEvents.body}>
					{this.renderMessage.call(this)}
					{this.renderPhotosContainer.call(this)}
				</View>
				<Comments
					comments={this.props.event.comments}
					eventId={this.props.event.eventId}
					eventStoreType={this.props.eventStoreType}
					disabled={this.props.event._status === ADD_PENDING || this.props.event._status === ADD_FAIL}
				/>
			</View>
		);
	}

}

PostEvent.propTypes = {
	event: PropTypes.shape({
		_id: PropTypes.number,
		eventId: PropTypes.number.isRequired,
		comments: PropTypes.array,
		message: PropTypes.string,
		projectName: PropTypes.string.isRequired,
		createdDate: PropTypes.number.isRequired,
		photos: PropTypes.array,
		_status: PropTypes.string,
		user: PropTypes.shape({
			name: PropTypes.string.isRequired,
			firstName: PropTypes.string,
			lastName: PropTypes.string,
			avatar: PropTypes.string,
		}),
		projectId: PropTypes.number,
		eventType: PropTypes.string,
	}),
	isGlobalFeed: PropTypes.bool,
	eventStoreType: PropTypes.string.isRequired,
};

PostEvent.contextTypes = {
	actions: PropTypes.object.isRequired,
};

export default PostEvent;
