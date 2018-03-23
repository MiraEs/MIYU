'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../../lib/styles';
import ProductList from './ProductList';
import Comments from './Comments';
import pluralize from 'pluralize';
import { withNavigation } from '@expo/ex-navigation';

@withNavigation
class FavoriteEvent extends Component {

	constructor(props) {
		super(props);
		this.displayName = 'Favorite Event';
	}

	getItemCountText() {
		const count = this.props.event.items ? this.props.event.items.length : 0;
		return pluralize('Item', count, true);
	}

	render() {
		return (
			<View style={styles.feedEvents.section}>
				<View style={[styles.feedEvents.heading, styles.feedEvents.padding]}>
					<View>
						<Image
							source={require('../../images/event-favorite-icon.png')}
							style={styles.feedEvents.icon}
						/>
					</View>
					<View style={styles.feedEvents.headingText}>
						<TouchableOpacity
							onPress={() => {
								this.props.navigator.push('favoritesList', {
									favoriteId: this.props.event.favoriteId,
								});
							}}
						>
							<Text style={styles.feedEvents.creator}>{this.props.event.name}</Text>
						</TouchableOpacity>
						<Text style={styles.feedEvents.boldGray}>Favorites List</Text>
					</View>
				</View>
				<View style={styles.feedEvents.padding}>
					<Text style={styles.feedEvents.boldGray}>{this.getItemCountText()}</Text>
					<ProductList
						event={this.props.event}
						products={this.props.event.items || []}
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

FavoriteEvent.propTypes = {
	event: PropTypes.object.isRequired,
	eventStoreType: PropTypes.string.isRequired,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
};

module.exports = FavoriteEvent;
