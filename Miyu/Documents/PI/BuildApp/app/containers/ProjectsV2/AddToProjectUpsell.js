import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	findNodeHandle,
	StyleSheet,
	View,
} from 'react-native';
import {
	Button,
	ListView,
	withScreen,
} from 'BuildLibrary';
import { NavigationStyles } from '@expo/ex-navigation';
import RelatedProductForProjectsUpsell from '../../components/ShoppingList/RelatedProductForProjectsUpsell';
import ListHeader from '../../components/listHeader';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';
import TrackingActions from '../../lib/analytics/TrackingActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getRelatedUpsellProducts } from '../../actions/UpsellActions';
import {
	addSessionCartSubItem,
	addSessionCartItems,
} from '../../actions/CartActions';
import { ANIMATION_TIMEOUT_200 } from '../../constants/AnimationConstants';
import NavigationBarIconButton from '../../components/navigationBar/NavigationBarIconButton';
import { navigatorPop } from '../../actions/NavigatorActions';

const componentStyles = StyleSheet.create({
	separator: {
		height: styles.dimensions.borderWidthLarge,
		backgroundColor: styles.colors.grey,
	},
	rowBackground: {
		backgroundColor: styles.colors.white,
	},
});

export class AddToProjectUpsell extends Component {

	state = {
		upsellAdded: false,
	};

	setScreenTrackingInformation() {
		return {
			name: 'build:app:projectupsell',
		};
	}

	getScreenData = () => {
		const { compositeId, actions, finish, productConfigurationId } = this.props;
		actions.getRelatedUpsellProducts(compositeId, finish, productConfigurationId);
	};

	onPressContinue = () => {
		this.props.navigation.getNavigator('root').pop();
	};

	onQuantityInputFocus = (ref) => {
		setTimeout(() => {
			const scrollResponder = this.listView.getScrollResponder();

			scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
				findNodeHandle(ref),
				120,
				true
			);
		}, ANIMATION_TIMEOUT_200);
	};

	getDataSource = () => {
		const { recommendedOptions, accessories } = this.props;
		const data = {};
		const required = recommendedOptions.filter((option) => option.optionType.toLowerCase() === 'required');
		const recommended = recommendedOptions.filter((option) => option.optionType.toLowerCase() === 'recommended');
		const suggestions = accessories.filter((option) => option.crossSellType.toLowerCase() === 'accessory');

		if (required.length) {
			data['REQUIRED FOR INSTALL'] = required;
		}
		if (recommended.length) {
			data['YOU MAY NEED'] = recommended;
		}
		if (suggestions.length) {
			data['MAY WE SUGGEST'] = suggestions;
		}
		return new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
			sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
		}).cloneWithRowsAndSections(data);
	};

	renderRow = (option) => {
		let { productConfiguration } = option;
		// sometimes productConfiguration is null
		if (!productConfiguration) {
			productConfiguration = {};
		}
		const isSuggestedItem = !option.application;

		let titlePrimary;
		let titleSecondary;
		let friendlyName;
		let whyText;

		if (isSuggestedItem) {
			titlePrimary = `${option.productDrop.manufacturer} ${option.productDrop.productId}`;
			titleSecondary = option.productDrop.title;
			friendlyName = option.productDrop.manufacturer;
		} else {
			titlePrimary = option.application;
			friendlyName = productConfiguration.friendlyName;
			whyText = productConfiguration.whyText;
		}

		return (
			<View style={componentStyles.rowBackground}>
				<RelatedProductForProjectsUpsell
					compositeId={this.props.compositeId}
					friendlyName={friendlyName}
					id={option.id}
					isSuggestedItem={isSuggestedItem}
					neededQuantity={this.props.addedProductQuantity}
					optionType={option.optionType || option.crossSellType}
					optionProducts={option.optionProducts}
					onQuantityInputFocus={this.onQuantityInputFocus}
					parentKey={this.props.parentKey}
					selectedDrop={option.selectedDrop || option.productDrop}
					selectedFinish={option.selectedFinish}
					selectedSessionCartIDs={this.props.selectedSessionCartIDs}
					titlePrimary={titlePrimary}
					titleSecondary={titleSecondary}
					whyText={whyText}
				/>
			</View>
		);
	};

	renderSectionHeader = (data, sectionId) => {
		return (
			<ListHeader
				text={sectionId}
				accessibilityLabel={`productUpsellHeader${sectionId.replace(/\s/g, '')}`}
			/>
		);
	};

	renderSeparator = (sectionId, rowId) => {
		return (
			<View
				key={`${sectionId}${rowId}`}
				style={componentStyles.separator}
			/>);
	};

	render() {
		return (
			<View style={styles.elements.screenGreyLight}>
				<ListView
					ref={(ref) => this.listView = ref}
					dataSource={this.getDataSource()}
					enableEmptySections={true}
					style={styles.elements.flex}
					keyboardShouldPersistTaps="always"
					renderRow={this.renderRow}
					renderSeparator={this.renderSeparator}
					renderSectionHeader={this.renderSectionHeader}
					accessibilityLabel="Related Products"
				/>
				<Button
					textColor="secondary"
					color="white"
					onPress={this.onPressContinue}
					text="Continue"
					accessibilityLabel="Continue"
					style={styles.elements.noFlex}
					trackAction={TrackingActions.PROJECT_UPSELL_CONTINUE}
				/>
			</View>
		);
	}

}

AddToProjectUpsell.route = {
	styles: {
		...NavigationStyles.SlideVertical,
		gestures: null,
	},
	navigationBar: {
		visible: true,
		title: 'Related Products',
		renderLeft() {
			return (
				<NavigationBarIconButton
					iconName={helpers.getIcon('close')}
					onPress={() => navigatorPop('root')}
					trackAction={TrackingActions.PROJECT_UPSELL_NAV_TAP_CLOSE}
				/>
			);
		},
	},
};

AddToProjectUpsell.propTypes = {
	actions: PropTypes.object.isRequired,
	accessories: PropTypes.array,
	compositeId: PropTypes.number.isRequired,
	finish: PropTypes.object,
	recommendedOptions: PropTypes.array.isRequired,
	sessionCartId: PropTypes.number.isRequired,
	addedProductQuantity: PropTypes.number.isRequired,
	productConfigurationId: PropTypes.string.isRequired,
	projectIds: PropTypes.array,
	parentKey: PropTypes.number.isRequired,
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
	navigator: PropTypes.shape({
		updateCurrentRouteParams: PropTypes.func,
	}),
	selectedSessionCartIDs: PropTypes.object.isRequired,
};

AddToProjectUpsell.defaultProps = {
	accessories: [],
	addedProductQuantity: 1,
	projectIds: [],
	recommendedOptions: [],
};

const mapStateToProps = ({ upsellReducer, cartReducer }) => {
	return {
		sessionCartId: cartReducer.cart.sessionCartId,
		recommendedOptions: upsellReducer.recommendedOptions,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			addSessionCartSubItem,
			addSessionCartItems,
			getRelatedUpsellProducts,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(AddToProjectUpsell));
