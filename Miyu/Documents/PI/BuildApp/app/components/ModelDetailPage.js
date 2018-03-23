'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import {
	ListView,
	ScrollView,
	Text,
	Image,
} from 'BuildLibrary';
import {
	IMAGE_175,
	PRODUCT_SECTION,
} from '../constants/CloudinaryConstants';
import styles from '../lib/styles';
import helpers from '../lib/helpers';

const {
	width,
} = styles.dimensions;

const componentStyles = StyleSheet.create({
	productPage: {
		width,
		paddingHorizontal: styles.measurements.gridSpace2,
	},
	title: {
		marginTop: styles.measurements.gridSpace2,
	},
	price: {
		marginTop: styles.measurements.gridSpace1,
	},
	imageWrapper: {
		alignItems: 'center',
	},
	spec: {
		paddingVertical: styles.measurements.gridSpace1,
		paddingHorizontal: styles.measurements.gridSpace2,
	},
	list: {
		paddingTop: styles.measurements.gridSpace1,
	},
	lightSpec: {
		backgroundColor: styles.colors.white,
	},
	darkSpec: {
		backgroundColor: styles.colors.lightGray,
	},
});

export default class ModelDetailPage extends Component {

	getImageUri = (productDrop) => {
		return helpers.getCloudinaryImageUrl({
			...IMAGE_175,
			section: PRODUCT_SECTION,
			manufacturer: productDrop.manufacturer,
			name: this.getFinish(productDrop).image,
		});
	};

	getFinish = (productDrop) => {
		const finishes = productDrop.finishes;
		let finish = finishes.find(({ finish }) => finish === this.props.finish);
		if (!finish) {
			finish = finishes[0];
		}
		return finish;
	};

	getPrice = (productDrop) => {
		if (productDrop.minPrice === productDrop.maxPrice) {
			return helpers.toUSD(productDrop.minPrice);
		}
		return `${helpers.toUSD(productDrop.minPrice)} - ${helpers.toUSD(productDrop.maxPrice)}`;
	};

	getRowColor = (id) => {
		return id % 2 === 1 ? componentStyles.darkSpec : componentStyles.lightSpec;
	};

	renderSpecRow = (spec, sectionId, rowId) => {
		let values = [];
		if (spec && Array.isArray(spec.productSpecValue)) {
			values = spec.productSpecValue.map((item) => item.value);
		}
		return (
			<View style={[componentStyles.spec, this.getRowColor(rowId)]}>
				<Text weight="bold">{spec.attributeName}</Text>
				<Text>{values.join(', ')}</Text>
			</View>
		);
	};

	renderSpecs = () => {
		let data = [];
		if (this.props.productSpecs && this.props.productSpecs.length > 0) {
			data = this.props.productSpecs;
		}
		const dataSource = new ListView.DataSource({
			rowHasChanged: () => true,
		}).cloneWithRows(data);
		if (data.length) {
			return (
				<View>
					<Text
						weight="bold"
						style={componentStyles.list}
					>
						Product Specifications:
					</Text>
					<ListView
						dataSource={dataSource}
						enableEmptySections={true}
						renderRow={this.renderSpecRow}
					/>
				</View>
			);
		}
	};

	render() {
		const productDrop = this.props.product.productDrop;
		const imageUri = this.getImageUri(productDrop);
		const finish = this.getFinish(productDrop).finish;
		return (
			<ScrollView enableEmptySections={true}>
				<View style={componentStyles.productPage}>
					<View style={componentStyles.imageWrapper}>
						<Image
							source={imageUri}
							{...IMAGE_175}
						/>
					</View>
					<Text
						weight="bold"
						style={componentStyles.title}
					>
						{productDrop.manufacturer} {productDrop.productId} {finish} {productDrop.title}
					</Text>
					<Text
						weight="bold"
						color="primary"
						style={componentStyles.price}
					>
						{this.getPrice(productDrop)}
					</Text>
					{this.renderSpecs()}
				</View>
			</ScrollView>
		);
	}
}

ModelDetailPage.propTypes = {
	product: PropTypes.object.isRequired,
	finish: PropTypes.string,
	productSpecs: PropTypes.array,
};
