import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import PinToKeyboard from '../../PinToKeyboard';
import { LinkButton } from 'BuildLibrary';
import helpers from '../../../lib/helpers';
import styles from '../../../lib/styles';
import EventEmitter from '../../../lib/eventEmitter';
import dismissKeyboard from 'dismissKeyboard';


const componentStyles = StyleSheet.create({
	done: {
		flex: 1,
		alignItems: 'flex-end',
		justifyContent: 'center',
		backgroundColor: styles.colors.white,
		paddingRight: styles.measurements.gridSpace2,
		borderTopWidth: styles.dimensions.borderWidth,
		borderTopColor: styles.colors.greyLight,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.greyLight,
	},
});

class InputAccessoryView extends Component {

	render() {

		if (helpers.isAndroid() || this.props.isAccessoryHidden) {
			return null;
		}

		return (
			<PinToKeyboard
				hideInitially={true}
				height={styles.dimensions.iosBottomBarHeight}
			>
				<View style={componentStyles.done}>
					<LinkButton
						onPress={() => {
							dismissKeyboard();
							EventEmitter.emit('dismissKeyboard');
						}}
						lineHeight={false}
					>
						Done
					</LinkButton>
				</View>
			</PinToKeyboard>
		);
	}

}

InputAccessoryView.propTypes = {
	isAccessoryHidden: PropTypes.bool,
};

InputAccessoryView.defaultProps = {
	isAccessoryHidden: false,
};

export default InputAccessoryView;
