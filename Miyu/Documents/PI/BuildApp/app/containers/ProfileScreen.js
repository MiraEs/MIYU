import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';

import styles from '../lib/styles';
import helpers from '../lib/helpers';
import {
	IconButton,
	Image,
	withScreen,
	ScrollView,
	Text,
} from 'BuildLibrary';
import TrackingActions from '../lib/analytics/TrackingActions';
import ContactUsHelper from '../lib/ContactUsHelper';

const componentStyles = StyleSheet.create({
	buttons: {
		paddingTop: styles.measurements.gridSpace1,
		flexDirection: 'row',
	},
	callButton: {
		marginRight: styles.measurements.gridSpace1 / 2,
	},
	emailButton: {
		marginLeft: styles.measurements.gridSpace1 / 2,
	},
	container: {
		backgroundColor: styles.colors.greyLight,
		paddingTop: styles.measurements.gridSpace1,
	},
	card: {
		backgroundColor: styles.colors.white,
		marginHorizontal: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace1,
		borderWidth: 1,
		borderColor: styles.colors.grey,
		padding: styles.measurements.gridSpace1,
	},
	headerInfo: {
		flexWrap: 'wrap',
		flex: 1,
	},
	upper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	image: {
		marginRight: styles.measurements.gridSpace1,
	},
	description: {
		paddingBottom: styles.measurements.gridSpace4,
	},
});

const profileImageSize = 150;

export class ProfileScreen extends Component {

	setScreenTrackingInformation() {
		return {
			name: 'build:app:profilescreen',
		};
	}

	renderDescription = (description) => {
		if (description) {
			return (
				<Text style={componentStyles.description}>
					{helpers.removeHTML(description)}
				</Text>
			);
		}
	};

	render() {
		const { profile } = this.props;
		const imageUri = helpers.getProfileImage({
			repUserId: profile.employeeId,
			width: profileImageSize,
			height: profileImageSize,
		});
		return (
			<ScrollView style={componentStyles.container}>
				<View style={[componentStyles.upper, componentStyles.card]}>
					<Image
						style={componentStyles.image}
						source={imageUri}
						width={profileImageSize}
						height={profileImageSize}
					/>
					<View style={componentStyles.headerInfo}>
						<Text
							family="archer"
							size="larger"
							weight="bold"
						>
							{profile.displayName}.
						</Text>
						<Text
							lineHeight={false}
							family="archer"
							size="large"
						>
							{profile.title}
						</Text>
					</View>
				</View>
				<View style={componentStyles.card}>
					{this.renderDescription(profile.description)}
					<Text
						size="large"
						family="archer"
						weight="bold"
					>
						Get in touch with me:
					</Text>
					<View style={componentStyles.buttons}>
						<IconButton
							accessibilityLabel="Call Button"
							trackAction={TrackingActions.PROFILE_CALL}
							textColor="white"
							iconName={helpers.getIcon('call')}
							onPress={() => ContactUsHelper.callUs({ extension: profile.phone })}
							style={componentStyles.callButton}
							text="Call"
						/>
						<IconButton
							accessibilityLabel="Email Button"
							trackAction={TrackingActions.PROFILE_EMAIL}
							color="white"
							iconName={helpers.getIcon('mail')}
							onPress={() => this.props.navigation.getNavigator('root').push('email')}
							style={componentStyles.emailButton}
							text="Email"
						/>
					</View>
				</View>
			</ScrollView>
		);
	}

}

ProfileScreen.route = {
	navigationBar: {
		title: 'Profile',
	},
};

ProfileScreen.propTypes = {
	loading: PropTypes.bool,
	navigation: PropTypes.object,
	profile: PropTypes.object.isRequired,
};

export default (withScreen(ProfileScreen));
