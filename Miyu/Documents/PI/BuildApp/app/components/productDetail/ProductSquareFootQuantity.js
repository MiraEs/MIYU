'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
} from 'react-native';
import helpers from '../../lib/helpers';
import { Text } from 'build-library';
import { isFloat } from '../../lib/Validations';
import TooltipInput from '../../components/TooltipInput';

class ProductSquareFootQuantity extends Component {

	constructor(props) {
		super(props);

		this.state = {
			value: props.squareFootage ? props.squareFootage.toString() : null,
		};
	}

	componentWillMount() {
		this.props.onCartonCountChange(this.props.squareFootage);
	}

	componentWillReceiveProps({ squareFootage, squareFootagePerCarton }) {
		const previousCartonCount = this.getCartonCount(this.props.squareFootage, this.props.squareFootagePerCarton);
		const nextCartonCount = this.getCartonCount(squareFootage, squareFootagePerCarton);
		if (previousCartonCount !== nextCartonCount) {
			this.props.onCartonCountChange(nextCartonCount);
		}
	}

	getCartonCount = (squareFootage, squareFootagePerCarton) => {
		if (squareFootage === 0) {
			return 0;
		}
		return helpers.toInteger(squareFootage / squareFootagePerCarton) + 1;
	};

	focusInput = () => {
		this.input.focus();
	};

	handleChange = (event) => {
		this.setState({ value: event.nativeEvent.text });
	};

	validateNumber = (value) => {
		if (value) {
			return isFloat(value) || 'Please enter a valid number. E.g. 1234.2';
		}
	};

	renderTooltip = () => {
		const { squareFootagePerCarton, squareFootage, costPerSquareFoot, stockCount } = this.props;
		if (squareFootage) {
			const cartonCount = this.getCartonCount(squareFootage, squareFootagePerCarton);
			const coverage = cartonCount * squareFootagePerCarton;
			const cost = cartonCount * costPerSquareFoot;
			const coverageInStock = squareFootagePerCarton * stockCount;
			return (
				<View>
					<Text textAlign="center">{cartonCount} Cartons, Covers {helpers.toSqFt(coverage)} Sq. Ft.</Text>
					<Text
						textAlign="center"
						color="primary"
						weight="bold"
					>
						{helpers.toUSD(cost)}
					</Text>
					<Text
						textAlign="center"
						color="accent"
						weight="bold"
					>
						{helpers.toBigNumber(coverageInStock)} Sq. Ft. In Stock
					</Text>
				</View>
			);
		}
		return (
			<View>
				<Text
					lineHeight={Text.sizes.regular}
					textAlign="center"
					size="small"
					align="center"
					fontStyle="italic"
				>
					Enter square footage to see pricing
				</Text>
			</View>
		);
	};

	render() {
		return (
			<TooltipInput
				ref={(ref) => this.input = ref}
				label="Sq. Ft:"
				inputName="squareFootage"
				placeholder="Enter Square Footage"
				initValue="0"
				maxLength={5}
				onChange={this.handleChange}
				onChangeText={this.props.onSquareFootageChange}
				renderTooltip={this.renderTooltip}
				validationFunction={this.validateNumber}
				value={this.state.value}
				accessibilityLabel="Square Footage Input"
			/>
		);
	}

}

ProductSquareFootQuantity.propTypes = {
	costPerSquareFoot: PropTypes.number.isRequired,
	onSquareFootageChange: PropTypes.func.isRequired,
	onCartonCountChange: PropTypes.func.isRequired,
	squareFootage: PropTypes.number.isRequired,
	squareFootagePerCarton: PropTypes.number.isRequired,
	stockCount: PropTypes.number.isRequired,
};

ProductSquareFootQuantity.defaultProps = {
	onSquareFootageChange: helpers.noop,
	onCartonCountChange: helpers.noop,
	squareFootage: 0,
	squareFootagePerCarton: 0,
};

export default ProductSquareFootQuantity;
