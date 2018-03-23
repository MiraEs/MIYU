import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import pluralize from 'pluralize';
import styles from '../lib/styles';
import { Text } from 'BuildLibrary';
import TappableListItem from './TappableListItem';
import TextHighlighter from './TextHighlighter';
import helpers from '../lib/helpers';

const componentStyles = StyleSheet.create({
	noProjectsRow: {
		backgroundColor: styles.colors.white,
		padding: styles.measurements.gridSpace2,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.grey,
	},
	projectDetailsRow: {
		flex: 1,
	},
});

export default class ProjectRow extends Component {

	renderProjectSpecs = ({ shoppingListQuantityPurchased, teamMemberCount, totalItemsInProject } = {}) => {
		const specs = [pluralize('team member', teamMemberCount + 1, true)];
		if (typeof totalItemsInProject !== 'undefined') {
			specs.push(pluralize('item', totalItemsInProject, true));
		}
		if (typeof shoppingListQuantityPurchased !== 'undefined') {
			specs.push(`${shoppingListQuantityPurchased} purchased`);
		}
		return specs.join('  |  ');
	};

	render() {
		const {
			analyticsData,
			onPress,
			project,
			projectNameFilter,
		} = this.props;
		if (typeof project === 'string') {
			return (
				<View style={componentStyles.noProjectsRow}>
					<Text>{project}</Text>
				</View>
			);
		}

		if (React.isValidElement(project)) {
			return project;
		}

		const projectComponent = (
			<View style={componentStyles.projectDetailsRow}>
				<View style={styles.elements.flexRow}>
					<TextHighlighter
						textToMatch={projectNameFilter}
						fullText={project.name}
					/>
				</View>
				<Text color="greyDark">{this.renderProjectSpecs(project)}</Text>
			</View>
		);

		return (
			<TappableListItem
				onPress={() => onPress(project)}
				title={projectComponent}
				accessibilityLabel="Project"
				analyticsData={analyticsData}
			/>
		);
	}

}

ProjectRow.propTypes = {
	analyticsData: PropTypes.shape({
		trackName: PropTypes.string.isRequired,
		trackData: PropTypes.object,
	}),
	onPress: PropTypes.func,
	project: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element,
		PropTypes.shape({
			name: PropTypes.string,
			shoppingListQuantityPurchased: PropTypes.number,
			teamMemberCount: PropTypes.number,
			totalItemsInProject: PropTypes.number,
		}),
	]),
	projectNameFilter: PropTypes.string,
};

ProjectRow.defaultProps = {
	onPress: helpers.noop,
};
