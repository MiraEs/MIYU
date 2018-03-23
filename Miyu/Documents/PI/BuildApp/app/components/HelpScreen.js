import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { TabbedPager } from 'BuildLibrary';
import ExpertsScreen from '../containers/ExpertsScreen';
import FAQScreen from '../components/FAQScreen';
import LoadingView from './LoadingView';
import AtomComponent from '../content/AtomComponent';
import { INCLUDE_TYPES } from '../constants/ContentConstants';
import { connect } from 'react-redux';
import styles from '../lib/styles';

const componentStyles = StyleSheet.create({
	tabStyle: {
		paddingTop: styles.measurements.gridSpace1,
	},
});

class HelpScreen extends Component {

	constructor(props) {
		super(props);

		const { diy_articles } = props;

		const tabs = [{
			name: 'Advisors',
			component: <ExpertsScreen />,
		}, {
			name: 'FAQ',
			component: <LoadingView />,
			loaded: false,
			componentAfterTap: <FAQScreen />,
		}];

		if (diy_articles && diy_articles.articles.selected.length) {
			tabs.push({
				name: diy_articles.nav_title.text,
				component: (
					<AtomComponent
						{...diy_articles.articles}
						includeType={INCLUDE_TYPES.ARTICLE}
						style={componentStyles.tabStyle}
						key={tabs.length}
					/>
				),
			});
		}

		this.state = {
			tabs,
		};
	}

	onPageChanged = (selectedTabIndex) => {
		const tabs = [...this.state.tabs];
		const tab = {...tabs[selectedTabIndex]};
		if (!tab.loaded && tab.componentAfterTap) {
			tab.component = tab.componentAfterTap;
			tab.loaded = true;
			tabs[selectedTabIndex] = tab;
			this.setState({ tabs });
		}
	};

	render() {
		return (
			<TabbedPager
				tabs={this.state.tabs}
				onPageChanged={this.onPageChanged}
			/>
		);
	}
}

HelpScreen.displayName = 'Experts Screen';

HelpScreen.route = {
	navigationBar: {
		title: 'Help',
		renderLeft: null,
	},
};

HelpScreen.propTypes = {
	diy_articles: PropTypes.object,
};

const mapStateToProps = (state) => {
	const { routePages } = state.contentReducer;
	let diy_articles;
	if (
		routePages &&
		routePages['/native-home'] &&
		routePages['/native-home'].content &&
		routePages['/native-home'].content.diy_articles
	) {
		diy_articles = routePages['/native-home'].content.diy_articles;
	}
	return {
		diy_articles,
	};
};

export default connect(mapStateToProps)(HelpScreen);
