import React, {
	Component,
	PropTypes,
} from 'react';
import {
	withScreen,
	Button,
} from 'BuildLibrary';
import {
	ScrollView,
	StyleSheet,
	View,
} from 'react-native';
import AtomComponent from '../content/AtomComponent';
import styles from '../lib/styles';
import { withNavigation } from '@expo/ex-navigation';
import { Text } from 'build-library';
import TrackingActions from '../lib/analytics/TrackingActions';
import EventEmitter from '../lib/eventEmitter';

const componentStyles = StyleSheet.create({
	background: {
		backgroundColor: styles.colors.white,
	},
	screenPadding: {
		padding: styles.measurements.gridSpace1,
	},
	heading: {
		marginBottom: styles.measurements.gridSpace1,
	},
	buttonContainer: {
		flexDirection: 'row',
		marginTop: styles.measurements.gridSpace1,
	},
	button: {
		flex: 1,
	},
	buttonDivider: {
		width: styles.measurements.gridSpace1,
	},
	contactDivider: {
		marginVertical: styles.measurements.gridSpace1,
		height: styles.dimensions.borderWidth,
		backgroundColor: styles.colors.iOSDivider,
	},
});

export class FAQDetail extends Component {

	setScreenTrackingInformation() {
		return {
			name: 'build:app:faqdetail',
		};
	}

	handleEmailPress = () => {
		this.props.navigation.getNavigator('root').push('email');
	};

	handleCallPress = () => {
		EventEmitter.emit('onCallUs');
	};

	render() {
		return (
			<ScrollView style={componentStyles.background}>
				<View style={componentStyles.screenPadding}>
					<View style={componentStyles.heading}>
						<AtomComponent {...this.props.heading} />
					</View>
					<AtomComponent {...this.props.body_copy} />
					<AtomComponent
						{...this.props.media_link_url}
						group={this.props.group}
						contentItemId={this.props.contentItemId}
						trackAction="build:app:faqmedialink"
					>
						<AtomComponent
							{...this.props.media_image}
							width={styles.dimensions.width - (styles.measurements.gridSpace1 * 2)}
						/>
					</AtomComponent>
					<AtomComponent
						{...this.props.section_cta_url}
						group={this.props.group}
						contentItemId={this.props.contentItemId}
						trackAction="build:app:faqctalink"
					>
						<AtomComponent {...this.props.section_cta} />
					</AtomComponent>
				</View>
				<View style={componentStyles.contactDivider} />
				<View style={componentStyles.screenPadding}>
					<Text
						weight="bold"
						size="small"
					>
						Still need assistance? Contact us!
					</Text>
					<View style={componentStyles.buttonContainer}>
						<Button
							onPress={this.handleEmailPress}
							trackAction={TrackingActions.FAQ_CONTACT_US_EMAIL}
							accessibilityLabel="Email Us"
							style={componentStyles.button}
						>
							<Text
								weight="bold"
								color="white"
							>
								Email
							</Text>
						</Button>
						<View style={componentStyles.buttonDivider} />
						<Button
							onPress={this.handleCallPress}
							trackAction={TrackingActions.FAQ_CONTACT_US_PHONE}
							accessibilityLabel="Call Us"
							style={componentStyles.button}
						>
							<Text
								weight="bold"
								color="white"
							>
								Call
							</Text>
						</Button>
					</View>
				</View>
			</ScrollView>
		);
	}

}

FAQDetail.route = {
	navigationBar: {
		title: 'Help',
	},
};

FAQDetail.propTypes = {
	body_copy: PropTypes.object,
	media_image: PropTypes.object,
	media_link_url: PropTypes.object,
	heading: PropTypes.object,
	group: PropTypes.object,
	contentItemId: PropTypes.string,
	section_cta_url: PropTypes.object,
	section_cta: PropTypes.object,
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
};

FAQDetail.defaultProps = {};

export default withNavigation(withScreen(FAQDetail));

