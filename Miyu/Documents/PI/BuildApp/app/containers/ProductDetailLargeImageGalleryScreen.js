/**
 * This component wraps the LargeImageGalleryScreen component.
 * This component is used to fetch the correct info from Redux and pass the
 * props and functions through to that component.
 * This component should be used if you are displaying a gallery of product
 * images that will be modifying a product config.
 */

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
	goToGalleryIndex,
} from '../actions/ProductDetailActions';
import { bindActionCreators } from 'redux';
import LargeImageGalleryScreen from '../components/LargeImageGalleryScreen';

export class ProductDetailLargeImageGalleryScreen extends Component {

	onNavigationPress = (index) => {
		const { productConfigurationId } = this.props;
		this.props.actions.goToGalleryIndex({
			index,
			productConfigurationId,
		});
	};

	render() {
		return (
			<LargeImageGalleryScreen
				{...this.props}
				onNavigationPress={this.onNavigationPress}
			/>
		);
	}
}

ProductDetailLargeImageGalleryScreen.route = {
	...LargeImageGalleryScreen.route,
};

ProductDetailLargeImageGalleryScreen.propTypes = {
	actions: PropTypes.object.isRequired,
	currentIndex: PropTypes.number.isRequired,
	images: PropTypes.array,
	navigator: PropTypes.shape({
		pop: PropTypes.func,
		updateCurrentRouteParams: PropTypes.func,
	}),
	productConfigurationId: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
};

ProductDetailLargeImageGalleryScreen.defaultProps = {
	currentIndex: 0,
};

export const mapStateToProps = (state, ownProps) => {
	const screenView = state.productDetailReducer.screenViews[ownProps.productConfigurationId] || {};
	return {
		currentIndex: screenView.imageGalleryIndex || ownProps.currentIndex,
	};
};

export const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			goToGalleryIndex,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetailLargeImageGalleryScreen);
