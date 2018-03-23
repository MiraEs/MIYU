import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	InteractionManager,
	View,
} from 'react-native';
import AtomComponent from '../AtomComponent';
import { TabbedPager } from 'BuildLibrary';
import { connect } from 'react-redux';
import { withNavigation } from '@expo/ex-navigation';
import NavigationBar from '../../components/NavigationBar';
import helpers from '../../lib/helpers';
import styles from '../../lib/styles';

@withNavigation
export class DealsTemplate extends Component {

	constructor(props) {
		super(props);
		const tabs = props.contentItem.content.sale_section.items.map((item, index) => {
			return {
				name: item.nav_title.text,
				component: (
					<AtomComponent
						key={index}
						{...item}
						categoryIncludes={this.props.categoryIncludes}
					/>
				),
			};
		});
		let initialPage = 0;
		if (props.selectedTab) {
			initialPage = Math.max(0, tabs.findIndex((tab) => tab.name.toLowerCase() === props.selectedTab));
		}
		this.state = {
			tabs,
			initialPage,
		};
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			if (this.props.navigator) {
				this.props.navigator.updateCurrentRouteParams({
					title: this.props.contentItem.content.heading.text,
				});
			}
		});
	}

	render() {
		return (
			<View style={styles.elements.flex1}>
				<NavigationBar
					title={{ text: this.props.contentItem.description }}
					showBackButton={true}
					light={helpers.isIOS()}
				/>
				<TabbedPager
					ref={(ref) => {
						if (ref) {
							this.pager = ref;
						}
					}}
					tabs={this.state.tabs}
					initialPage={this.state.initialPage}
				/>
			</View>
		);
	}

}

DealsTemplate.propTypes = {
	categoryIncludes: PropTypes.object,
	contentItem: PropTypes.object,
	navigator: PropTypes.object,
	selectedTab: PropTypes.string,
};

export default connect((state) => ({ categoryIncludes: state.contentReducer.categoryIncludes }), null)(DealsTemplate);
