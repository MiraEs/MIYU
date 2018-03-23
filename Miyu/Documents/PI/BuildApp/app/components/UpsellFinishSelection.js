'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import FinishDetailList from './finishDetailList';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSelectedFinish } from '../actions/UpsellActions';
import { trackState } from '../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({
	container: {
		backgroundColor: styles.colors.greyLight,
	},
	finishList: {
		padding: styles.measurements.gridSpace1,
		paddingBottom: 0,
		flex: 1,
	},
});

class UpsellFinishSelection extends Component {

	componentDidMount() {
		this.props.actions.trackState('build:app:upsellfinish');
	}

	onFinishSelected = (uniqueId) => {
		const { actions, optionId } = this.props;
		actions.setSelectedFinish({
			uniqueId,
			optionId,
		});
		this.props.navigator.pop();
	};

	render() {
		const { finishes, manufacturer, prevSelectedFinish } = this.props;
		return (
			<View style={[styles.elements.screen, componentStyles.container]}>
				<View style={componentStyles.finishList}>
					<FinishDetailList
						finishes={finishes}
						onFinishPress={this.onFinishSelected}
						manufacturer={manufacturer}
						prevSelectedFinish={prevSelectedFinish}
					/>
				</View>
			</View>
		);
	}

}

UpsellFinishSelection.route = {
	navigationBar: {
		visible: true,
		title: 'Select Finish',
	},
};

UpsellFinishSelection.propTypes = {
	actions: PropTypes.object.isRequired,
	finishes: PropTypes.arrayOf(PropTypes.shape({})),
	optionId: PropTypes.string,
	manufacturer: PropTypes.string,
	prevSelectedFinish: PropTypes.object.isRequired,
	navigator: PropTypes.shape({
		pop: PropTypes.func,
	}),
};

UpsellFinishSelection.defaultProps = {
	onFinishSelected: helpers.noop,
};

const mapStateToProps = ({ upsellReducer }, { optionId }) => {
	const recommendedOption = upsellReducer.recommendedOptions.find((option) => option.id === optionId);
	const suggestedOption = upsellReducer.accessories.find((option) => option.id === optionId);
	let selectedDrop;
	if (recommendedOption) {
		selectedDrop = recommendedOption.selectedDrop;
	} else if (suggestedOption) {
		selectedDrop = suggestedOption.productDrop;
	}
	const { selectedFinish } = recommendedOption || suggestedOption;
	if (selectedDrop) {
		return {
			manufacturer: selectedDrop.manufacturer,
			finishes: selectedDrop.finishes,
			prevSelectedFinish: selectedFinish,
		};
	} else {
		return {};
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			setSelectedFinish,
			trackState,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(UpsellFinishSelection);
