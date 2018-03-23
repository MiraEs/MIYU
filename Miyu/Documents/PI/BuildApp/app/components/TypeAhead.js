import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import {
	ListView,
	Text,
} from 'BuildLibrary';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import TappableListItem from './TappableListItem';
import TextHighlighter from './TextHighlighter';
import Icon from 'react-native-vector-icons/Ionicons';

const componentStyles = StyleSheet.create({
	container: {
		backgroundColor: styles.colors.white,
	},
	sectionHeader: {
		backgroundColor: styles.colors.greyLight,
		paddingVertical: styles.measurements.gridSpace1,
		paddingHorizontal: styles.measurements.gridSpace2,
	},
	sectionHeaderEmpty: {
		backgroundColor: styles.colors.greyLight,
		paddingTop: styles.measurements.gridSpace1,
	},
	icon: {
		marginRight: styles.measurements.gridSpace2,
	},
	row: {
		flexDirection: 'row',
	},
});

export default class TypeAhead extends Component {

	constructor(props) {
		super(props);

		this.ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
		});

		this.state = {
			dataSource: this.ds.cloneWithRowsAndSections(props.results),
		};
	}

	componentWillReceiveProps({ results }) {
		if (results) {
			this.setState({
				dataSource: this.ds.cloneWithRowsAndSections(results),
			});
		}
	}

	renderRow = ({ icon, text }) => {
		return (
			<TappableListItem
				body={this.renderRowBody(icon, text)}
				onPress={() => this.navigate(text)}
			/>
		);
	};

	renderRowBody = (icon, text) => {
		let body = (
			<TextHighlighter
				textToMatch={this.props.term}
				fullText={text}
			/>
		);
		if (icon) {
			body = (
				<View
					style={componentStyles.row}
				>
					<Icon
						name={icon}
						size={22}
						color={styles.colors.secondary}
						style={componentStyles.icon}
					/>
					<TextHighlighter
						textToMatch={this.props.term}
						fullText={text}
					/>
				</View>
			);
		}

		return body;
	};

	renderSection = (row, sectionId) => {
		const text = this.props.headers[sectionId];
		const textComponent = text ? <Text lineHeight={false}>{text}</Text> : null;
		const style = text ? componentStyles.sectionHeader : componentStyles.sectionHeaderEmpty;

		return <View style={style}>{textComponent}</View>;
	};

	navigate = (rowText) => {
		this.props.onPress(rowText);
	};

	render() {
		return (
			<View style={[componentStyles.container]}>
				<ListView
					dataSource={this.state.dataSource}
					enableEmptySections={true}
					renderRow={this.renderRow}
					renderSectionHeader={this.renderSection}
					keyboardShouldPersistTaps="always"
				/>
			</View>
		);
	}
}

TypeAhead.propTypes = {
	headers: PropTypes.objectOf(PropTypes.string),
	results: PropTypes.objectOf(
		PropTypes.arrayOf(
			PropTypes.shape({
				text: PropTypes.string.isRequired,
				icon: PropTypes.string,
			})
		)
	),
	onPress: PropTypes.func,
	term: PropTypes.string,
};

TypeAhead.defaultProps = {
	onPress: helpers.noop,
	results: {},
};
