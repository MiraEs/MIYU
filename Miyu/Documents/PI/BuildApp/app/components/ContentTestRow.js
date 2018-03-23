import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from '../lib/styles';
import {
	ListView,
	Text,
} from 'BuildLibrary';
import Icon from 'react-native-vector-icons/Ionicons';
import LoadingView from '../components/LoadingView';
import { getContentGroup } from '../actions/ContentActions';
import { withNavigation } from '@expo/ex-navigation';

const componentStyles = StyleSheet.create({
	container: {
		padding: styles.measurements.gridSpace2,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.grey,
	},
	groupItem: {
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingTop: styles.measurements.gridSpace1,
	},
	listView: {
		paddingTop: styles.measurements.gridSpace1,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});

@withNavigation
export class ContentTestRow extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2,
			}),
			expanded: false,
		};
	}

	componentWillReceiveProps({ contentGroup }) {
		if (contentGroup) {
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(contentGroup),
			});
		}
	}

	onPressRow = () => {
		this.setState({
			expanded: !this.state.expanded,
		});
		this.props.actions.getContentGroup(this.props.type);
	};

	renderGroupItem = (item) => {
		return (
			<TouchableOpacity
				style={componentStyles.groupItem}
				onPress={() => {
					this.props.navigator.push('content', {
						id: item.contentItem.group.id,
					});
				}}
			>
				<Text>{item.contentItem.group.description}</Text>
			</TouchableOpacity>
		);
	};

	renderList = () => {
		if (this.state.expanded) {
			if (this.props.contentGroup !== null) {
				return (
					<ListView
						style={componentStyles.listView}
						renderRow={this.renderGroupItem}
						dataSource={this.state.dataSource}
						enableEmptySection={true}
						showsVerticalScrollIndicator={false}
					/>
				);
			}
			return <LoadingView />;
		}
	};

	render() {
		return (
			<View style={componentStyles.container}>
				<TouchableOpacity
					style={componentStyles.row}
					onPress={this.onPressRow}
				>
					<Text
						weight="bold"
						size="large"
					>
						{this.props.label}
					</Text>
					<Icon
						name={`ios-arrow-${this.state.expanded ? 'up' : 'down'}`}
						size={25}
						color={styles.colors.secondary}
					/>
				</TouchableOpacity>
				{this.renderList()}
			</View>
		);
	}

}

ContentTestRow.propTypes = {
	actions: PropTypes.object,
	contentGroup: PropTypes.array,
	label: PropTypes.string.isRequired,
	navigator: PropTypes.object,
	type: PropTypes.string.isRequired,
};

ContentTestRow.defaultProps = {};

const mapStateToProps = (state, ownProps) => {
	return {
		contentGroup: state.contentReducer[ownProps.type],
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getContentGroup,
		}, dispatch),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ContentTestRow);
