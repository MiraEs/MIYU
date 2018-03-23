'use strict';
import React, {
	PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	ViewPropTypes,
} from 'react-native';
import {
	Image,
	Text,
} from 'BuildLibrary';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';
import {
	IMAGE_75,
	PRODUCT_SECTION,
} from '../../constants/CloudinaryConstants';

const componentStyles = StyleSheet.create({
	itemWrapper: {
		backgroundColor: styles.colors.white,
		marginHorizontal: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace2,
		padding: styles.measurements.gridSpace1,
		borderWidth: styles.dimensions.borderWidthLarge,
		borderColor: styles.colors.white,
	},
	descriptionColumn: {
		marginLeft: styles.measurements.gridSpace1,
	},
	descriptionRow: {
		marginBottom: styles.measurements.gridSpace1,
	},
	titleRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});

class SimplifiedProductInfo extends PureComponent {
	render() {
		const {
			children,
			finish,
			headerRowAction,
			image,
			manufacturer,
			productId,
			quantity,
			returnQuantity,
			showQuantity,
			style,
		} = this.props;
		const imageUri = helpers.getCloudinaryImageUrl({
			name: image,
			manufacturer,
			section: PRODUCT_SECTION,
			...IMAGE_75,
		});

		let quantityContent;
		if (quantity > 1 && showQuantity) {
			quantityContent = <Text>Quantity: {returnQuantity}</Text>;
		}

		return (
			<View style={[componentStyles.itemWrapper, style]}>
				<View style={[styles.elements.flexRow, componentStyles.descriptionRow]}>
					<Image
						source={imageUri}
						{...IMAGE_75}
					/>
					<View style={[styles.elements.flex1, componentStyles.descriptionColumn]}>
						<View style={componentStyles.titleRow}>
							<Text
								size="large"
								weight="bold"
							>
								{manufacturer} {productId}
							</Text>
							{headerRowAction}
						</View>
						<Text>Color/Finish: {finish}</Text>
						{quantityContent}
					</View>
				</View>
				{children}
			</View>
		);
	}
}

SimplifiedProductInfo.propTypes = {
	children: PropTypes.node,
	finish: PropTypes.string,
	headerRowAction: PropTypes.node,
	image: PropTypes.string,
	manufacturer: PropTypes.string,
	productId: PropTypes.string,
	quantity: PropTypes.number,
	returnQuantity: PropTypes.number,
	showQuantity: PropTypes.bool,
	style: ViewPropTypes.style,
};

SimplifiedProductInfo.defaultProps = {
	showQuantity: false,
};

export default SimplifiedProductInfo;
