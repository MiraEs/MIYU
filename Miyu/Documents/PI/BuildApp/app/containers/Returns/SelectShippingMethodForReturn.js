'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	FlatList,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import {
	Button,
	ScrollView,
	Text,
	withScreen,
} from 'BuildLibrary';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	withNavigation,
} from '@expo/ex-navigation';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';
import ReturnPolicyLink from '../../components/Returns/ReturnPolicyLink';
import StepText from '../../components/Returns/StepText';
import SimplifiedProductInfo from '../../components/Returns/SimplifiedProductInfo';
import { updateShippingMethods } from '../../actions/ReturnsActions';
import cloneDeep from 'lodash.clonedeep';
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
	shippingMethodWrapper: {
		marginHorizontal: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace1,
		padding: styles.measurements.gridSpace1,
		borderColor: styles.colors.grey,
		borderWidth: styles.dimensions.borderWidth,
	},
	selectedShippingMethod: {
		borderColor: styles.colors.accent,
		borderWidth: styles.dimensions.borderWidthLarge,
		padding: styles.measurements.gridSpace1 - (styles.dimensions.borderWidthLarge - styles.dimensions.borderWidth),
	},
	itemsListWrapper: {
		borderBottomColor: styles.colors.grey,
		borderBottomWidth: styles.dimensions.borderWidth,
		marginBottom: styles.measurements.gridSpace1,
	},
	itemsGroupWrapper: {
		borderColor: styles.colors.grey,
		borderWidth: styles.dimensions.borderWidth,
		marginHorizontal: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
	},
	item: {
		marginHorizontal: 0,
		marginBottom: 0,
	},
});

export class SelectShippingMethodForReturn extends Component {

	constructor(props) {
		super(props);

		this.state = {
			error: '',
		};
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:more:selectshippingforreturn',
		};
	}

	onContinuePress = () => {
		const { actions, itemsGroups } = this.props;
		const allItemsAreValid = itemsGroups.reduce((prev, group) => prev && group.shippingMethods &&
				group.shippingMethods.reduce((prev, method) => prev || !!method.selected, false), true);

		if (!allItemsAreValid) {
			actions.showAlert(
				'To continue, please select the return shipping method for each group of items.',
				'error',
				undefined,
				undefined,
				5000
			);
			return;
		}

		this.props.navigator.push('reviewSubmitReturn');
	};

	onPressShippingMethod = (method, groupIndex, shippingIndex) => {
		const { actions, itemsGroups } = this.props;
		const tempShippingMethods = cloneDeep(itemsGroups[groupIndex].shippingMethods);
		actions.updateShippingMethods({
			groupIndex,
			shippingMethods: [
				...tempShippingMethods.map((method, index) => ({
					...method,
					selected: index === shippingIndex,
				})),
			],
		});
	};

	renderItem({ item }) {
		return (
			<SimplifiedProductInfo
				{...item}
				style={componentStyles.item}
			/>
		);
	};

	renderItemsGroup = ({ item: itemsGroup = {}, index }) => {
		const {
			items,
			shippingMethods,
		} = itemsGroup;
		const { userIsPro } = this.props;
		return (
			<View style={componentStyles.itemsGroupWrapper}>
				<FlatList
					data={items}
					keyExtractor={(item) => item.productUniqueId}
					renderItem={this.renderItem}
					style={componentStyles.itemsListWrapper}
				/>
				<FlatList
					data={shippingMethods.filter((method) => !method.isPro || userIsPro)}
					keyExtractor={(method) => method.title}
					renderItem={(listObj) => this.renderShippingMethod(listObj, index)}
				/>
			</View>
		);
	};

	renderItemsGroups = () => {
		return (
			<FlatList
				data={this.props.itemsGroups}
				keyExtractor={(group) => group.id}
				renderItem={this.renderItemsGroup}
				style={{
					backgroundColor: styles.colors.greyLight,
					marginTop: styles.measurements.gridSpace2,
				}}
			/>
		);
	};

	renderShippingMethod = ({ item: method, index: shippingIndex }, groupIndex) => {
		let additionalStyles = {};
		if (method.selected) {
			additionalStyles = componentStyles.selectedShippingMethod;
		}

		// that is an em-dash after the title
		return (
			<TouchableOpacity
				onPress={() => this.onPressShippingMethod(method, groupIndex, shippingIndex)}
				trackAction="test"
			>
				<View style={[componentStyles.shippingMethodWrapper, additionalStyles]}>
					<Text
						lineHeight={false}
						size="large"
						style={{ marginBottom: styles.measurements.gridSpace1 }}
						weight="bold"
					>
						{method.title} — {method.price ? helpers.toUSD(method.price) : 'cost unknown'}
					</Text>
					<Text>{method.description}</Text>
				</View>
			</TouchableOpacity>
		);
	}

	render() {
		return (
			<ScrollView style={styles.elements.screenGreyLight}>
				<StepText
					currentStep={2}
					maxStep={3}
				/>
				<View>
					<View style={componentStyles.itemsWrapper}>
						<Text
							size="large"
							weight="bold"
						>
							Choose Return Shipping Method
						</Text>
						<Text>
							<Text weight="bold">Items are grouped based on the
							warehouse they shipped from.</Text> The need to be
							returned to the same warehouse. Please select your
							shipping methods and tap Continue to Review.
						</Text>
						<ReturnPolicyLink />
					</View>
					{this.renderItemsGroups()}
					<Button
						onPress={this.onContinuePress}
						text="Continue to Review"
						style={componentStyles.button}
						trackAction="Test"
						accessibilityLabel="Continue to Review"
					/>
				</View>
			</ScrollView>
		);
	}
}

SelectShippingMethodForReturn.displayName = 'Select Items for Return Screen';

SelectShippingMethodForReturn.route = {
	navigationBar: {
		title: 'Setup Return',
	},
};

SelectShippingMethodForReturn.propTypes = {
	actions: PropTypes.object.isRequired,
	itemsGroups: PropTypes.array.isRequired,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
	userIsPro: PropTypes.bool,
};

SelectShippingMethodForReturn.defaultProps = {
	itemsGroups: [],
};

export const mapStateToProps = (state) => {
	return {
		itemsGroups: state.ReturnsReducer.returnInProgress.itemsGroups,
		userIsPro: state.userReducer.user.isPro,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			showAlert,
			updateShippingMethods,
		}, dispatch),
	};
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(withScreen(SelectShippingMethodForReturn)));
