'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	FlatList,
	ScrollView,
	StyleSheet,
	View,
} from 'react-native';
import {
	Button,
	KeyboardSpacer,
	Text,
	withScreen,
} from 'BuildLibrary';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	withNavigation,
} from '@expo/ex-navigation';
import styles from '../../lib/styles';
import ReturnPolicyLink from '../../components/Returns/ReturnPolicyLink';
import ItemForReturn from '../../components/Returns/ItemForReturn';
import StepText from '../../components/Returns/StepText';
import { updateItemInReturn } from '../../actions/ReturnsActions';
import { showAlert } from '../../actions/AlertActions';

const componentStyles = StyleSheet.create({
	button: {
		marginHorizontal: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace2,
	},
	itemsWrapper: {
		backgroundColor: styles.colors.white,
		paddingHorizontal: styles.measurements.gridSpace1,
	},
});

export class SelectItemsForReturn extends Component {

	itemRefs = [];
	scroll = {};

	setScreenTrackingInformation() {
		return {
			name: 'build:app:more:selectitemsforreturn',
		};
	}

	keyExtractor(item) {
		return item.productUniqueId;
	}

	onUpdateItem = (index, partialItem) => {
		const { actions } = this.props;
		actions.updateItemInReturn({
			item: {
				...partialItem,
			},
			index,
		});
	}

	onContinuePress = () => {
		const { actions, items } = this.props;
		const selectedRefs = [];
		const selectedItems = items.filter((item, index) => {
			if (item.selected) {
				selectedRefs.push(this.itemRefs[index]);
			}
			return item.selected;
		});

		if (!selectedItems.length) {
			actions.showAlert(
				'To continue, please select the items you wish to return.',
				'error',
				undefined,
				undefined,
				5000
			);
			return;
		}

		const allItemsAreValid = selectedRefs.reduce((prev, curr) => prev && curr && curr.valid, true);
		if (!allItemsAreValid) {
			actions.showAlert(
				'To continue, please select the reasons why you are returning each item.',
				'error',
				undefined,
				undefined,
				5000
			);
			return;
		}

		// time to submit the items
		this.props.navigator.push('selectShippingMethodForReturn');
	}

	toggleItemSelected = (index) => {
		const { actions, items } = this.props;
		actions.updateItemInReturn({
			item: {
				selected: !items[index].selected,
			},
			index,
		});
	};

	renderItem = ({ index, item }) => {
		return (
			<ItemForReturn
				ref={(ref) => this.itemRefs[index] = ref}
				index={index}
				item={item}
				onUpdateItem={this.onUpdateItem}
				parentScrollHandle={this.scroll}
			/>
		);
	}

	renderItems = () => {
		return (
			<FlatList
				data={this.props.items}
				keyExtractor={this.keyExtractor}
				renderItem={this.renderItem}
				style={{
					backgroundColor: styles.colors.greyLight,
					marginTop: styles.measurements.gridSpace2,
				}}
			/>
		);
	};

	render() {
		return (
			<ScrollView
				ref={(ref) => {
					if (ref) {
						this.scroll = ref;
					}
				}}
				style={styles.elements.screenGreyLight}
			>
				<StepText
					currentStep={1}
					maxStep={3}
				/>
				<View>
					<View style={componentStyles.itemsWrapper}>
						<Text
							size="large"
							weight="bold"
						>
							Select Items to Return
						</Text>
						<Text>
							You may initiate a return for an item(s) within 30
							days of receipt for a full refund to your original
							payment method. Returns requested between 31 and 60
							days after receipt will only qualify for store credit.
						</Text>
						<ReturnPolicyLink />
					</View>
					{this.renderItems()}
					<Button
						onPress={this.onContinuePress}
						text="Continue"
						style={componentStyles.button}
						trackAction="Test"
						accessibilityLabel="Continue"
					/>
				</View>
				<KeyboardSpacer/>
			</ScrollView>
		);
	}
}

SelectItemsForReturn.displayName = 'Select Items for Return Screen';

SelectItemsForReturn.route = {
	navigationBar: {
		title: 'Setup Return',
	},
};

SelectItemsForReturn.propTypes = {
	actions: PropTypes.object.isRequired,
	items: PropTypes.array.isRequired,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
};

SelectItemsForReturn.defaultProps = {
	items: [],
};

export const mapStateToProps = (state) => {
	return {
		items: state.ReturnsReducer.returnInProgress.items,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			showAlert,
			updateItemInReturn,
		}, dispatch),
	};
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(withScreen(SelectItemsForReturn)));
