'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Image,
	ActivityIndicator,
} from 'react-native';
import { ListView } from 'BuildLibrary';
import {
	ADD_PENDING,
	ADD_FAIL,
	EXPERT,
} from '../../constants/constants';
import styles from '../../lib/styles';
import Avatar from '../Avatar';
import router from '../../router';
import helpers from '../../lib/helpers';
import helpersWithLoadRequirements from '../../lib/helpersWithLoadRequirements';
import FailedToPostButton from '../FailedToPostButton';
import ParsedText from 'react-native-parsed-text';
import { navigatorPush } from '../../actions/NavigatorActions';

const componentStyles = StyleSheet.create({
	actionButtons: {
		flex: 1,
		flexDirection: 'row',
	},
	hasComments: {
		marginTop: styles.measurements.gridSpace1,
	},
	row: {
		flexDirection: 'row',
	},
	commentItem: {
		flexDirection: 'row',
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingBottom: styles.measurements.gridSpace2,
	},
	commentCreatorText: {
		color: '#353535',
		flex: 1,
		fontFamily: styles.fonts.mainBold,
	},
	commentMessageText: {
		fontWeight: '400',
		color: '#353535',
		fontFamily: styles.fonts.mainRegular,
	},
	commentTexts: {
		flex: 1,
	},
	avatar: {
		marginRight: styles.measurements.gridSpace1,
		marginTop: 2,
	},
	addComment: {
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.mediumGray,
		marginBottom: styles.measurements.gridSpace1,
		marginHorizontal: styles.measurements.gridSpace1,
		padding: styles.measurements.gridSpace1,
		borderRadius: styles.measurements.borderRadius,
	},
	commentTimeStamp: {
		color: styles.colors.mediumGray,
		fontSize: 12,
		fontFamily: styles.fonts.mainRegular,
	},
	addCommentInputText: {
		color: styles.colors.mediumDarkGray,
		fontSize: 12,
	},
	commentAction: {
		color: styles.colors.mediumDarkGray,
		fontSize: 14,
		margin: styles.measurements.gridSpace1,
		fontFamily: styles.fonts.mainRegular,
	},
	divider: {
		borderTopWidth: styles.dimensions.borderWidth,
		borderTopColor: '#ccc',
		marginHorizontal: styles.measurements.gridSpace1,
	},
	spinner: {
		alignItems: 'flex-end',
	},
	photo: {
		marginTop: styles.measurements.gridSpace1,
		height: 200,
		width: 200,
	},
});

class Comments extends Component {

	constructor(props) {
		super(props);
		this.displayName = 'Commments Component';
	}

	/**
	 * Navigate to the comment modal and pass pertinent information about the event
	 */
	navigateToCommentModal = (mentionExpert) => {
		if (this.props.disabled) {
			return;
		}

		const optional = {};

		if (mentionExpert === true) {
			optional.shouldMentionExpert = true;
		}

		navigatorPush(router.getRoute('projectUpdate', {
			postType: 'comment',
			eventId: this.props.eventId,
			eventStoreType: this.props.eventStoreType,
			...optional,
		}), 'root');
	};

	/**
	 * Check if comments exist
	 */
	hasComments = () => {
		return this.props.comments && this.props.comments.length > 0;
	};

	/**
	 * Get the styles for the component with changes based on _status
	 * @param  {object} comment The comment data
	 * @return {array|object}       The styles for the component
	 */
	getCommentStyle = (comment) => {
		if (comment._status === ADD_PENDING) {
			return [componentStyles.commentItem, {
				opacity: 0.5,
			}];
		} else {
			return componentStyles.commentItem;
		}
	};

	/**
	 * Retry saving a comment which failed to save
	 * @param  {object} comment The comment that failed to save
	 * @return {undefined}         No return value
	 */
	retryComment = (comment) => {
		this.context.actions.saveComment({
			_id: comment._id,
			eventId: comment.eventId,
			message: comment.message,
			photos: comment.photos,
		});
	};

	/**
	 * If the comment has failed render the retry comment error button
	 * @param  {object} comment Comment data
	 * @return {element}        Failed button
	 */
	renderError = (comment) => {
		if (comment._status === ADD_FAIL) {
			return (
				<FailedToPostButton
					onPress={this.retryComment.bind(this, comment)}
				/>
			);
		}
	};

	renderCommentImages = (comment) => {
		if (comment.photos && comment.photos.length > 0) {
			return comment.photos.map((photo, index) => {
				return (
					<Image
						key={`comment-photo-${index}`}
						source={{
							uri: helpers.getResizedImageForUrl(photo, 200),
						}}
						style={componentStyles.photo}
					/>
				);
			});
		}
	};

	renderSpinner = (comment) => {
		if (comment && comment._status === ADD_PENDING) {
			return (
				<View
					style={componentStyles.spinner}
				>
					<ActivityIndicator />
				</View>
			);
		}
	};

	renderComment = (comment) => {
		return (
			<View
				key={comment.commentId}
				style={this.getCommentStyle.call(this, comment)}
			>
				<View style={componentStyles.avatar}>
					<Avatar
						fullName={comment.user.name}
						firstName={comment.user.firstName}
						lastName={comment.user.lastName}
						url={comment.user.avatar}
						size="small"
						textSize="textSmall"
					/>
				</View>
				<View style={componentStyles.commentTexts}>
					<View
						style={componentStyles.row}
					>
						<Text style={componentStyles.commentCreatorText}>{comment.user.name}</Text>
						{this.renderError(comment)}
						{this.renderSpinner(comment)}
					</View>
					<Text style={componentStyles.commentMessageText}>
						<ParsedText
							parse={[{
								type: 'url',
								style: styles.elements.link,
								onPress: helpersWithLoadRequirements.openURL,
							}]}
						>
							{comment.message}
						</ParsedText>
						<Text style={componentStyles.commentTimeStamp}>
							{` • ${helpers.getDate(comment.createdDate)}`}
						</Text>
					</Text>
					{this.renderCommentImages(comment)}
				</View>
			</View>
		);
	};

	renderCommentThread = () => {
		const ds = new ListView.DataSource({
			rowHasChanged: () => true,
		});
		return (
			<ListView
				scrollEnabled={false}
				dataSource={ds.cloneWithRows(this.props.comments)}
				renderRow={this.renderComment}
			/>
		);
	};

	renderCommentBlock = () => {
		if (!this.hasComments()) {
			return null;
		}

		return (
			<View style={componentStyles.hasComments}>
				{this.renderCommentThread.call(this)}
			</View>
		);
	};

	render() {
		return (
			<View>
				{this.renderCommentBlock.call(this)}
				<View style={componentStyles.divider}/>
				<View style={componentStyles.actionButtons}>
					<TouchableOpacity
						onPress={this.navigateToCommentModal.bind(this)}
						activeOpacity={5}
					>
						<Text style={componentStyles.commentAction}>Add Comment</Text>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={5}
						onPress={() => this.navigateToCommentModal.call(this, true)}
					>
						<Text style={componentStyles.commentAction}>{EXPERT}</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

}

Comments.propTypes = {
	comments: PropTypes.arrayOf(PropTypes.shape({
		user: PropTypes.shape({
			name: PropTypes.string.isRequired,
		}),
		createdDate: PropTypes.number.isRequired,
	})),
	eventId: PropTypes.number,
	eventStoreType: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
};

Comments.contextTypes = {
	actions: PropTypes.object.isRequired,
};

export default Comments;
