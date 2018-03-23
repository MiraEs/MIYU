import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import styles from '../lib/styles';
import {
	Image,
	Text,
	TouchableOpacity,
} from 'BuildLibrary';
import environment from '../lib/environment';
import TrackingActions from '../lib/analytics/TrackingActions';
import ContactUsHelper from '../lib/ContactUsHelper';
import PhoneHelper from '../lib/PhoneHelper';

const componentStyles = StyleSheet.create({
	button: {
		marginVertical: styles.measurements.gridSpace1,
		marginHorizontal: styles.measurements.gridSpace4,
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
		padding: styles.measurements.gridSpace9,

	},
	image: {
		width: 200,
		height: 100,
		marginBottom: styles.measurements.gridSpace4,
	},
	largeText: {
		marginBottom: styles.measurements.gridSpace2,
	},
	retry: {
		padding: styles.measurements.gridSpace1,
		marginTop: styles.measurements.gridSpace4,
	},
});

export default class ContentError extends Component {

	render() {
		return (
			<View style={componentStyles.container}>
				<Image
					style={componentStyles.image}
					resizeMode="contain"
					source={require('../images/home-screen-logo.png')}
				/>
				<Text
					textAlign="center"
					weight="bold"
					size="larger"
					style={componentStyles.largeText}
				>
					We will be back soon
				</Text>
				<Text textAlign="center">
					Our apologies, please check back shortly or call us at{' '}
						<Text
							onPress={() => ContactUsHelper.callUs({ phone: environment.phone })}
							weight="bold"
							color="primary"
						>
							{PhoneHelper.formatPhoneNumber({ phoneNumber: environment.phone})}
						</Text> to talk to a Build expert
				</Text>
				<TouchableOpacity
					onPress={this.props.retry}
					accessibilityLabel="Content Error Retry"
					trackAction={TrackingActions.CONTENT_ERROR_RETRY}
					style={componentStyles.retry}
				>
					<Text
						textAlign="center"
						decoration="underline"
						color="primary"
					>
						Retry
					</Text>
				</TouchableOpacity>
			</View>
		);
	}

}

ContentError.propTypes = {
	retry: PropTypes.func.isRequired,
};
