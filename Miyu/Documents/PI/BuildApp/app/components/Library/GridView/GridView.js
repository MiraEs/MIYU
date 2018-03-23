'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';

import {
	View,
	StyleSheet,
} from 'react-native';
import { ListView } from 'BuildLibrary';
import helpers from '../../../lib/helpers';

const componentStyles = StyleSheet.create({
	group: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
	},
});

class GridView extends Component {

	constructor(props) {
		super(props);

		const groups = this.groupItems(props.items, props.itemsPerRow);
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2,
			}).cloneWithRows(groups),
		};
	}

	componentWillReceiveProps({ items, itemsPerRow }) {
		if (items !== this.props.items) {
			const groups = this.groupItems(items, itemsPerRow);
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(groups),
			});
		}
	}

	groupItems = (items, itemsPerRow) => {
		if (this.props.maxItems) {
			items = items.slice(0, this.props.maxItems);
		}
		const itemsGroups = [];
		let group = [];
		items.forEach((item) => {
			if (group.length === itemsPerRow) {
				itemsGroups.push(group);
				group = [item];
			} else {
				group.push(item);
			}
		});

		if (group.length > 0) {
			itemsGroups.push(group);
		}

		return itemsGroups;
	};

	renderGroup = (group) => {
		const items = group.map((item, index) => {
			return this.props.renderItem(item, index);
		});
		return (
			<View style={componentStyles.group}>
				{items}
			</View>
		);
	};


	scrollTo = (props) => {
		if (this.list && typeof this.list.scrollTo === 'function') {
			this.list.scrollTo(props);
		}
	};

	render() {
		return (
			<ListView
				ref={(ref) => {
					if (ref) {
						this.list = ref;
					}
				}}
				{...this.props}
				renderRow={this.renderGroup}
				dataSource={this.state.dataSource}
			/>
		);
	}

}

GridView.propTypes = {
	items: PropTypes.array.isRequired,
	itemsPerRow: PropTypes.number.isRequired,
	renderItem: PropTypes.func.isRequired,
	maxItems: PropTypes.number,
};

GridView.defaultProps = {
	items: [],
	itemsPerRow: 2,
	renderItem: helpers.noop,
};

export default GridView;
