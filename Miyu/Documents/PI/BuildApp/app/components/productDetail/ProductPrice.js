import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
	Keyboard,
} from 'react-native';
import { Text } from 'BuildLibrary';
import helpers from '../../lib/helpers';
import styles from '../../lib/styles';
import Triangle from '../Triangle';
import EventEmitter from '../../lib/eventEmitter';
import SimpleModal from '../SimpleModal';
import ProStamp from '../ProStamp';

const componentStyles = StyleSheet.create({
	container: {
		paddingHorizontal: styles.measurements.gridSpace1,
	},
	mapContainer: {
		marginVertical: styles.measurements.gridSpace1,
		padding: styles.measurements.gridSpace1,
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
		backgroundColor: styles.colors.white,
	},
	arrow: {
		position: 'absolute',
		top: 2,
		right: 19,
	},
	row: {
		flexDirection: 'row',
	},
});

class ProductPrice extends Component {

	onMoreInfoPress = () => {
		Keyboard.dismiss();
		EventEmitter.emit('showScreenOverlay', (
			<SimpleModal title="Why don't we show the price?">
				<View>
					<Text textAlign="justify">
						Many manufacturers require that retailers display the Minimum Advertised Price (MAP) on product pages. In order to sell a product for less than MAP, the retailer must convey the lower price in an additional step. The individual manufacturer’s MAP policy determines where the lower price can be seen. {'\n'} {'\n'}
						To see the lower Build.com price for this product, you'll need to place it in your shopping cart, and may need to proceed to final checkout. If you choose not to purchase the item, simply remove it from your shopping cart. {'\n'}{'\n'}
						It’s our goal to provide the best possible prices while adhering to manufacturers’ MAP policies. We apologize for any inconvenience this extra step has caused. Build.com is working to educate manufacturers on how their policies impact customers and their buying behavior.
					</Text>
				</View>
			</SimpleModal>
		));
	};

	renderConsumerPrice = () => {
		const { consumerPrice, cost, squareFootageBased, optionPriceTotal } = this.props;

		if (consumerPrice && cost) {
			const costText = squareFootageBased ? `${helpers.toUSD(consumerPrice/cost)}/sq ft` : helpers.toUSD(consumerPrice + optionPriceTotal);

			return (
				<Text
					size="small"
					color="greyDark"
				>
					Consumer Price {costText}
				</Text>
			);
		}
	};

	renderMSRP = () => {
		// don't show for MAP and discontinued products (discontinued doesn't have cost)
		const { squareFootageBased, hasMAP, msrp, cost } = this.props;

		if (!hasMAP && msrp && !squareFootageBased && (cost < msrp) ) {
			return (<Text size="small">Retail Price {helpers.toUSD(msrp)}, You Save {Math.ceil(((msrp - cost) / msrp) * 100)}%</Text>);
		}
	};

	renderProSavings = () => {
		const { consumerPrice, cost, minPrice, squareFootageBased } = this.props;

		if (minPrice && consumerPrice && cost) {
			const costText = squareFootageBased ? `${helpers.toUSD((consumerPrice - minPrice)/cost)}/sq ft` : helpers.toUSD(consumerPrice - minPrice);

			return (
				<Text
					color="accent"
					size="small"
				>
					Pro Savings {costText}
				</Text>
			);
		}
	};

	renderProPricing = () => {
		return (
			<View>
				{this.renderPrice()}
				<Text>
					{this.renderConsumerPrice()}{' '}
					{this.renderProSavings()}
				</Text>
			</View>
		);
	};

	renderPrice = () => {
		const { minPrice, cost, hasMAP, squareFootageBased, optionPriceTotal } = this.props;

		const costText = squareFootageBased ? `${helpers.toUSD(minPrice/cost)}/sq ft` : helpers.toUSD(cost + optionPriceTotal);
		const hasMAPProps = hasMAP ? { decoration: 'line-through' } : {};
		return (
			<View
				accessibilityLabel="Product Price"
				style={componentStyles.row}
			>
				<Text
					size="larger"
					weight="bold"
					{...hasMAPProps}
				>
					{costText}
				</Text>
				{this.renderProLogo()}
			</View>
		);
	};

	renderMAPNotice = () => {
		if (this.props.hasMAP) {
			return (
				<View>
					<View style={componentStyles.mapContainer}>
						<Text textAlign="center">
							<Text
								fontStyle="italic"
								textAlign="center"
							>
								To see our price, please add this item to your cart.{' '}
							</Text>
							<Text
								color="primary"
								onPress={this.onMoreInfoPress}
							>
								More Info
							</Text>
						</Text>
					</View>
					<Triangle style={componentStyles.arrow}/>
				</View>
			);
		}
	};

	renderProLogo = () => {
		const { isProPricing } = this.props;

		if (isProPricing) {
			return <ProStamp />;
		}
	};

	renderPriceBlock = () => {
		if (!this.props.cost) {
			// no cost on discontinued products
			return null;
		}
		const { isProPricing } = this.props;

		if (isProPricing) {
			return this.renderProPricing();
		}

		return (
			<View>
				{this.renderPrice()}
				{this.renderMSRP()}
			</View>
		);
	};

	render() {
		return (
			<View style={componentStyles.container}>
				{this.renderPriceBlock()}
				{this.renderMAPNotice()}
			</View>
		);
	}

}

ProductPrice.propTypes = {
	consumerPrice: PropTypes.number,
	cost: PropTypes.number,
	hasMAP: PropTypes.bool,
	isProPricing: PropTypes.bool,
	minPrice: PropTypes.number,
	msrp: PropTypes.number,
	optionPriceTotal: PropTypes.number,
	squareFootageBased: PropTypes.bool,
};

ProductPrice.defaultProps = {
	hasMAP: false,
	squareFootageBased: false,
	optionPriceTotal: 0,
};

export default ProductPrice;
