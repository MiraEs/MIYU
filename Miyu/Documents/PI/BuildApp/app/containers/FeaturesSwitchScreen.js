import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	ScrollView,
	Switch,
	View,
} from 'react-native';
import styles from '../lib/styles';
import { Text } from 'BuildLibrary';
import featureSwitchActions from '../actions/FeatureSwitchActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const componentStyles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: styles.measurements.gridSpace2,
	},
});

export class FeaturesSwitchScreen extends Component {

	onSwitchChange = (enabled, feature) => {
		const { features, actions } = this.props;
		if (features[feature] && features[feature].hasOwnProperty('default')) {
			actions.setFeatureWithExpiration({
				[feature]: {
					...features[feature],
					enabled,
				},
			});
		} else {
			actions.setFeatureState(feature, enabled);
		}
	};

	getFeatureValue = (feature) => {
		if (feature && feature.hasOwnProperty('default')) {
			return feature.enabled;
		}
		return feature;
	};

	render() {
		const { features } = this.props;
		const switches = [];
		for (const feature in features) {
			if (features.hasOwnProperty(feature)) {
				switches.push(
					<View
						key={switches.length}
						style={componentStyles.row}
					>
						<Text
							weight="bold"
							capitalize="first"
						>
							{feature}
						</Text>
						<Switch
							value={this.getFeatureValue(features[feature])}
							onValueChange={(value) => this.onSwitchChange(value, feature)}
						/>
					</View>
				);
			}
		}
		return (
			<ScrollView style={styles.elements.screenWithHeader}>
				{switches}
			</ScrollView>
		);
	}

}

FeaturesSwitchScreen.route = {
	navigationBar: {
		title: 'Feature Switches',
	},
};

FeaturesSwitchScreen.propTypes = {
	actions: PropTypes.object.isRequired,
	features: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
	return {
		features: state.featuresReducer.features,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			setFeatureState: featureSwitchActions.setFeatureState,
			setFeatureWithExpiration: featureSwitchActions.setFeatureWithExpiration,
		}, dispatch),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(FeaturesSwitchScreen);
