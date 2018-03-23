'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import TrackingEvent from './events/Tracking';
import FavoriteEvent from './events/favorite';
import OrderEvent from './events/Order';
import PostEvent from './events/post';
import TeamMemberEvent from './events/teamMember';
import TeamExpertEvent from './events/teamExpert';
import OnboardingEvent from './events/Onboarding';

export default class Event extends Component {

	render() {
		const { event, eventStoreType, isGlobalFeed } = this.props;

		switch (event.eventType) {

			case 'POST':
				return (
					<PostEvent
						event={event}
						eventStoreType={eventStoreType}
						isGlobalFeed={isGlobalFeed}
					/>
				);

			case 'TRACKING':
				return (
					<TrackingEvent
						event={event}
						eventStoreType={eventStoreType}
					/>
				);

			case 'FAVORITE_LIST':
				return (
					<FavoriteEvent
						event={event}
						eventStoreType={eventStoreType}
					/>
				);

			case 'ORDER':
				return (
					<OrderEvent
						event={event}
						eventStoreType={eventStoreType}
					/>
				);

			case 'TEAM_MEMBER':
				return (
					<TeamMemberEvent
						event={event}
						eventStoreType={eventStoreType}
					/>
				);

			case 'TEAM_EXPERT':
				return (
					<TeamExpertEvent
						event={event}
						eventStoreType={eventStoreType}
					/>
				);

			// this is an app specific event type
			// no events from the API will come back with this event type
			case 'ONBOARDING':
				return (
					<OnboardingEvent event={event} />
				);

			default:
				return null;
		}

	}

}

Event.propTypes = {
	event: PropTypes.object,
	eventStoreType: PropTypes.string,
	isGlobalFeed: PropTypes.bool,
};

Event.defaultProps = {
	isGlobalFeed: false,
};
