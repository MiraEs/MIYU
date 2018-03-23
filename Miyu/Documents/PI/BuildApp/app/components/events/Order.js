'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native';
import styles from '../../lib/styles';
import ProductList from './ProductList';
import Comments from './Comments';
import pluralize from 'pluralize';

class Order extends Component {

	constructor(props) {
		super(props);
		this.getNumberItemsText = this.getNumberItemsText.bind(this);
	}

	getNumberItemsText() {
		const count = this.props.event.items ? this.props.event.items.length : 0;
		return pluralize('Item', count, true);
	}

	render() {

		return (
			<View style={styles.feedEvents.section}>
				<View style={[styles.feedEvents.heading, styles.feedEvents.padding]}>
					<View>
						<Image
							source={require('../../images/event-order-icon.png')}
							style={styles.feedEvents.icon}
						/>
					</View>
					<View style={styles.feedEvents.headingText}>
						<Text style={styles.feedEvents.creator}>Order #{this.props.event.orderNumber} Created</Text>
						<Text style={styles.feedEvents.boldGray}>New Order Placed</Text>
					</View>
				</View>
				<View style={[styles.feedEvents.body, styles.feedEvents.padding]}>
					<Text style={styles.feedEvents.boldGray}>{this.getNumberItemsText()}</Text>
					<ProductList
						event={this.props.event}
						products={this.props.event.items}
					/>
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

Order.defaultProps = {
	items: [],
};

Order.propTypes = {
	event: PropTypes.object,
	eventStoreType: PropTypes.string.isRequired,
};

module.exports = Order;
