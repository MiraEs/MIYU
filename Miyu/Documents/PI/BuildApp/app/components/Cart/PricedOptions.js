'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	TouchableOpacity,
} from 'react-native';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from 'BuildLibrary';


const componentStyles = StyleSheet.create({
	component: {
		marginTop: styles.measurements.gridSpace1,
	},
	button: {
		flex: 0,
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: styles.measurements.gridSpace1,
	},
	icon: {
		marginLeft: styles.measurements.gridSpace1,
	},
	options: {
		marginTop: styles.measurements.gridSpace1,
	},
	optionRow: {
		flex: 1,
		flexWrap: 'wrap',
		marginLeft: styles.measurements.gridSpace1,
	},
	optionRowPrice: {
		marginLeft: styles.measurements.gridSpace2,
	},
});

class PricedOptions extends Component {
	static height = null;

	constructor(props) {
		super(props);

		this.onToggleDetails = this.onToggleDetails.bind(this);
		this.renderOptions = this.renderOptions.bind(this);

		this.state = {
			hasOptions: props.options && props.options.length > 0,
			showDetails: false,
		};
	}

	onToggleDetails() {
		this.setState({ showDetails: !this.state.showDetails });
	}

	renderOptions() {

		if (this.state.showDetails) {

			return this.props.options.map((option, index) => {
				const text = `${option.optionName} ${option.optionValue} ${option.keyCode ? option.keyCode : ''}`;
				let price = <View/>;

				if (option.cost > 0 ) {
					price = (
						<Text
							size="small"
							color="primary"
							weight="bold"
						>
							{`+${helpers.toUSD(option.cost)}`}
						</Text>
					);
				}

				return (
					<View key={index}>
						<View style={styles.elements.leftFlexRow}>
							<Text>{String.fromCharCode('8226')}</Text>
							<View style={componentStyles.optionRow}>
								<Text size="small">{text}</Text>
							</View>
						</View>
						<View style={componentStyles.optionRowPrice}>
							{price}
						</View>
					</View>
				);
			});
		}
	}

	render() {
		const text = this.state.showDetails ? 'Hide' : 'Show';
		const icon = this.state.showDetails ? 'arrow-up' : 'arrow-down';

		if (this.state.hasOptions) {

			return (
				<View style={componentStyles.component}>
					{this.renderOptions()}
					<TouchableOpacity
						onPress={this.onToggleDetails}
					>
						<View style={componentStyles.button}>
							<Text
								size="small"
								color="primary"
								lineHeight={false}
							>
								{text} Details
							</Text>
							<Icon
								style={componentStyles.icon}
								name={helpers.getIcon(icon)}
								color={styles.colors.primary}
								size={25}
							/>
						</View>
					</TouchableOpacity>
				</View>
			);
		}

		return null;
	}
}

PricedOptions.propTypes = {
	options: PropTypes.array.isRequired,
};

PricedOptions.defaultProps = {
	options: [],
};

export default PricedOptions;
