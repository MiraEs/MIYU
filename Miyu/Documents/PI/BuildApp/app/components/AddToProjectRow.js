import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import {
	ListView,
	Text,
	TextInputWithButton,
} from 'BuildLibrary';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import Icon from 'react-native-vector-icons/Ionicons';
import TrackingActions from '../lib/analytics/TrackingActions';
import scrollableHelpers from '../lib/ScrollableHelpers';
import { withNavigation } from '@expo/ex-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { saveShoppingList } from '../actions/ProjectActions';

const componentStyles = StyleSheet.create({
	row: {
		height: 42,
		paddingHorizontal: styles.measurements.gridSpace2,
	},
	rowFlex: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	followingTag: {
		marginRight: styles.measurements.gridSpace1,
	},
	emptyView: {
		marginHorizontal: 6,
	},
	groupListView: {
		backgroundColor: styles.colors.greyLight,
		paddingLeft: 17,
	},
	createProjectInputText: {
		height: 42,
		justifyContent: 'center',
		paddingHorizontal: styles.measurements.gridSpace2,
	},
});

export class AddToProjectRow extends Component {

	constructor(props) {
		super(props);
		this.state = {
			groups: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
			data: this.filterEmptyGroups(props.rowData.shoppingLists),
			isCreatingGroup: false,
			projectSelected: !!props.selectedSessionCartIDs,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.rowData && this.props.rowData.shoppingLists !== nextProps.rowData.shoppingLists) {
			this.setState({ data: this.filterEmptyGroups(nextProps.rowData.shoppingLists)});
		}

		if (this.props.selectedSessionCartIDs !== nextProps.selectedSessionCartIDs) {
			this.setState({ projectSelected: !!nextProps.selectedSessionCartIDs });
		}
	}

	/**
	 * Groups data has an empty group that gets created with the project and should be removed from the data. This unnamed
	 * group is only needed if the user adds an item to the project without selecting a group.
	 */
	filterEmptyGroups = (shoppingLists) => {
		return shoppingLists ? shoppingLists.filter((group) => group.name) : [];
	};

	getGroupData = () => {
		return this.state.groups.cloneWithRows(this.state.data);
	};

	renderFooter = () => {
		return (
			<TextInputWithButton
				ref={(ref) => {
					if (ref) {
						this.addGroupInputRef = ref;
					}
				}}
				onCreate={(name) => {
					this.setState({ isCreatingGroup: true });
					this.props.actions.saveShoppingList({
						name,
						projectId: this.props.rowData.project.id,
					}).then((shoppingList) => {
						this.props.onCreateNewGroupSuccess(shoppingList);
						if (this.addGroupInputRef) {
							this.addGroupInputRef.clearInput();
						}
					}).done(() => this.setState({ isCreatingGroup: false }));
				}}
				buttonText="Create"
				placeholderText="Add a Group"
				analytics={{
					actionName: TrackingActions.ADD_TO_PROJECT_CREATE_GROUP_TAP,
				}}
				onInputFocus={() => {
					if (this.props.listViewRef && this.addGroupInputRef) {
						const scrollResponder = this.props.listViewRef.getScrollResponder();
						scrollableHelpers.scrollRefToKeyboard(scrollResponder, this.addGroupInputRef, {
							offset: 115,
						});
					}
				}}
				isLoading={this.state.isCreatingGroup}
			/>
		);
	};

	renderGroupRow = (rowData) => {
		const selected = this.props.selectedSessionCartIDs && this.props.selectedSessionCartIDs.has(rowData.sessionCart.sessionCartId);
		const color = selected ? 'accent' : 'secondary';
		return (
			<TouchableOpacity onPress={() => this.props.onGroupRowPress(rowData)}>
				<View style={[componentStyles.row, componentStyles.rowFlex]}>
					<Text
						color={color}
						size="small"
					>
						{rowData.name ? rowData.name : 'First Group'}
					</Text>
					{this.renderSelectedCheckMark(selected)}
				</View>
			</TouchableOpacity>
		);
	};

	renderGroupList = () => {
		if (this.state.projectSelected || this.props.expandRow) {
			return (
				<View style={componentStyles.groupListView}>
					<ListView
						dataSource={this.getGroupData()}
						renderRow={this.renderGroupRow}
						renderFooter={this.renderFooter}
						enableEmptySections={true}
						keyboardShouldPersistTaps="handled"
					/>
				</View>
			);
		}
	};

	/**
	 * returning null until the API provides us with information whether is a shared project or not
	 *
	 const isOwner = false;
	 if (isOwner) {
		return (
			<View style={componentStyles.followingTag}>
				<Text
					color="accent"
					size="small"
					fontStyle="italic"
				>
					Following
				</Text>
			</View>
		);
	 }
	 *
	 */
	renderFollowingTag = () => {
		return;
	};

	renderSelectedCheckMark = (selected) => {
		if (selected) {
			return (
				<Icon
					color={styles.colors.accent}
					size={helpers.isIOS() ? 30 : 15}
					name={helpers.getIcon('checkmark')}
				/>
			);
		}
		return (
			<View style={componentStyles.emptyView}/>
		);
	};

	renderProjectName = (rowData) => {
		const color = this.state.projectSelected ? 'accent' : 'secondary';
		return (
			<Text
				color={color}
				size="small"
			>
				{rowData.project.name}
			</Text>
		);
	};

	render() {
		const { rowData, rowID, onRowPress } = this.props;
		return (
			<View>
				<TouchableOpacity
					onPress={() => onRowPress(rowData, rowID)}
				>
					<View style={[componentStyles.row, componentStyles.rowFlex]}>
						{this.renderProjectName(rowData)}
						<View style={componentStyles.rowFlex}>
							{this.renderFollowingTag()}
							{this.renderSelectedCheckMark(this.state.projectSelected)}
						</View>
					</View>
				</TouchableOpacity>
				{this.renderGroupList()}
			</View>
		);
	}
}

AddToProjectRow.propTypes = {
	actions: PropTypes.object,
	expandRow: PropTypes.bool.isRequired,
	listViewRef: PropTypes.object,
	onCreateNewGroupSuccess: PropTypes.func.isRequired,
	onRowPress: PropTypes.func.isRequired,
	onGroupRowPress: PropTypes.func.isRequired,
	rowData: PropTypes.object.isRequired,
	rowID: PropTypes.string.isRequired,
	selectedSessionCartIDs: PropTypes.object,
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({ saveShoppingList }, dispatch),
	};
};

export default withNavigation(connect(null, mapDispatchToProps)(AddToProjectRow));
