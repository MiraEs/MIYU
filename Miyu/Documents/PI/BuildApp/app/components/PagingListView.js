import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	RefreshControl,
	View,
	ViewPropTypes,
} from 'react-native';
import LoadingView from '../components/LoadingView';
import {
	ListView,
} from 'BuildLibrary';
import styles from '../lib/styles';

export default class PagingListView extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(props.data || []),
			isRefreshing: false,
			loading: false,
		};
	}

	componentDidMount() {
		this.setState({ loading: true }, () => this.props.loadPage(1));
	}

	componentWillReceiveProps({ data, error }) {
		if (data) {
			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(data),
				isRefreshing: false,
				loading: false,
			});
		}
		if (error) {
			this.setState({
				loading: false,
				isRefreshing: false,
			});
		}
	}

	loadPage = () => {
		const {
			loadPage,
			paging,
		} = this.props;
		if (!this.state.loading && paging.page < paging.pages) {
			this.setState({ loading: true }, () => loadPage(paging.page + 1));
		}
	};

	renderFooter = () => {
		if (this.state.loading) {
			return (
				<View style={styles.feedEvents.padding}>
					<LoadingView />
				</View>
			);
		}
	};

	render() {
		if (!this.state.loading && this.props.data && !this.props.data.length) {
			return this.props.renderEmpty();
		}
		return (
			<ListView
				style={this.props.style}
				automaticallyAdjustContentInsets={false}
				enableEmptySections={true}
				dataSource={this.state.dataSource}
				refreshControl={
					<RefreshControl
						onRefresh={() => this.props.loadPage(1)}
						refreshing={this.state.isRefreshing}
					/>
				}
				renderRow={this.props.renderRow}
				scrollsToTop={true}
				renderFooter={this.renderFooter}
				renderHeader={this.props.renderHeader}
				onEndReached={this.loadPage}
			/>
		);
	}

}

PagingListView.propTypes = {
	data: PropTypes.array,
	error: PropTypes.string,
	loadPage: PropTypes.func.isRequired,
	paging: PropTypes.shape({
		page: PropTypes.number,
		pages: PropTypes.number,
	}).isRequired,
	renderEmpty: PropTypes.func.isRequired,
	renderRow: PropTypes.func.isRequired,
	renderHeader: PropTypes.func,
	style: ViewPropTypes.style,
};
