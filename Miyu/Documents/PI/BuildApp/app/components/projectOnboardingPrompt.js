'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import styles from '../lib/styles';
import {
	IconButton,
	ScrollView,
	withScreen,
	Text,
} from 'BuildLibrary';
import { CREATE_PROJECT } from '../lib/analytics/TrackingActions';
import Icon from 'react-native-vector-icons/Ionicons';
import { withNavigation } from '@expo/ex-navigation';

const componentStyles = StyleSheet.create({
	button: {
		marginTop: styles.measurements.gridSpace2,
		flex: 0,
	},
	indent: {
		padding: styles.measurements.gridSpace2,
	},
	icon: {
		marginRight: styles.measurements.gridSpace2,
	},
	iconAddPerson: {
		marginTop: -6,
		marginBottom: -16,
	},
	iconImages: {
		marginTop: 2,
		marginBottom: -15,
	},
	textBlock: {
		backgroundColor: styles.colors.white,
		borderColor: styles.colors.grey,
		borderBottomWidth: 1,
	},
	bulletRow: {
		flexDirection: 'row',
		marginBottom: styles.measurements.gridSpace3,
	},
	bulletText: {
		flexDirection: 'row',
		flex: 1,
	},
});

class ProjectOnboardingPrompt extends Component {

	setScreenTrackingInformation() {
		return {
			name: 'build:app:project:onboardingprompt',
		};
	}

	goToCreateProject = () => {
		this.props.navigation.getNavigator('root').push('newProject');
	}

	render() {
		return (
			<View style={[styles.elements.screenWithHeader, styles.elements.screenGreyLight]}>
				<ScrollView ref={(ref) => this.scrollView = ref}>
					<View style={[componentStyles.indent, componentStyles.textBlock]}>
						<Text
							size="large"
							textAlign="center"
						>
							Simplify home improvement and organize your projects in our innovative
						</Text>
						<Text
							size="large"
							textAlign="center"
							weight="bold"
						>
							collaboration space
						</Text>
						<IconButton
							iconName="ios-folder-outline"
							color="primary"
							onPress={this.goToCreateProject}
							text="Create a Project"
							textColor="white"
							style={componentStyles.button}
							trackAction={CREATE_PROJECT}
							accessibilityLabel="Create Project"
						/>
					</View>
					<View style={[componentStyles.indent, styles.elements.flex]}>
						<View style={componentStyles.bulletRow}>
							<Icon
								name="ios-person-add"
								size={57}
								style={[componentStyles.icon, componentStyles.iconAddPerson]}
								color={styles.colors.secondary}
							/>
							<Text style={componentStyles.bulletText}>
								<Text weight="bold">
									Add your team{' '}
								</Text>
								for better communication
							</Text>
						</View>
						<View style={componentStyles.bulletRow}>
							<Icon
								name="ios-images"
								size={41}
								style={[componentStyles.icon, componentStyles.iconImages]}
								color={styles.colors.secondary}
							/>
							<Text style={componentStyles.bulletText}>
								<Text weight="bold">
									Upload photos{' '}
								</Text>
								to track project progress
							</Text>
						</View>
						<View style={componentStyles.bulletRow}>
							<Icon
								name="md-notifications"
								size={47}
								style={[componentStyles.icon, componentStyles.iconImages]}
								color={styles.colors.secondary}
							/>
							<Text style={componentStyles.bulletText}>
								<Text weight="bold">
									Receive push notifications{' '}
								</Text>
								to manage orders and shipments
							</Text>
						</View>
					</View>
				</ScrollView>
			</View>
		);
	}

}

ProjectOnboardingPrompt.propTypes = {
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
};

export default withNavigation(withScreen(ProjectOnboardingPrompt));
