import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Alert,
} from 'react-native';
import {
	ListView,
	ScrollView,
} from 'BuildLibrary';
import styles from '../lib/styles';
import TappableListItem from '../components/TappableListItem';
import { connect } from 'react-redux';
import axios from 'axios';

export class ReduxStoreScreen extends Component {

	saveToFile = (reducer) => {
		const { stores } = this.props;

		axios({
			method: 'post',
			url: 'http://localhost:2323',
			params: { reducer },
			data: stores[reducer],
		})
			.then(() => Alert.alert('Success', 'Successfully saved the store'))
			.catch(() => Alert.alert('Error', 'Unable to save the store'));
	};

	renderRow = (data) => {
		const { text } = data;

		return (
			<TappableListItem
				onPress={() => this.saveToFile(text)}
				style={styles.elements.row}
				body={text}
			/>
		);
	}

	render() {
		const { stores } = this.props;
		const reducers = Object.keys(stores).map((reducer, index) => {
			return {
				text: reducer,
				index,
			};
		});
		const dataSource = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
		})
			.cloneWithRowsAndSections([reducers]);

		return (
			<ScrollView
				style={styles.elements.screenWithHeader}
				scrollsToTop={true}
			>
				<ListView
					style={styles.elements.screenWithHeader}
					dataSource={dataSource}
					renderRow={this.renderRow}
					scrollsToTop={true}
				/>
			</ScrollView>
		);
	}
}

ReduxStoreScreen.route = {
	navigationBar: {
		title: 'Save to File',
	},
};

ReduxStoreScreen.propTypes = {
	stores: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
	return {
		stores: state,
	};
};

export default connect(mapStateToProps)(ReduxStoreScreen);
