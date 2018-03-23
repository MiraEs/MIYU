'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	InteractionManager,
	View,
	StyleSheet,
} from 'react-native';
import { ScrollView } from 'BuildLibrary';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getEventTitle } from '../lib/helpers';
import {
	resetSingleEventData,
	getEvent,
	saveComment,
} from '../actions/SingleEventActions';
import Event from '../components/Event';
import LoadError from '../components/loadError';
import LoadingView from '../components/LoadingView';
import styles from '../lib/styles';
import { trackState } from '../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({
	eventContainer: {
		paddingTop: styles.measurements.gridSpace1,
	},
});

export class SingleEventScreen extends Component {

	constructor(props) {
		super(props);
		this.state = { reroutePending: true };
	}

	getChildContext() {
		return {
			actions: this.props.actions,
		};
	}

	componentDidMount() {
		const {
			actions,
			title,
			eventId,
		} = this.props;
		actions.trackState('build:app:singleevent', {
			event: getEventTitle(title),
			eventId,
		});
		setTimeout(() => {
			const { eventId, customerId, actions } = this.props;
			actions.getEvent({ eventId, customerId });
		}, 500);
	}

	componentWillReceiveProps({ isLoading, event }) {
		if (this.props.isLoading && !isLoading) {
			InteractionManager.runAfterInteractions(() => {
				if (event && event.comments && !event.comments.length) {
					this.navigateEvent(event);
				} else {
					this.setState({ reroutePending: false });
				}
			});
		}
	}

	componentWillUnmount() {
		const { actions } = this.props;
		actions.resetSingleEventData();
	}

	navigateEvent = (event) => {
		switch (event.eventType) {
			case 'FAVORITE_LIST': {
				if (!event.projectName) {
					this.props.navigator.replace('favoritesList', {
						favoriteId: event.favoriteId,
					});
				} else {
					this.setState({ reroutePending: false });
				}
				break;
			}
			case 'ORDER': {
				this.props.navigator.replace('orderDetails', {
					orderNumber: event.orderNumber,
				});
				break;
			}
			case 'RETURN': {
				this.props.navigator.replace('returnDetails', {
					returnId: event.returnId,
				});
				break;
			}
			case 'TRACKING': {
				this.props.navigator.replace('orderTracking', {
					orderNumber: event.orderNumber,
				});
				break;
			}
			case 'QUOTE': {
				this.props.navigator.replace('quoteScreen', {
					quoteNumber: event.quoteNumber,
				});
				break;
			}
			default:
				this.setState({ reroutePending: false });
				this.props.navigator.updateCurrentRouteParams({
					event,
				});
		}
	};

	renderEvent = () => {
		return (
			<ScrollView
				style={[this.props.fromNotificationClick ? {} : styles.elements.screenWithHeader, styles.feedEvents.background, componentStyles.eventContainer]}
			>
				<Event
					event={this.props.event}
					eventStoreType="singleEvent"
				/>
			</ScrollView>
		);
	};

	render() {
		if (this.props.isLoading || this.state.reroutePending) {
			return <LoadingView />;
		}

		if (this.props.error) {
			return <LoadError message={this.props.error}/>;
		}
		if (this.props.fromNotificationClick) {
			return (
				<View style={styles.elements.flex}>
					{this.renderEvent()}
				</View>
			);
		}
		return this.renderEvent();
	}

}

SingleEventScreen.route = {
	navigationBar: {
		title(props) {
			return props.event && props.event.eventType ? getEventTitle(props.event.eventType) : '';
		},
		visible: true,
	},
};

SingleEventScreen.displayName = 'Single Event Screen';

SingleEventScreen.propTypes = {
	actions: PropTypes.object.isRequired,
	customerId: PropTypes.number.isRequired,
	error: PropTypes.string.isRequired,
	event: PropTypes.object.isRequired,
	eventId: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]).isRequired,
	isLoading: PropTypes.bool.isRequired,
	fromNotificationClick: PropTypes.bool,
	title: PropTypes.string,
	navigator: PropTypes.shape({
		pop: PropTypes.func,
		replace: PropTypes.func,
		updateCurrentRouteParams: PropTypes.func,
	}),
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
};

SingleEventScreen.childContextTypes = {
	actions: PropTypes.object,
};

export default connect((state) => {
	return {
		customerId: state.userReducer.user.customerId,
		error: state.singleEventReducer.error,
		event: state.singleEventReducer.event,
		isLoading: state.singleEventReducer.isLoading,
	};
}, (dispatch) => {
	return {
		actions: bindActionCreators({
			resetSingleEventData,
			getEvent,
			saveComment,
			trackState,
		}, dispatch),
	};
})(SingleEventScreen);
