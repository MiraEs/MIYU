import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes } from 'react-native';
import { ListView } from 'BuildLibrary';
import AtomComponent from '../AtomComponent';

export default class AtomList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
			.cloneWithRows(props.items),
		};
	}

	componentWillReceiveProps({ items }) {
		this.setState({
			dataSource: this.state.dataSource.cloneWithRows(items),
		});
	}

	render() {
		return (
			<ListView
				style={this.props.style}
				enableEmptySections={true}
				renderRow={(row) => {
					return (
						<AtomComponent
							{...row}
							{...this.props.listItemProps}
						/>
					);
				}}
				dataSource={this.state.dataSource}
			/>
		);
	}

}

AtomList.propTypes = {
	items: PropTypes.array.isRequired,
	listItemProps: PropTypes.object,
	style: ViewPropTypes.style,
};
