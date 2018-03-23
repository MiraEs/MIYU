
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { Text } from 'build-library';
import productHelpers from '../../lib/productHelpers';

class StockCount extends Component {

	render() {
		const {
			availableByLocation,
			squareFootageBased,
			discontinued,
			selectedFinish,
		} = this.props;
		if (availableByLocation || !selectedFinish || squareFootageBased || discontinued) {
			// square footage based stock shows in a different location and
			// and shows square footage in stock rather than cartons in stock
			// also, we don't show any stock for discontinued products
			return null;
		}

		const stockCountText = productHelpers.getStockText(selectedFinish, selectedFinish.leadTimeInformation);

		const textProps = {
			weight: 'bold',
		};

		textProps.color = stockCountText === 'Special Order' ? 'error' : 'accent';

		return <Text {...textProps}>{stockCountText}</Text>;
	}

}

StockCount.propTypes = {
	availableByLocation: PropTypes.bool,
	squareFootageBased: PropTypes.bool,
	discontinued: PropTypes.bool,
	selectedFinish: PropTypes.object,
};

export default StockCount;
