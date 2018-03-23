import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	getRoutePage,
} from '../actions/ContentActions';
import { getCategories } from '../actions/CategoryActions';
import HeaderSearch from './HeaderSearch';
import styles from '../lib/styles';
import {
	withScreen,
} from 'BuildLibrary';
import TemplateComponent from '../content/TemplateComponent';
import { trackState } from '../actions/AnalyticsActions';
import ContentError from '../components/ContentError';
import environment from '../lib/environment';
import SplashScreen from 'react-native-splash-screen';
import { getArProducts } from '../actions/ProductDetailActions';

const componentStyles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: styles.colors.greyLight,
	},
});

export class HomeScreen extends Component {

	componentWillReceiveProps({ error }) {
		if (error && error.length) {
			SplashScreen.hide();
			this.props.navigator.replace('home');
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:home',
		};
	}

	getScreenData = () => {
		this.props.actions.getRoutePage(environment.homeRoute)
			.then(() => {
				SplashScreen.hide();
				this.props.actions.getArProducts();
			})
			.catch(() => SplashScreen.hide());
	};

	renderScreenContent = () => {
		if (this.props.error) {
			return (
				<ContentError retry={this.getScreenData} />
			);
		}
		return (
			<TemplateComponent
				contentItem={this.props.contentItem || {}}
				selectedTab={this.props.tab}
			/>
		);
	};

	render() {
		return (
			<View
				accessibilityLabel="Categories"
				style={componentStyles.root}
			>
				{this.renderScreenContent()}
			</View>
		);
	}
}

HomeScreen.route = {
	navigationBar: {
		renderLeft: null,
		renderTitle() {
			return (
				<View style={styles.elements.header}>
					<HeaderSearch allowFullCollapse={null} />
				</View>
			);
		},
		renderRight: null,
	},
};

HomeScreen.propTypes = {
	contentItem: PropTypes.object,
	isLoggingIn: PropTypes.bool,
	isLoggingInSocial: PropTypes.bool,
	navigator: PropTypes.shape({
		replace: PropTypes.func,
	}),
	actions: PropTypes.object,
	refresh: PropTypes.bool,
	error: PropTypes.string,
	tab: PropTypes.string,
};

export default connect((state) => {
	const contentItem = state.contentReducer.routePages[environment.homeRoute];
	const error = state.contentReducer.errors[environment.homeRoute];
	return {
		contentItem,
		error,
		isLoggingIn: state.userReducer.isLoggingIn,
		isLoggingInSocial: state.userReducer.isLoggingInSocial,
		refresh: state.errorReducer.refresh,
		loading: !contentItem && !error,
	};
}, (dispatch) => {
	return {
		actions: bindActionCreators({
			getArProducts,
			getCategories,
			getRoutePage,
			trackState,
		}, dispatch),
	};
})(withScreen(HomeScreen));
