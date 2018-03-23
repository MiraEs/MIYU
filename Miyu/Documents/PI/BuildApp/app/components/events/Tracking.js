'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../../lib/styles';
import Comments from './Comments';
import helpersWithLoadRequirements from '../../lib/helpersWithLoadRequirements';

class Tracking extends Component {

	constructor(props) {
		super(props);
		this.openTrackingWebView = this.openTrackingWebView.bind(this);
		this._renderTackingNumberList = this._renderTackingNumberList.bind(this);
	}

	openTrackingWebView(url) {
		helpersWithLoadRequirements.openURL(url);
	}

	_renderTackingNumberList(shippers) {
		if (!shippers) {
			return null;
		}
		return shippers.map((shipper) => {

			return shipper.trackingNumbers.map((number) => {
				if (number && number.trackingLink) {
					return (
						<TouchableOpacity
							onPress={() => {this.openTrackingWebView(number.trackingLink);}}
						>
							<Text style={[styles.text.bold, styles.elements.link]}>{number.trackingNumber}</Text>
						</TouchableOpacity>
					);
				} else {
					return (<Text style={styles.text.bold}>{number.trackingNumber}</Text>);
				}
			});
		});
	}

	render() {
		return (
			<View style={styles.feedEvents.section}>
				<View style={[styles.feedEvents.heading, styles.feedEvents.padding]}>
					<View>
						<Image
							source={require('../../images/event-shipping-icon.png')}
							style={styles.feedEvents.icon}
						/>
					</View>
					<View style={styles.feedEvents.headingText}>
						<Text style={styles.feedEvents.creator}>Order #{this.props.event.orderNumber} Tracking</Text>
						<Text style={styles.feedEvents.boldGray}>Items Have Shipped</Text>
					</View>
				</View>
				<View style={[styles.feedEvents.body, styles.feedEvents.padding]}>
					<Text style={styles.feedEvents.boldGray}>Tracking Numbers</Text>
					{this._renderTackingNumberList(this.props.event.trackingInfo)}
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

Tracking.propTypes = {
	event: PropTypes.object.isRequired,
	eventStoreType: PropTypes.string.isRequired,
};

module.exports = Tracking;
