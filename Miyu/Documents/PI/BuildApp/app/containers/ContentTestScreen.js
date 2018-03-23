import React, {
	Component,
} from 'react';
import ContentTestRow from '../components/ContentTestRow';
import {
	CATEGORY,
	ROUTE,
	ARTICLE,
	SHARED,
} from '../constants/ContentConstants';
import {
	ListView,
} from 'BuildLibrary';


export default class ContentTestScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (r1, r2) => r1 !== r2,
			}).cloneWithRows([
				{
					label: 'Categories',
					type: CATEGORY,
				},
				{
					label: 'Pages',
					type: ROUTE,
				},
				{
					label: 'Articles',
					type: ARTICLE,
				},
				{
					label: 'Shared & Promos',
					type: SHARED,
				},
			]),
		};
	}

	render() {
		return (
			<ListView
				dataSource={this.state.dataSource}
				renderRow={(row) => <ContentTestRow {...row}/>}
			/>
		);
	}

}

ContentTestScreen.route = {
	navigationBar: {
		title: 'Content Test',
	},
};

ContentTestScreen.propTypes = {};
