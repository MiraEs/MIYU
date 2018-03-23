import {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import lookbackConstants from '../constants/LookbackConstants';
import lookbackActions from '../actions/LookbackActions';

export class LookbackScreen extends Component {

	render() {
		return null;
	}

}

LookbackScreen.propTypes = {
	actions: PropTypes.shape({
		startLookbackRecording: PropTypes.func,
		stopLookbackRecording: PropTypes.func,
	}),
	lookbackStatus: PropTypes.oneOf([
		lookbackConstants.RECORDING_STATUS_STOPPED,
		lookbackConstants.RECORDING_STATUS_RECORDING,
		lookbackConstants.RECORDING_STATUS_INACTIVE,
	]),
};

const mapStateToProps = (state) => {
	return {
		lookbackStatus: state.lookbackReducer.status,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			startLookbackRecording: lookbackActions.startLookbackRecording,
			stopLookbackRecording: lookbackActions.stopLookbackRecording,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LookbackScreen);
