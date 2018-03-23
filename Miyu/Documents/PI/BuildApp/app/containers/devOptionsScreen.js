'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Alert,
	StyleSheet,
	View,
} from 'react-native';
import {
	ListView,
	ScrollView,
	Text,
} from 'BuildLibrary';
import environment from '../lib/environment';
import simpleStore from 'react-native-simple-store';
import styles from '../lib/styles';
import TappableListItem from '../components/TappableListItem';
import { connect } from 'react-redux';
import EventEmitter from '../lib/eventEmitter';
import SimpleModal from '../components/SimpleModal';
import ListHeader from '../components/listHeader';
import { Device } from 'BuildNative';
import SimpleStoreHelpers from '../lib/SimpleStoreHelpers';
import SearchFilterInput from '../components/SearchFilterInput';

const componentStyles = StyleSheet.create({
	header: {
		padding: styles.measurements.gridSpace1,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.grey,
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
});

export class DevOptions extends Component {

	constructor(props) {
		super(props);

		this.state = {
			filterText: '',
		};

		this.optionEntries = {
			MISC: [{
				text: 'Modal',
				onPress: () => {
					EventEmitter.emit('showScreenOverlay', (
						<SimpleModal title="This is one sweet modal">
							<Text>This is a test of the simple modal system</Text>
						</SimpleModal>
					));
				},
			}, {
				text: 'Feature Switches',
				onPress: () => this.props.navigator.push('featureSwitches'),
			}, {
				text: 'Lookback',
				onPress: () => this.props.navigator.push('lookback'),
			}, {
				text: 'Customer Impersonator',
				onPress: () => this.props.navigator.push('customerImpersonator'),
			}, {
				text: 'Content',
				onPress: () => this.props.navigator.push('contentTest'),
			}, {
				text: 'Calendar Picker',
				onPress: () => this.props.navigation.getNavigator('root').push('calendarPicker', { zipCode: 12345 }),
			}, {
				text: 'Clear Simple Store',
				onPress: () => SimpleStoreHelpers.clearAllData(),
			}, {
				text: 'Save Redux Store to File',
				onPress: () => this.props.navigator.push('reduxStore'),
			}],
			'CART': [{
				text: 'Clear sessionCartId in local storage',
				onPress: () => {
					simpleStore.delete('SESSION_CART_ID')
					.then(() => Alert.alert('sessionCartId cleared', null, [{ text: 'OK' }]));
				},
			}],
			'QUOTES': [{
				text: 'Saved Cart Preview',
				onPress: () => {
					this.props.navigation.getNavigator('root').push('quoteScreen', {
						quoteNumber: 'DFN2SJZTXC',
					});
				},
			}],
			'CONTENT': [{
				text: 'Deals Screen',
				onPress: () => {
					this.props.navigator.push('content', {
						id: 9044,
					});
				},
			}, {
				text: 'Shared Promo',
				onPress: () => {
					this.props.navigator.push('content', {
						id: 9277,
					});
				},
			}],
			'SAMPLE PRODUCTS': [{
				text: 'Product from uniqueId only',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						uniqueId: 155078,
					});
				},
			}, {
				text: 'MAP',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 891188,
						uniqueId: 2257184,
					});
				},
			}, {
				text: 'Drought Non-Compliant',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 897210,
						uniqueId: 2266236,
					});
				},
			}, {
				text: 'Low Lead Non-Compliant',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 911060,
						uniqueId: 2284281,
					});
				},
			}, {
				text: 'Flooring with Sq Ft',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 754028,
						uniqueId: 1890271,
					});
				},
			}, {
				text: 'Keying Priced Options',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 433454,
						uniqueId: 1106069,
					});
				},
			}, {
				text: 'Multiple Priced Options (2 with $$$), Keying Options',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 288313,
						uniqueId: 981379,
					});
				},
			}, {
				text: 'Multiple Free Priced Options, Keying Options, Recommended Option',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 224898,
						uniqueId: 1663032,
					});
				},
			}, {
				text: 'Required Item',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 722539,
						uniqueId: 197112,
					});
				},
			}, {
				text: 'Multiple Options for 1 Required Item',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 563431,
						uniqueId: 174330,
					});
				},
			}, {
				text: 'Bundle',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 538144,
						uniqueId: 1882794,
					});
				},
			}, {
				text: 'Package',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 973765,
						uniqueId: 2415438,
					});
				},
			}, {
				text: 'GE Zipcode Functionality',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 809049,
						uniqueId: 2089885,
					});
				},
			}, {
				text: 'Not Low Lead Compliant with Replacement Item',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 723366,
						uniqueId: 1700534,
					});
				},
			}, {
				text: 'Has only may we suggest',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 758840,
						uniqueId: 1205899,
					});
				},
			}, {
				text: 'Has only configure accessory',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 192741,
						uniqueId: 638524,
					});
				},
			}, {
				text: 'Has too much lead',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 911060,
						uniqueId: 2284281,
					});
				},
			}, {
				text: 'Has Accessories',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 564472,
						uniqueId: 173044,
					});
				},
			}, {
				text: 'Discontinued',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 448203,
						uniqueId: 1103788,
					});
				},
			}, {
				text: 'Add To Cart Map Buster',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 832610,
						uniqueId: 2139022,
					});
				},
			}, {
				text: 'White Glove Delivery',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 957660,
						uniqueId: 2575275,
					});
				},
			}, {
				text: 'Product w/ Many Finishes',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 604580,
						uniqueId: 341938,
					});
				},
			}, {
				text: 'CA non Drought compliant',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 897210,
						uniqueId: 2266236,
					});
				},
			}, {
				text: 'Appliance with services not available in some areas',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 1121597,
						uniqueId: 2695314,
					});
				},
			}, {
				text: 'Crossed-out price, multi-select priced options, recommended product w/ long description',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 891188,
						uniqueId: 2257185,
					});
				},
			}, {
				text: 'Priced option, recommended product w/ long description, may we suggest page',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 492455,
						uniqueId: 1814256,
					});
				},
			}, {
				text: 'Fireplaces with a variety of priced options',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 628863,
						uniqueId: 575119,
					});
				},
			}, {
				text: 'Required option, may we suggest page',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 720176,
						uniqueId: 1520108,
					});
				},
			}, {
				text: 'Keying option, required interior handle option',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 507606,
						uniqueId: 1299687,
					});
				},
			}, {
				text: 'Multiple recommended options',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 849998,
						uniqueId: 2176323,
					});
				},
			}, {
				text: 'Extreme case of many priced options',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 1078092,
						uniqueId: 2589965,
					});
				},
			}, {
				text: 'Product with a Recommended AND Required product',
				onPress: () => {
					this.props.navigator.push('productDetail', {
						compositeId: 722547,
						uniqueId: 1020182,
					});
				},
			}],
		};
	}

	getOptions = () => {
		const { filterText } = this.state;
		if (filterText) {
			const options = {};
			Object.keys(this.optionEntries).forEach((sectionKey) => {
				const filteredItems = this.optionEntries[sectionKey].filter((option) => option.text.toLowerCase().indexOf(filterText) !== -1);
				if (filteredItems.length) {
					options[sectionKey] = filteredItems;
				}
			});
			return options;
		}
		return this.optionEntries;
	};

	renderRow = (option) => {
		return (
			<TappableListItem
				onPress={option.onPress}
				style={styles.elements.row}
				body={option.text}
			/>
		);
	};

	renderSectionHeader = (data, sectionId) => {
		return <ListHeader text={sectionId}/>;
	};

	renderHeader = () => {
		const items = [
			{
				label: 'Version',
				value: Device.appVersion,
			},
			{
				label: 'Build',
				value: Device.appBuild,
			},
			{
				label: 'Api',
				value: environment.api.url,
			},
			{
				label: 'Debug',
				value: Device.isDebug().toString(),
			},
			{
				label: 'Beta',
				value: Device.isBeta().toString(),
			},
			{
				label: 'Test',
				value: Device.isTest().toString(),
			},
		].map((item, index) => {
			return (
				<View
					key={index}
					style={componentStyles.headerRow}
				>
					<Text>{item.label}:</Text>
					<Text color="accent">{item.value}</Text>
				</View>
			);
		});
		return (
			<View>
				<View style={componentStyles.header}>
					{items}
				</View>
				<SearchFilterInput
					placeholder="Filter Options"
					onChangeText={(filterText) => {
						this.setState({ filterText });
					}}
					selectionColor={styles.colors.greyDark}
				/>
			</View>
		);
	};

	render() {
		const dataSource = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
		}).cloneWithRowsAndSections(this.getOptions());
		return (
			<ScrollView
				style={styles.elements.screenWithHeader}
				scrollsToTop={true}
			>
				<ListView
					style={styles.elements.screenWithHeader}
					enableEmptySections={true}
					dataSource={dataSource}
					renderHeader={this.renderHeader}
					renderSectionHeader={this.renderSectionHeader}
					renderRow={this.renderRow}
					scrollsToTop={true}
				/>
			</ScrollView>
		);
	}

}

DevOptions.route = {
	navigationBar: {
		title: 'Dev Options',
	},
};

DevOptions.propTypes = {
	user: PropTypes.object.isRequired,
	navigator: PropTypes.object,
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
};

export default connect((state) => {
	return {
		user: state.userReducer.user,
	};
})(DevOptions);
