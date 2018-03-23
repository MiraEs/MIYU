import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import styles from '../../lib/styles';
import {
	ListView,
	Image,
	Text,
} from 'BuildLibrary';
import { getCloudinaryImageUrl } from '../../lib/helpers';
import {
	IMAGE_100,
	CATEGORY_SECTION,
} from '../../constants/CloudinaryConstants';
import { withNavigation } from '@expo/ex-navigation';

const componentStyles = StyleSheet.create({
	container: {
		marginRight: styles.measurements.gridSpace1,
	},
	list: {
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
		alignSelf: 'center',
	},
});

@withNavigation
export default class RelatedCategories extends Component {

	constructor(props) {
		super(props);
		this.imgSize = (styles.dimensions.width - (styles.measurements.gridSpace1 * 7)) / 2;
		const { categoryIncludes, relatedCategories } = this.props;
		const categories = relatedCategories.selected;
		const keys = Object.keys(categories);
		if (keys.length % 2) {
			keys.push({});
		}
		const size = Math.ceil(keys.length / 2);
		const data = new Array(size);
		for (let i = 0; i < size; i++) {
			data[i] = new Array(2);
		}
		keys.forEach((key, i) => {
			const category = categories[key];
			data[Math.floor(i / 2)].push(category ? categoryIncludes[category.storeId][category.categoryId] : null);
		});
		const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		this.state = {
			datasource: ds.cloneWithRows(data),
		};
	}

	renderHeader = () => {
		return (
			<Text
				weight="bold"
				style={componentStyles.wrapper}
			>
				Related Categories
			</Text>
		);
	};

	renderRow = (row) => {
		const products = row.map((item, i) => {
			if (item) {
				const uri = getCloudinaryImageUrl({
					section: CATEGORY_SECTION,
					name: item.menuImage,
					...IMAGE_100,
				});
				return (
					<TouchableOpacity
						onPress={() => {
							this.props.navigator.push('category', {
								name: item.categoryName,
								category: {
									id: item.categoryId,
								},
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
						/>
						<Text
							numberOfLines={2}
							color="primary"
							size="small"
						>
							{item.headerName}
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
				style={componentStyles.list}
				renderHeader={this.renderHeader}
				dataSource={this.state.datasource}
				renderRow={this.renderRow}
			/>
		);
	}

}

RelatedCategories.propTypes = {
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
	categoryIncludes: PropTypes.object.isRequired,
	relatedCategories: PropTypes.object.isRequired,
};
