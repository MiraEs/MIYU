import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { Keyboard } from 'react-native';
import { withNavigation } from '@expo/ex-navigation';
import { connect } from 'react-redux';
import TappableListItem from '../TappableListItem';
import productConfigurationHelpers from '../../lib/ProductConfigurationHelpers';

@withNavigation
export class ProductQAndAButton extends Component {

	onQAndAPress = () => {
		const { compositeId } = this.props;
		Keyboard.dismiss();
		this.props.navigation.getNavigator('root').push('productQAndA', {
			compositeId,
		});
	};

	render() {
		if (this.props.productQuestions.length) {
			return (
				<TappableListItem
					onPress={this.onQAndAPress}
					body="Product Q&A"
					accessibilityLabel="Product Q and A Button"
				/>
			);
		}
		return null;
	}

}

ProductQAndAButton.propTypes = {
	productQuestions: PropTypes.array,
	compositeId: PropTypes.number,
	navigation: PropTypes.object,
};

ProductQAndAButton.defaultProps = {};

const mapStateToProps = (state, ownProps) => {
	const productComposite = productConfigurationHelpers.getProductComposite(ownProps.productConfigurationId) || {};
	return {
		productQuestions: productComposite.productQuestions || [],
		compositeId: productComposite.productCompositeId,
	};
};

export default connect(mapStateToProps)(ProductQAndAButton);

