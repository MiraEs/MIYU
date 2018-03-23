import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import {
	ListView,
	Text,
} from 'BuildLibrary';
import AtomComponent from '../AtomComponent';
import styles from '../../lib/styles';

const componentStyles = StyleSheet.create({
	label: {
		padding: styles.measurements.gridSpace1,
		paddingTop: styles.measurements.gridSpace6,
	},
	separator: {
		height: styles.dimensions.borderWidth,
	},
});

export default class AtomGroupItemPicker extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2,
			}).cloneWithRows(props.selected),
		};
	}

	componentWillReceiveProps({ selected }) {
		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(selected),
		});
	}

	renderLabel = () => {
		if (this.props.label) {
			return (
				<Text
					style={componentStyles.label}
					weight="bold"
					family="archer"
					size="larger"
				>
					{this.props.label}
				</Text>
			);
		}
	};

	render() {
		if (this.props.selected && this.props.selected.length) {
			return (
				<View>
					{this.renderLabel()}
					<ListView
						renderRow={(row) => {
							return (
								<AtomComponent
									{...row}
									categoryIncludes={this.props.categoryIncludes}
								/>
							);
						}}
						dataSource={this.state.dataSource}
						renderSeparator={(section, rowId) => {
							return (
								<View
									key={rowId}
									style={componentStyles.separator}
								/>
							);
						}}
						scrollEnabled={this.props.scrollEnabled}
						enableEmptySections={true}
					/>
				</View>
			);
		} else {
			return null;
		}
	}

}

AtomGroupItemPicker.propTypes = {
	categoryIncludes: PropTypes.object,
	label: PropTypes.string,
	scrollEnabled: PropTypes.bool,
	selected: PropTypes.array,
};

AtomGroupItemPicker.defaultProps = {
	scrollEnabled: true,
};
