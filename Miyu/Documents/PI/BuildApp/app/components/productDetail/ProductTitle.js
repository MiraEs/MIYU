'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	ViewPropTypes,
} from 'react-native';
import { Text } from 'BuildLibrary';
import styles from '../../lib/styles';

const componentStyles = StyleSheet.create({
	container: {
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingVertical: styles.measurements.gridSpace2,
	},
	title: {
		flexWrap: 'wrap',
	},
	titleAndPrice: {
		flex: 1,
		flexDirection: 'row',
		marginBottom: styles.measurements.gridSpace1,
	},
	flex: {
		flex: 1,
	},
});

export default class ProductTitle extends Component {

	render() {
		const { manufacturer, sku, bci, style } = this.props;

		return (
			<View style={[componentStyles.container, style]}>
				<View style={componentStyles.titleAndPrice}>
					<View
						accessibilityLabel="Product Title"
						style={[styles.elements.flex, componentStyles.flex]}
					>
						<Text
							weight="bold"
							family="archer"
							size="larger"
							style={componentStyles.title}
						>
							{manufacturer} {sku}
						</Text>
						<Text
							size="small"
							color="greyDark"
							selectable={true}
						>
							Item # bci{bci}
						</Text>
					</View>
				</View>
			</View>
		);
	}

}

ProductTitle.propTypes = {
	bci: PropTypes.number,
	manufacturer: PropTypes.string,
	sku: PropTypes.string,
	style: ViewPropTypes.style,
};

ProductTitle.defaultProps = {
	style: {},
};
