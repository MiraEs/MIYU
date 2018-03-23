import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	TouchableOpacity,
} from 'react-native';
import store from '../../../store/configStore';
import { trackAction } from '../../../actions/AnalyticsActions';

export default class BuildTouchableOpacity extends Component {

	measure = (onMeasure) => {
		if (this.ref) {
			this.ref.measure(onMeasure);
		}
	};

	render() {
		return (
			<TouchableOpacity
				{...this.props}
				onPress={() => {
					store.dispatch(trackAction(
						this.props.trackAction,
						this.props.trackContextData,
					));
					this.props.onPress();
				}}
				ref={(ref) => {
					if (ref) {
						this.ref = ref;
					}
				}}
			>
				{this.props.children}
			</TouchableOpacity>
		);
	}

}

BuildTouchableOpacity.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.string,
		PropTypes.element,
		PropTypes.number,
	]),
	onPress: PropTypes.func.isRequired,
	trackAction: PropTypes.string.isRequired,
	trackContextData: PropTypes.object,
};
