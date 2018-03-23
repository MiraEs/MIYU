import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import {
	Image,
	Text,
} from 'BuildLibrary';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import { IMAGE_42 } from '../constants/CloudinaryConstants';

const CIRCLE_IMAGE_BORDER_RADIUS = IMAGE_42.width / 2;

const componentStyles = StyleSheet.create({
	proExpertWrapper: {
		padding: styles.measurements.gridSpace2,
	},
	bottomBorder: {
		alignSelf: 'stretch',
		borderBottomWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.lightGray,
		marginTop: styles.measurements.gridSpace1,
	},
	bottomBorderBottomMargin: {
		marginBottom: styles.measurements.gridSpace1,
	},
	proExpertImage: {
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.lightGray,
		borderRadius: CIRCLE_IMAGE_BORDER_RADIUS,
		marginRight: styles.measurements.gridSpace2,
	},
	proExpertInfoWrapper: {
		flexGrow: 1,
		alignItems: 'flex-start',
	},
});

class ExpertBio extends Component {

	hasAssignedExpert = () => {
		const { rep } = this.props;
		return rep && rep.repUserID;
	};

	renderExpertDetail = () => {
		const bottomBorderStyles = [componentStyles.bottomBorder];
		if (helpers.isAndroid()) {
			bottomBorderStyles.push(componentStyles.bottomBorderBottomMargin);
		}
		if (this.hasAssignedExpert()) {
			const { rep } = this.props;
			return (
				<View>
					<Text weight="bold">Your Project Advisor</Text>
					<Text>
						{rep.repFirstName} {rep.repLastName}
					</Text>
				</View>
			);
		} else {
			return (
				<View>
					<Text>Pro Account Support</Text>
					<View style={bottomBorderStyles}/>
				</View>
			);
		}
	};

	renderExpertImage = () => {
		if (this.hasAssignedExpert()) {
			const { rep } = this.props;
			const profileImageUrl = helpers.getCloudinarySalesRepImage({
				...IMAGE_42,
				repUserId: rep.repUserID,
			});
			return (
				<Image
					source={profileImageUrl}
					{...IMAGE_42}
					style={componentStyles.proExpertImage}
				/>
			);
		} else {
			return (
				<Image
					source={require('../images/build-pro.png')}
					{...IMAGE_42}
					style={componentStyles.proExpertImage}
				/>
			);
		}
	};

	render() {
		return (
			<View style={[styles.elements.leftFlexRow, componentStyles.proExpertWrapper]}>
				{this.renderExpertImage()}
				<View style={componentStyles.proExpertInfoWrapper}>
					{this.renderExpertDetail()}
				</View>
			</View>
		);
	}

}

ExpertBio.propTypes = {
	rep: PropTypes.object,
};

ExpertBio.defaultProps = {
	rep: {},
};

export default ExpertBio;
