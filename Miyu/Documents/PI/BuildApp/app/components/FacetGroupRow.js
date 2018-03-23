import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	TouchableOpacity,
} from 'react-native';
import {
	Text,
	ListView,
} from 'BuildLibrary';
import styles from '../lib/styles';
import SearchFilterInput from './SearchFilterInput';
import TextHighlighter from './TextHighlighter';
import Icon from 'react-native-vector-icons/Ionicons';
import helpers from '../lib/helpers';
import pluralize from 'pluralize';

const componentStyles = StyleSheet.create({
	facet: {
		flexDirection: 'row',
		backgroundColor: styles.colors.white,
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: styles.measurements.gridSpace2,
		paddingHorizontal: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace1,
		height: 52,
	},
	touchableRow: {
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.greyLight,
		padding: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	selectedFacet: {
		borderWidth: styles.dimensions.borderWidthLarge,
		borderColor: styles.colors.accent,
	},
	facetGroupRow: {
		backgroundColor: styles.colors.greyLight,
		paddingHorizontal: styles.measurements.gridSpace1,
	},
	facetContainer: {
		marginTop: styles.measurements.gridSpace1,
	},
	nothingFoundText: {
		paddingVertical: styles.measurements.gridSpace3,
	},
});

const textHighlighterStyles = StyleSheet.create({
	text: {
		fontSize: styles.fontSize.small,
		color: styles.colors.secondary,
	},
});

const searchBarStyles = StyleSheet.create({
	container: {
		backgroundColor: styles.colors.white,
		marginBottom: styles.measurements.gridSpace1,
		padding: 0,
		borderBottomWidth: 0,
	},
	icon: {
		color: styles.colors.secondary,
	},
});

class FacetGroupRow extends Component {

	constructor(props) {
		super(props);

		this.state = {
			filterText: '',
			isActive: false,
		};
	}

	handleFacetPress = (facet) => {
		const { rowData } = this.props;
		const { categoryId, keyword } = rowData.searchCriteria;
		const { actions } = this.context;
		actions.updateSelectedFacets({
			groupName: rowData.groupName,
			facetId: facet.facetId,
			value: facet.value,
			status: facet.status === 'selected' ? null : 'selected',
			categoryId,
			keyword,
		});
		actions.searchByKeyword({
			...rowData.searchCriteria,
			page: 1,
			onlyFacets: true,
		});
	};

	renderFacet = (facet) => {
		const { status } = facet;
		const { filterText } = this.state;
		return (
			<TouchableOpacity
				accessibilityLabel={facet.value}
				style={[componentStyles.facet, status === 'selected' ? componentStyles.selectedFacet : {}]}
				onPress={() => this.handleFacetPress(facet)}
			>
				<View style={styles.elements.centeredFlexRow}>
					<TextHighlighter
						style={textHighlighterStyles}
						fullText={facet.value}
						textToMatch={filterText.trim()}
					/>
					<Text color="grey"> ({facet.count})</Text>
				</View>
				{this.renderSelectedCheck(status)}
			</TouchableOpacity>
		);
	};

	renderSelectedCheck = (status) => {
		if (status === 'selected') {
			return (
				<View
					style={styles.elements.centeredFlexRow}
				>
					<Icon
						name="md-checkmark"
						size={24}
						color={styles.colors.accent}
					/>
				</View>
			);
		}
	};

	getDataSource = (limit) => {
		let { resultValues } = this.props.rowData;
		const { filterText } = this.state;
		if (filterText) {
			resultValues = resultValues.filter((v) => v.value.toLowerCase().indexOf(filterText.trim().toLowerCase()) !== -1);
		}
		if (limit) {
			resultValues = resultValues.slice(0, (limit - 1 > resultValues.length || limit - 1 < 1) ? resultValues.length : limit - 1);
		}
		return new ListView.DataSource({
			rowHasChanged: () => true,
		}).cloneWithRows(resultValues);
	};

	searchBoxFocus = (event) => {
		this.props.searchBoxFocus(event);
	};

	renderFacetSearch = () => {
		const { rowData } = this.props;
		const { filterText } = this.state;
		if (rowData.resultValues.length > 6) {
			return (
				<SearchFilterInput
					style={searchBarStyles}
					placeholder={`Search ${rowData.groupName}`}
					onChangeText={(text) => this.setState({ filterText: text })}
					onFocus={this.searchBoxFocus}
					text={filterText}
				/>
			);
		}
	};

	renderNothingFound = (ds, groupName) => {
		const { filterText } = this.state;
		if (!ds._cachedRowCount && filterText) {
			return (
				<Text
					color="greyDark"
					textAlign="center"
					style={componentStyles.nothingFoundText}
				>
					Sorry, couldn't find any {pluralize(groupName.toLowerCase())} matching '{filterText}'
				</Text>
			);
		}
	};

	renderSelectedFacets = (selectedFacetsInGroup) => {
		if (selectedFacetsInGroup && selectedFacetsInGroup.criteria && selectedFacetsInGroup.criteria.value) {
			return (
				<View style={componentStyles.selectedContainer}>
					<Text
						size="small"
						color="accent"
					>
						{selectedFacetsInGroup.criteria.value.join(', ')}
					</Text>
				</View>
			);
		} else {
			return <View style={componentStyles.selectedContainer}/>;
		}
	};

	render() {
		const { rowData } = this.props;
		const { isActive } = this.state;
		const selectedFacetsInGroup = rowData.selectedFacetResponses.find((f) => f.groupName === rowData.groupName);
		const ds = this.getDataSource();
		if (rowData.resultValues.length || (rowData.resultValues[0] && rowData.resultValues[0].status)) {
			const borderBottom = { borderBottomWidth: isActive ? 0 : styles.dimensions.borderWidth };
			return (
				<View>
					<TouchableOpacity
						accessibilityLabel={rowData.groupName}
						style={[componentStyles.touchableRow, borderBottom]}
						onPress={() => this.setState({ isActive: !this.state.isActive })}
					>
						<View>
							<Text weight={isActive ? 'bold' : 'normal'}>{rowData.groupName}</Text>
							{this.renderSelectedFacets(selectedFacetsInGroup)}
						</View>
						<Icon
							name={`ios-arrow-${isActive ? 'up' : 'down'}`}
							size={25}
							color={styles.colors.secondary}
						/>
					</TouchableOpacity>
					{isActive ?
						<View style={componentStyles.facetGroupRow}>
							<ListView
								dataSource={ds}
								automaticallyAdjustContentInsets={false}
								renderRow={(facet) => this.renderFacet(facet, rowData.groupName)}
								renderHeader={this.renderFacetSearch}
								renderFooter={() => this.renderNothingFound(ds, rowData.groupName)}
								style={componentStyles.facetContainer}
								accessibilityLabel={rowData.groupName}
							/>
						</View> : <View/>}
				</View>
			);
		}
		return <View/>;
	}
}

FacetGroupRow.contextTypes = {
	actions: PropTypes.object.isRequired,
};

FacetGroupRow.propTypes = {
	rowData: PropTypes.object.isRequired,
	categoryId: PropTypes.number,
	keyword: PropTypes.string,
	searchBoxFocus: PropTypes.func,
};

FacetGroupRow.defaultProps = {
	searchBoxFocus: helpers.noop,
};

module.exports = FacetGroupRow;
