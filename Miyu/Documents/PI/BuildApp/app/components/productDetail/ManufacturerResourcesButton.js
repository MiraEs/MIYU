import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from '@expo/ex-navigation';
import { Keyboard } from 'react-native';
import { connect } from 'react-redux';
import TappableListItem from '../TappableListItem';
import productConfigurationHelpers from '../../lib/ProductConfigurationHelpers';

@withNavigation
export class ManufacturerResourcesButton extends Component {

	onManufacturerResourcesPress = () => {
		const { compositeId } = this.props;
		Keyboard.dismiss();
		this.props.navigation.getNavigator('root').push('productAttachments', {
			compositeId,
		});
	};

	render() {
		if (this.props.attachmentCount) {
			return (
				<TappableListItem
					onPress={this.onManufacturerResourcesPress}
					body="Manufacturer Resources"
					accessibilityLabel="Manufacturer Resources Button"
				/>
			);
		}
		return null;
	}
}

ManufacturerResourcesButton.propTypes = {
	compositeId: PropTypes.number,
	attachmentCount: PropTypes.number,
	navigation: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
	const productComposite = productConfigurationHelpers.getProductComposite(ownProps.productConfigurationId) || {};
	return {
		attachmentCount: productComposite.attachmentCount,
		compositeId: productComposite.productCompositeId,
	};
};

export default connect(mapStateToProps)(ManufacturerResourcesButton);
