import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	getCategories,
	getCategory,
} from '../actions/CategoryActions';
import {
	CATEGORY_SECTION,
	IMAGE_42,
} from '../constants/CloudinaryConstants';
import helpers from '../lib/helpers';
import TappableListItem from '../components/TappableListItem';
import HeaderSearch from './HeaderSearch';
import LoadingView from '../components/LoadingView';
import styles from '../lib/styles';
import {
	withScreen,
	ListView,
} from 'BuildLibrary';

export class CategoryBrowseScreen extends Component {

	setScreenTrackingInformation() {
		return {
			name: 'build:app:home',
		};
	}

	getScreenData = () => {
		if (!this.props.categories.length) {
			this.props.actions.getCategories().done();
		}
	};

	categoryTap = ({ link, id }) => {
		const {
			navigator,
		} = this.props;
		if (link) {
			navigator.push('category', {
				categoryId: link,
			});
		} else {
			navigator.push('category', {
				categoryId: id,
			});
		}
	};

	renderCategory = (category) => {
		const imageUrl = helpers.getCloudinaryImageUrl({
			...IMAGE_42,
			section: CATEGORY_SECTION,
			name: category.image,
		});
		return (
			<TappableListItem
				accessibilityLabel={`categoryBrowse${category.name.replace(/\s/g, '')}`}
				onPress={() => this.categoryTap(category)}
				image={{ uri: imageUrl }}
				body={category.name}
			/>
		);
	};


	render() {
		const dataSource = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
		}).cloneWithRows(this.props.categories);

		const { isLoggingIn, isLoggingInSocial } = this.props;

		if (isLoggingIn || isLoggingInSocial) {
			return <LoadingView />;
		}

		return (
			<ListView
				automaticallyAdjustContentInsets={false}
				dataSource={dataSource}
				enableEmptySections={true}
				renderRow={this.renderCategory}
				scrollsToTop={true}
				accessibilityLabel="Categories"
			/>
		);
	}
}

CategoryBrowseScreen.route = {
	navigationBar: {
		renderTitle() {
			return (
				<View style={styles.elements.header}>
					<HeaderSearch />
				</View>
			);
		},
	},
};

CategoryBrowseScreen.propTypes = {
	loading: PropTypes.bool,
	isLoggingIn: PropTypes.bool,
	isLoggingInSocial: PropTypes.bool,
	categories: PropTypes.array,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
	actions: PropTypes.object,
	refresh: PropTypes.bool,
};

CategoryBrowseScreen.defaultProps = {
	categories: [],
};

export default connect((state) => {
	return {
		categories: state.categoryReducer.headerCategories,
		loading: !state.categoryReducer.headerCategories.length,
		isLoggingIn: state.userReducer.isLoggingIn,
		isLoggingInSocial: state.userReducer.isLoggingInSocial,
		refresh: state.errorReducer.refresh,
	};
}, (dispatch) => {
	return {
		actions: bindActionCreators({
			getCategories,
			getCategory,
		}, dispatch),
	};
})(withScreen(CategoryBrowseScreen));
