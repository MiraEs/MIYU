import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
} from 'react-native';
import styles from '../../lib/styles';
import AtomComponent from '../AtomComponent';
import RecentlyViewedScreen from '../../containers/RecentlyViewedScreen';
import { withNavigation } from '@expo/ex-navigation';
import EventEmitter from '../../lib/eventEmitter';
import { Device } from 'BuildNative';
import { TabbedPager } from 'BuildLibrary';
import { HOME } from '../../constants/constants';

const componentStyles = StyleSheet.create({
	tabStyle: {
		paddingTop: styles.measurements.gridSpace1,
		width: styles.dimensions.width,
	},
});

@withNavigation
export default class NativeHome extends Component {

	constructor(props) {
		super(props);
		this.scrollTo = [];
		const {
			contentItem,
			contentItem: {
				content: {
					promos,
					native_sale_section: { items },
					recently_viewed,
				},
			},
		} = props;
		const tabs = items.map((item, index) => {
			if (index === 0 && item.media_image) {
				item.useCustomComponent = Device.isArKitEnabled();
			}
			return {
				name: item.nav_title.text,
				component: (
					<AtomComponent
						key={index}
						contentItem={contentItem}
						{...item}
					/>
				),
			};
		});
		if (promos && promos.promos.items.length) {
			tabs.push({
				name: promos.nav_title.text,
				component: (
					<AtomComponent
						{...promos.promos}
						listItemProps={{
							group: contentItem.group,
							contentItemId: contentItem.id,
						}}
						style={componentStyles.tabStyle}
						key={tabs.length}
					/>
				),
			});
		}
		tabs.push({
			name: recently_viewed.nav_title.text,
			component: (
				<RecentlyViewedScreen
					key={tabs.length}
					contentItem={contentItem}
					maxItems={parseInt(recently_viewed.item_count.text, 10)}
				/>
			),
		});

		let initialPage = 0;
		if (props.selectedTab) {
			initialPage = Math.max(0, tabs.findIndex((tab) => tab.name.toLowerCase() === props.selectedTab));
		}

		this.state = {
			initialPage,
			tabs,
		};
	}

	componentDidMount() {
		EventEmitter.addListener('tabPress', this.handleMainNavPress);
	}

	componentWillReceiveProps({ selectedTab }) {
		if (selectedTab !== this.props.selectedTab && this.pager) {
			this.pager.goToPage(Math.max(0, this.state.tabs.findIndex((tab) => tab.name.toLowerCase() === selectedTab)));
		}
	}

	componentWillUnmount() {
		EventEmitter.removeListener('tabPress', this.handleMainNavPress);
	}

	handleMainNavPress = (tabName) => {
		if (tabName === HOME && this.pager) {
			this.pager.goToPage(0, false);
		}
	};

	render() {
		return (
			<TabbedPager
				initialPage={this.state.initialPage}
				ref={(ref) => {
					if (ref) {
						this.pager = ref;
					}
				}}
				tabs={this.state.tabs}
			/>
		);
	}

}

NativeHome.propTypes = {
	contentItem: PropTypes.object,
	navigator: PropTypes.object,
	selectedTab: PropTypes.string,
};
