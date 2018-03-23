import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Image,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { Text } from 'build-library';
import helpers from '../../lib/helpers';
import styles from '../../lib/styles';

const componentStyles = StyleSheet.create({
	card: {
		flexDirection: 'row',
		backgroundColor: styles.colors.white,
		padding: styles.measurements.gridSpace1,
		paddingRight: styles.measurements.gridSpace2,
		marginRight: styles.measurements.gridSpace1,
		borderWidth: 1,
		borderColor: styles.colors.grey,
		maxWidth: styles.dimensions.width * 0.8,
		flexGrow: 1,
	},
	cardImage: {
		height: 60,
		width: 60,
		marginRight: styles.measurements.gridSpace1,
	},
	selectedCard: {
		borderColor: styles.colors.accent,
		borderWidth: 2,
		// this is here so the product info doesn't jump around when selected.
		// it offsets the extra large border
		padding: styles.measurements.gridSpace1 - 1,
	},
	cardText: {
		flexShrink: 1,
		justifyContent: 'center',
	},
});

class ProductConfigurationOptionButton extends Component {

	getStyle = () => {
		const styles = [componentStyles.card];
		if (this.props.isSelected) {
			return [...styles, componentStyles.selectedCard];
		}
		return styles;
	};

	render() {
		return (
			<TouchableOpacity
				onPress={this.props.onPress}
				style={this.getStyle()}
			>
				{
					this.props.imageURI && (
						<Image
							source={{
								uri: this.props.imageURI,
							}}
							resizeMode="contain"
							style={componentStyles.cardImage}
						/>
					)
				}
				<View style={componentStyles.cardText}>
					<Text
						weight="bold"
						size="small"
					>
						{this.props.text}
					</Text>
					{
						!!this.props.price &&
						<Text
							weight="bold"
							color="primary"
							size="small"
						>
							{helpers.toUSD(this.props.price)}
						</Text>
					}
				</View>
			</TouchableOpacity>
		);
	}

}

ProductConfigurationOptionButton.propTypes = {
	isSelected: PropTypes.bool,
	imageURI: PropTypes.string,
	onPress: PropTypes.func,
	text: PropTypes.string,
	price: PropTypes.number,
};

export default ProductConfigurationOptionButton;

