'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
import { Text } from 'BuildLibrary';
import styles from '../lib/styles';

const componentStyles = StyleSheet.create({
	filterBar: {
		flexDirection: 'row',
		backgroundColor: styles.colors.white,
		paddingHorizontal: styles.measurements.gridSpace1,
		borderTopColor: styles.colors.greyLight,
		borderTopWidth: styles.dimensions.borderWidth,
	},
	filterItem: {
		padding: styles.measurements.gridSpace1,
		marginHorizontal: styles.measurements.gridSpace1,
		borderTopWidth: styles.dimensions.borderWidthLarge,
	},
});

class EventsFilters extends Component {

	constructor(props) {
		super(props);
		this.state = {
			selectedTabIndex: 0,
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state.selectedTabIndex !== nextState.selectedTabIndex;
	}

	onPress = (type, index) => {
		this.setState({
			selectedTabIndex: index,
		});
		this.props.onFilterPress(type);
	};

	renderFilters = () => {
		return this.props.filters.map((filter, index) => {
			if (filter.enabled !== false) {
				const filterStyle = { borderTopColor: this.state.selectedTabIndex === index ? styles.colors.accent : styles.colors.white };
				return (
					<TouchableOpacity
						key={`filter-${index}`}
						onPress={this.onPress.bind(this, filter.type, index)}
						style={[
							componentStyles.filterItem,
							filterStyle,
						]}
					>
						<Text lineHeight={false}>{filter.text}</Text>
					</TouchableOpacity>
				);
			}
		});
	};

	render() {
		return (
			<View style={componentStyles.filterBar}>
				{this.renderFilters()}
			</View>
		);
	}

}

EventsFilters.propTypes = {
	filters: PropTypes.arrayOf(PropTypes.shape({
		text: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		enabled: PropTypes.bool,
	})),
	onFilterPress: PropTypes.func.isRequired,
};

module.exports = EventsFilters;
