import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import styles from '../lib/styles';
import {
	Image,
	Text,
} from 'BuildLibrary';
import Icon from 'react-native-vector-icons/Ionicons';
import helpers from '../lib/helpers';
import { IMAGE_75 } from '../constants/CloudinaryConstants';

const componentStyles = StyleSheet.create({
	container: {
		marginTop: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
		padding: styles.measurements.gridSpace1,
	},
	titleBar: {
		paddingBottom: styles.measurements.gridSpace1,
		borderBottomColor: styles.colors.greyLight,
		borderBottomWidth: styles.dimensions.borderWidth,
	},
	body: {
		paddingTop: styles.measurements.gridSpace1,
		flexDirection: 'row',
	},
	contentBody: {
		paddingLeft: styles.measurements.gridSpace1,
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
	},
	projectIcon: {
		marginRight: styles.measurements.gridSpace1,
	},
});

export default class OrderListItem extends Component {

	defaultTitleBar = () => {
		return (
			<Text weight="bold">{this.props.title}</Text>
		);
	}

	renderTitleLine(titleLine) {
		const titleLineContent = (
			<Text
				lineHeight={false}
				weight="bold"
			>
					{titleLine}
			</Text>
		);

		if (this.props.projectName) {
			return (
				<View style={styles.elements.flexRow}>
					<Icon
						name="md-folder"
						size={16}
						color={styles.colors.secondary}
						style={componentStyles.projectIcon}
					/>
					{titleLineContent}
				</View>
			);
		}

		return titleLineContent;
	}

	render() {
		const { details, image, projectName, renderHeader } = this.props;
		const adjustedDetails = [...details];
		let titleLine = projectName;
		if (!projectName) {
			titleLine = adjustedDetails.shift();
		}

		return (
			<View style={componentStyles.container}>
				<View style={componentStyles.titleBar}>
					{renderHeader ? renderHeader() : this.defaultTitleBar()}
				</View>
				<TouchableOpacity
					style={componentStyles.body}
					onPress={this.props.onPress}
				>
					<Image
						source={image}
						{...IMAGE_75}
					/>
					<View style={componentStyles.contentBody}>
						<View>
							{this.renderTitleLine(titleLine)}
							{adjustedDetails.map((detail, i) =>
								<Text key={i}>{detail}</Text>
							)}
						</View>
						<Icon
							name={helpers.getIcon('arrow-forward')}
							size={25}
							color={styles.colors.grey}
						/>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}

OrderListItem.propTypes = {
	details: PropTypes.array.isRequired,
	image: PropTypes.object.isRequired,
	onPress: PropTypes.func.isRequired,
	projectName: PropTypes.string,
	renderHeader: PropTypes.func,
	title: PropTypes.string,
};

OrderListItem.defaultProps = {
	title: 'Title',
};
