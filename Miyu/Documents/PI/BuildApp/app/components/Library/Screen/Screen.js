import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	InteractionManager,
	View,
	ViewPropTypes,
} from 'react-native';
import styles from '../../../lib/styles';
import LoadingView from '../../../components/LoadingView';
import helpers from '../../../lib/helpers';


export default class Screen extends Component {

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			this.props.screenWillLoad();
		});
	}

	componentWillReceiveProps(nextProps) {
		const { refresh, screenWillLoad } = nextProps;
		if (refresh && screenWillLoad) {
			screenWillLoad();
		}
	}

	render() {
		const { children, loading, style } = this.props;
		if (loading) {
			return <LoadingView/>;
		}
		return (
			<View style={style || styles.elements.screenWithHeaderGreyLight}>
				{children}
			</View>
		);
	}

}

Screen.propTypes = {
	loading: PropTypes.bool,
	children: PropTypes.any,
	refresh: PropTypes.bool,
	screenWillLoad: PropTypes.func,
	style: ViewPropTypes.style,
};

Screen.defaultProps = {
	refresh: false,
	screenWillLoad: helpers.noop,
};
