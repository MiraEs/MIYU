'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import helpers from '../lib/helpers';
import NavigationBar from '../components/NavigationBar';
import Pager from '../components/Library/Pager/Pager';
import styles from '../lib/styles';
import {
	Button,
	Text,
} from 'BuildLibrary';
import { getSelectedModel } from '../actions/UpsellActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import trackingActions from '../lib/analytics/TrackingActions';
import { getProductSpecs } from '../actions/ProductDetailActions';
import ModelDetailPage from '../components/ModelDetailPage';
import { trackState } from '../actions/AnalyticsActions';

const {
	width,
} = styles.dimensions;

const componentStyles = StyleSheet.create({
	mainWrapper: {
		flex: 1,
		backgroundColor: styles.colors.white,
	},
	header: {
		flexDirection: 'row',
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingVertical: styles.measurements.gridSpace2,
		backgroundColor: styles.colors.lightGray,
	},
	pagerStyles: {
		width,
		flex: 1,
	},
	markerStyle: {
		borderTopWidth: styles.dimensions.borderWidth,
		borderTopColor: styles.colors.lightGray,
	},
});

export class ModelDetailPickerScreen extends Component {
	constructor(props) {
		super(props);
		this._currentPageIndex = 0;
	}

	componentDidMount() {
		this.props.actions.trackState('build:app:modeldetailpicker');
		this.onPageChanged(0);
	}

	onBackPress = () => {
		this.props.navigator.pop();
	};

	onPageChanged = (curIndex) => {
		this._currentPageIndex = curIndex;
		const { actions, optionProducts, productsSpecs } = this.props;
		const currentProduct = optionProducts[curIndex];
		const compositeId = currentProduct.productDrop.productCompositeId;
		if (!productsSpecs || !productsSpecs[compositeId]) {
			actions.getProductSpecs(compositeId).done();
		}
	};

	choose = () => {
		const { actions, finish, optionId } = this.props;
		const selectedProduct = this.props.optionProducts[this._currentPageIndex];
		actions.getSelectedModel({
			finish,
			optionId,
			selectedProductCompositeId: selectedProduct.productDrop.productCompositeId,
		});
		this.props.navigator.pop();
	};

	renderPage = () => {
		const { optionProducts, productsSpecs } = this.props;
		return optionProducts.map((product, index) => {
			const specs = productsSpecs ? productsSpecs[product.productDrop.productCompositeId] : [];
			return (
				<ModelDetailPage
					key={index}
					finish={this.props.finish}
					product={product}
					productSpecs={specs}
				/>
			);
		});
	};

	render() {
		return (
			<View style={componentStyles.mainWrapper}>
				<NavigationBar
					leftNavButton={{
						icon: helpers.getIcon('arrow-back'),
						onPress: this.onBackPress,
					}}
				/>

				<View style={componentStyles.header}>
					<Text>Select </Text>
					<Text weight="bold">{this.props.productFriendlyName}</Text>
				</View>
				<Pager
					onPageChanged={this.onPageChanged}
					style={componentStyles.pagerStyles}
					markerStyle={componentStyles.markerStyle}
				>
					{this.renderPage()}
				</Pager>
				<View>
					<Button
						text="Select"
						onPress={this.choose}
						trackAction={trackingActions.RELATED_PRODUCT_CHOOSE_MODEL}
						accessibilityLabel="Choose Button"
					/>
				</View>
			</View>
		);
	}
}

ModelDetailPickerScreen.propTypes = {
	actions: PropTypes.object,
	finish: PropTypes.string,
	optionId: PropTypes.string.isRequired,
	optionProducts: PropTypes.array.isRequired,
	productFriendlyName: PropTypes.string.isRequired,
	productsSpecs: PropTypes.object,
	navigator: PropTypes.shape({
		pop: PropTypes.func,
	}),
};

const mapStateToProps = (state) => {
	return {
		productsSpecs: state.productDetailReducer.productsSpecs,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getSelectedModel,
			getProductSpecs,
			trackState,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModelDetailPickerScreen);
