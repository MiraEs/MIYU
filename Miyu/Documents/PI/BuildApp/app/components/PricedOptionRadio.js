import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import {
	Text,
	Image,
} from 'BuildLibrary';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
const componentStyles = StyleSheet.create({
	option: {
		padding: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
	},
	borderSelected: {
		borderWidth: styles.dimensions.borderWidthLarge,
		borderStyle: 'solid',
		borderColor: styles.colors.accent,
	},
	border: {
		borderWidth: styles.dimensions.borderWidth,
		borderStyle: 'solid',
		borderColor: styles.colors.grey,
	},
	image: {
		height: 80,
		width: 80,
	},
	wrapperView: {
		marginLeft: styles.measurements.gridSpace1,
		flex: 1,
	},
});

export default class PricedOptionRadio extends Component {
	constructor() {
		super();
		this.getStyle = this.getStyle.bind(this);
	}
	getStyle() {
		const {isSelected} = this.props;
		const style = [];
		style.push(componentStyles.option);
		style.push(styles.elements.centeredFlexRow);
		isSelected ? style.push(componentStyles.borderSelected) : style.push(componentStyles.border);
		return style;
	}
	renderImage() {
		const {image} = this.props;
		if (image) {
			return (
				<Image
					source={{uri: image}}
					style={componentStyles.image}
					resizeMode="contain"
				/>
			);
		}
	}
	renderPrice(cost) {
		if (cost) {
			return (
				<Text
					weight="bold"
					color="primary"
				>
					+{helpers.toUSD(cost)}
				</Text>
			);
		}
	}
	render() {
		const {onPress, cost, optionText} = this.props;
		return (
			<TouchableOpacity onPress={onPress}>
				<View
					style={this.getStyle()}
				>
					{this.renderImage()}
					<View style={componentStyles.wrapperView}>
						<Text>{optionText}</Text>
						{this.renderPrice(cost)}
					</View>
				</View>
			</TouchableOpacity>
		);
	}
}

PricedOptionRadio.propTypes = {
	image: PropTypes.string,
	isSelected: PropTypes.bool.isRequired,
	optionText: PropTypes.string.isRequired,
	onPress: PropTypes.func.isRequired,
	cost: PropTypes.number,
};
