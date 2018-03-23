'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import { Text } from 'BuildLibrary';
import styles from '../../lib/styles';
import environment from '../../lib/environment';
import EventEmitter from '../../lib/eventEmitter';
import PhoneHelper from '../../lib/PhoneHelper';

const componentStyles = StyleSheet.create({
	mCtaBox: {
		paddingHorizontal: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace2,
	},
});

class ManufacturerCallToAction extends Component {
	render() {
		const { manufacturerCallToAction } = this.props;

		if (manufacturerCallToAction && !manufacturerCallToAction.active) {
			return null;
		}

		const phone = {
			phoneNumber: environment.manufacturerCallToActionPhone,
		};

		return (
			<View style={componentStyles.mCtaBox}>
				<Text
					color="accent"
					weight="bold"
				>
					{manufacturerCallToAction.title}
				</Text>
				<Text>
					<Text
						color="primary"
						onPress={() => EventEmitter.emit('onCallUs', phone)}
					>
						Call {PhoneHelper.formatPhoneNumber(phone)}{' '}
					</Text>
					{manufacturerCallToAction.description}
				</Text>
			</View>
		);
	}
}

ManufacturerCallToAction.propTypes = {
	manufacturerCallToAction: PropTypes.shape({
		title: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
		active: PropTypes.bool.isRequired,
	}).isRequired,
};

export default ManufacturerCallToAction;
