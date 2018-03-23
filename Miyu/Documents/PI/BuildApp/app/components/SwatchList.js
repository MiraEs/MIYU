import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	ListView,
	StyleSheet,
} from 'react-native';
import SwatchImage from './SwatchImage';

const componentStyles = StyleSheet.create({
	listView: {
		height: 42,
	},
});

export default class SwatchList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2,
			}).cloneWithRows(props.finishes),
		};
	}

	componentWillReceiveProps({ finishes, width }) {
		this.swatchesCapacity = Math.floor(width / 35);
		const swatches = finishes.slice(0, this.swatchesCapacity)
		.map(({ hexValue, styleValue, uniqueId }) => {
			return {
				finishSwatch: {
					hexValue,
					styleValue,
				},
				uniqueId,
			};
		});
		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(swatches),
		});
	}

	renderRow = (finish, section, index) => {
		const { swatchesCapacity, props: { finishes, selectedFinishId } } = this;
		let moreCount;
		if (this.swatchesCapacity - 1 === parseInt(index, 10) && swatchesCapacity < finishes.length) {
			moreCount = finishes.length - swatchesCapacity + 1;
		}
		return (
			<SwatchImage
				finish={finish}
				selected={selectedFinishId === finish.uniqueId}
				moreCount={moreCount}
			/>
		);
	};

	render() {
		return (
			<ListView
				style={componentStyles.listView}
				horizontal={true}
				dataSource={this.state.dataSource}
				renderRow={this.renderRow}
				scrollEnabled={false}
				showHorizontalScrollIndicator={false}
				enableEmptySections={true}
			/>
		);
	}

}

SwatchList.propTypes = {
	finishes: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	selectedFinishId: PropTypes.number,
};
