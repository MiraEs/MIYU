'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	FlatList,
	StyleSheet,
	View,
} from 'react-native';
import {
	Button,
	LinkButton,
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
import StoreCreditModal from '../../components/Returns/StoreCreditModal';
import SimplifiedProductInfo from '../../components/Returns/SimplifiedProductInfo';
import {
	submitReturn,
	updateItemInReturn,
} from '../../actions/ReturnsActions';
import CreditCardInfo from '../../components/CreditCardInfo';
import EventEmitter from '../../lib/eventEmitter';
import animations from '../../lib/animations';

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
	refundSummaryContainer: {
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
		marginTop: styles.measurements.gridSpace1,
	},
	refundSummaryUpper: {
		borderBottomWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
		padding: styles.measurements.gridSpace1,
	},
	refundSummaryLower: {
		padding: styles.measurements.gridSpace1,
	},
	refundSummaryRows: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	groupSummary: {
		margin: styles.measurements.gridSpace1,
	},
	itemsGroupWrapper: {
		borderColor: styles.colors.grey,
		borderWidth: styles.dimensions.borderWidth,
		marginHorizontal: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
	},
	itemsGroupList: {
		borderBottomColor: styles.colors.grey,
		borderBottomWidth: styles.dimensions.borderWidth,
		marginBottom: styles.measurements.gridSpace1,
	},
	item: {
		marginHorizontal: 0,
		marginBottom: 0,
	},
});

export class ReviewSubmitReturn extends Component {

	constructor(props) {
		super(props);

		this.state = {
			error: '',
		};
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:more:reviewsubmitreturn',
		};
	}

	displayStoreCreditModal() {
		EventEmitter.emit('showCustomScreenOverlay', {
			component: <StoreCreditModal />,
			animation: animations.fadeIn,
			overlayStyles: {
				justifyContent: 'center',
			},
		});
	}

	onContinuePress = () => {

	};

	onPressEditShippingMethod = () => {
		this.props.navigator.pop();
	};

	onPressEditItem = () => {
		this.props.navigator.pop(2);
	};

	renderItem({ item }) {
		return (
			<SimplifiedProductInfo
				{...item}
				headerRowAction={<LinkButton onPress={this.onPressEditItem}>Edit</LinkButton>}
				style={componentStyles.item}
			/>
		);
	};

	renderItemsGroup = ({ item: itemsGroup = {}, index }) => {
		const {
			items,
		} = itemsGroup;
		return (
			<View style={componentStyles.itemsGroupWrapper}>
				<FlatList
					data={items}
					keyExtractor={(item) => item.productUniqueId}
					renderItem={(itemObj) => this.renderItem(itemObj, index)}
					style={componentStyles.itemsGroupList}
				/>
				{this.renderGroupSummary(itemsGroup, index)}
			</View>
		);
	};

	renderGroupsForReturn = () => {
		return (
			<FlatList
				data={this.props.groupsForReturn}
				keyExtractor={(group) => group.id}
				renderItem={this.renderItemsGroup}
				style={{
					backgroundColor: styles.colors.greyLight,
					marginTop: styles.measurements.gridSpace2,
				}}
			/>
		);
	};

	renderGroupSummary = (group) => {
		return (
			<View style={componentStyles.groupSummary}>
				{this.renderShippingMethod(group.shippingMethod)}
				{this.renderRefundType(group.refund)}
				{this.renderRefundSummary(group.groupSummary)}
			</View>
		);
	}

	renderRefundSummary(groupSummary) {
		return (
			<View style={componentStyles.refundSummaryContainer}>
				<View style={componentStyles.refundSummaryUpper}>
					<View style={componentStyles.refundSummaryRows}>
						<Text>Original Cost of Items:</Text>
						<Text>{helpers.toUSD(groupSummary.originalCost)}</Text>
					</View>
					<View style={componentStyles.refundSummaryRows}>
						<Text>Collected Tax:</Text>
						<Text>{helpers.toUSD(groupSummary.tax)}</Text>
					</View>
					<View style={componentStyles.refundSummaryRows}>
						<Text>Return Shipping:</Text>
						<Text>{helpers.toUSD(groupSummary.returnShipping)}</Text>
					</View>
				</View>
				<View style={[componentStyles.refundSummaryRows, componentStyles.refundSummaryLower]}>
					<Text
						size="large"
						weight="bold"
					>
						Refund Total:
					</Text>
					<Text
						size="large"
						weight="bold"
					>
						{helpers.toUSD(groupSummary.total)}
					</Text>
				</View>
			</View>
		);
	}

	renderRefundType(refund) {
		let displayRefund;
		if (refund.type === 'Store Credit') {
			displayRefund = (
				<View style={styles.elements.flexRow}>
					<Text>Store Credit</Text>
					<LinkButton
						onPress={this.displayStoreCreditModal}
						style={{ marginLeft: styles.measurements.gridSpace1 }}
					>
						More Info
					</LinkButton>
				</View>
			);
		} else if (refund.type === 'Credit Card') {
			displayRefund = <CreditCardInfo {...refund.cardInfo} />;
		}
		return (
			<View>
				<Text
					weight="bold"
				>
					Refund Type:
				</Text>
				{displayRefund}
				<Text
					size="small"
					style={{ marginTop: styles.measurements.gridSpace1 }}
					weight="bold"
				>
					Refunds are issued approximately 8 days after items are received.
				</Text>
			</View>
		);
	}

	renderShippingMethod = (shippingMethod) => {
		// that is an em dash
		return (
			<View>
				<Text
					weight="bold"
				>
					Return Method:
				</Text>
				<View style={styles.elements.flexRow}>
					<Text>{shippingMethod.title} — {helpers.toUSD(shippingMethod.price)}</Text>
					<LinkButton
						onPress={this.onPressEditShippingMethod}
						style={{ marginLeft: styles.measurements.gridSpace1 }}
					>
						Edit
					</LinkButton>
				</View>
			</View>
		);
	}

	render() {
		return (
			<ScrollView style={styles.elements.screenGreyLight}>
				<StepText
					currentStep={3}
					maxStep={3}
				/>
				<View>
					<View style={componentStyles.itemsWrapper}>
						<Text
							size="large"
							weight="bold"
						>
							Review & Submit
						</Text>
						<Text>
							Please review all information and tap Create My Return.
						</Text>
						<ReturnPolicyLink />
					</View>
					{this.renderGroupsForReturn()}
					<Button
						onPress={this.onContinuePress}
						text="Create My Return"
						style={componentStyles.button}
						trackAction="Test"
						accessibilityLabel="Create My Return"
					/>
				</View>
			</ScrollView>
		);
	}
}

ReviewSubmitReturn.displayName = 'Review & Submit Return Screen';

ReviewSubmitReturn.route = {
	navigationBar: {
		title: 'Setup Return',
	},
};

ReviewSubmitReturn.propTypes = {
	actions: PropTypes.object.isRequired,
	groupsForReturn: PropTypes.array.isRequired,
	navigator: PropTypes.shape({
		pop: PropTypes.func,
		push: PropTypes.func,
		updateCurrentRouteParams: PropTypes.func,
	}),
};

ReviewSubmitReturn.defaultProps = {
	groupsForReturn: [],
};

export const mapStateToProps = (state) => {
	return {
		groupsForReturn: state.ReturnsReducer.returnInProgress.groupsForReturn,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			submitReturn,
			updateItemInReturn,
		}, dispatch),
	};
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(withScreen(ReviewSubmitReturn)));
