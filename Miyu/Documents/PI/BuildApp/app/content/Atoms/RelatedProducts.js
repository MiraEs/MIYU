import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	ListView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import styles from '../../lib/styles';
import {
	Image,
	Text,
} from 'BuildLibrary';
import { withNavigation } from '@expo/ex-navigation';
import { getCloudinaryImageUrl } from '../../lib/helpers';
import {
	IMAGE_100,
	PRODUCT_SECTION,
} from '../../constants/CloudinaryConstants';
import FavoriteButton from '../../components/FavoriteButton';

const componentStyles = StyleSheet.create({
	container: {
		marginRight: styles.measurements.gridSpace1,
	},
	empty: {
		flex: 1,
		marginLeft: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace1,
		padding: styles.measurements.gridSpace1,
	},
	product: {
		backgroundColor: styles.colors.white,
		flex: 1,
		marginLeft: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace1,
		padding: styles.measurements.gridSpace1,
	},
	row: {
		flexDirection: 'row',
	},
	wrapper: {
		padding: styles.measurements.gridSpace1,
	},
	image: {
		flex: 1,
		alignItems: 'flex-end',
		alignSelf: 'center',
	},
});

@withNavigation
export default class RelatedProducts extends Component {

	constructor(props) {
		super(props);
		this.imgSize = (styles.dimensions.width - (styles.measurements.gridSpace1 * 7)) / 2;
		const { productIncludes, relatedProducts } = this.props;
		const keys = relatedProducts.selected;
		if (keys.length % 2) {
			keys.push({});
		}
		const size = Math.ceil(keys.length / 2);
		const data = new Array(size);
		for (let i = 0; i < size; i++) {
			data[i] = new Array(2);
		}
		if (productIncludes) {
			keys.forEach((key, i) => {
				data[Math.floor(i / 2)].push(productIncludes[keys[i]]);
			});
		}
		const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		this.datasource = ds.cloneWithRows(data);
	}

	renderHeader = () => {
		return (
			<Text
				weight="bold"
				style={componentStyles.wrapper}
			>
				Related Products
			</Text>
		);
	};

	renderRow = (row) => {
		const products = row.map((item, i) => {
			if (item) {
				const uri = getCloudinaryImageUrl({
					manufacturer: item.manufacturer,
					section: PRODUCT_SECTION,
					name: item.finishes[0].image,
					...IMAGE_100,
				});
				return (
					<TouchableOpacity
						onPress={() => {
							this.props.navigator.push('productDetail', {
								compositeId: item.productCompositeId,
								uniqueId: item.finishes[0].uniqueId,
							});
						}}
						style={componentStyles.product}
						key={i}
					>
						<Image
							source={{ uri }}
							style={componentStyles.image}
							width={this.imgSize}
							height={this.imgSize}
						>
							<FavoriteButton
								style={componentStyles.favoriteButton1}
								compositeId={item.productCompositeId}
								productUniqueId={item.finishes[0].uniqueId}
								product={{
									selectedFinish: item.finishes[0],
								}}
								finishes={item.finishes}
							/>
						</Image>
						<Text
							numberOfLines={2}
							color="primary"
							size="small"
						>
							{item.title}
						</Text>
					</TouchableOpacity>
				);
			}
			return (
				<View
					key={i}
					style={componentStyles.empty}
				/>
			);
		});
		return <View style={componentStyles.row}>{products}</View>;
	};

	render() {
		return (
			<ListView
				style={componentStyles.container}
				renderHeader={this.renderHeader}
				dataSource={this.datasource}
				renderRow={this.renderRow}
			/>
		);
	}

}

RelatedProducts.propTypes = {
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
	productIncludes: PropTypes.object.isRequired,
	relatedProducts: PropTypes.object.isRequired,
};
