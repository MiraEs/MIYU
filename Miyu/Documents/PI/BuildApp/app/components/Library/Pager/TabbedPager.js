import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
} from 'react-native';
import Pager from './Pager';
import PagerTabBar from './PagerTabBar';
import styles from '../../../lib/styles';

export default class TabbedPager extends Component {

	constructor(props) {
		super(props);
		this.state = {
			selectedTabIndex: props.initialPage,
		};
	}

	onPageChanged = (selectedTabIndex) => {
		this.setState({ selectedTabIndex });
		this.propagateOnPageChanged(this.state.selectedTabIndex, selectedTabIndex);
	};

	propagateOnPageChanged = (previousIndex, nextIndex) => {
		const { onPageChanged } = this.props;
		if (previousIndex !== nextIndex && typeof onPageChanged === 'function') {
			onPageChanged(nextIndex);
		}
	};

	createTabs = (tabs) => {
		return tabs.map((tab, index) => {
			return {
				selected: index === this.state.selectedTabIndex,
				text: tab.name,
			};
		});
	};

	goToPage = (selectedTabIndex, withAnimation = true) => {
		if (this.pager) {
			if (withAnimation) {
				this.pager.goToPage(selectedTabIndex);
			} else {
				this.pager.goToPageWithoutAnimation(selectedTabIndex);
			}
			this.propagateOnPageChanged(this.state.selectedTabIndex, selectedTabIndex);
			this.setState({ selectedTabIndex });
		}
	};

	getPageStyle = () => {
		return {
			width: this.props.width,
			flexGrow: 1,
		};
	};

	render() {
		const pages = this.props.tabs.map((tab, index) => {
			return (
				<View
					style={this.getPageStyle()}
					key={index}
				>
					{tab.component}
				</View>
			);
		});
		return (
			<View style={styles.elements.flex1}>
				<PagerTabBar
					ref={(ref) => {
						if (ref) {
							this.tabBar = ref;
						}
					}}
					tabs={this.createTabs(this.props.tabs)}
					onPageChanged={(selectedTabIndex) => this.goToPage(selectedTabIndex)}
					selectedTabIndex={this.state.selectedTabIndex}
				/>
				<Pager
					ref={(ref) => {
						if (ref) {
							this.pager = ref;
						}
					}}
					style={styles.elements.flex1}
					onPageChanged={this.onPageChanged}
					initialPage={this.props.initialPage}
					markerEnabled={false}
					scrollEnabled={this.props.scrollEnabled}
				>
					{pages}
				</Pager>
			</View>
		);
	}

}

TabbedPager.propTypes = {
	initialPage: PropTypes.number,
	tabs: PropTypes.arrayOf(PropTypes.shape({
		name: PropTypes.string.isRequired,
		component: PropTypes.element.isRequired,
	})).isRequired,
	width: PropTypes.number,
	onPageChanged: PropTypes.func,
	scrollEnabled: PropTypes.bool,
};

TabbedPager.defaultProps = {
	initialPage: 0,
	width: styles.dimensions.width,
	scrollEnabled: true,
};
