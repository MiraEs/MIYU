import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	LayoutAnimation,
	StyleSheet,
	TouchableOpacity,
	View,
	ViewPropTypes,
} from 'react-native';
import pluralize from 'pluralize';
import styles from '../lib/styles';
import {
	Image,
	Text,
} from 'BuildLibrary';
import helpers from '../lib/helpers';
import Icon from 'react-native-vector-icons/Ionicons';
import {
	PRODUCT_SECTION,
	IMAGE_42,
} from '../constants/CloudinaryConstants';
import store from '../store/configStore';
import { trackAction } from '../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({
	border: {
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.greyLight,
		marginRight: styles.measurements.gridSpace1,
	},
	overflow: {
		flex: 1,
		flexDirection: 'row',
	},
	overflowAmount: {
		alignItems: 'center',
		justifyContent: 'center',
		width: IMAGE_42.width + (styles.dimensions.borderWidth * 2),
	},
	row: {
		marginHorizontal: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
		padding: styles.measurements.gridSpace1,
	},
	rowHeader: {
		flexDirection: 'row',
		paddingBottom: styles.measurements.gridSpace1,
		borderColor: styles.colors.greyLight,
		borderBottomWidth: styles.dimensions.borderWidth,
	},
	rowContent: {
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: styles.measurements.gridSpace1,
		flexDirection: 'row',
	},
});

export default class FavoritesListRow extends Component {
	state = {
		capacity: 0,
	};

	onOverflowLayout = (event) => {
		if (this.state.capacity === 0) {
			const width = event.nativeEvent.layout.width;
			this.setState({
				capacity: Math.floor(width / (IMAGE_42.width + styles.measurements.gridSpace1 + 2)),
			});
		}
	};

	renderOverflowLayout = (favorite, favoriteId) => {
		const { capacity } = this.state;
		const {
			itemCount,
			productsMap = {},
		} = favorite;
		const arr = Object.keys(productsMap);
		if (capacity > 0) {
			if (itemCount === 0) {
				return (
					<TouchableOpacity
						onPress={() => {
							LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
							this.props.onDelete(favoriteId);
						}}
					>
						<Text color="primary">Delete</Text>
					</TouchableOpacity>
				);
			}
			return arr.slice(0, capacity).map((key, index) => {
				if (index === capacity - 1 && itemCount > capacity) {
					return (
						<View
							key={index}
							style={[componentStyles.border, componentStyles.overflowAmount]}
						>
							<Text
								lineHeight={false}
								textAlign="center"
								weight="bold"
							>
								+{itemCount - capacity + 1}
							</Text>
						</View>
					);
				}
				const product = productsMap[key];

				if (product && product.finishes && Array.isArray(product.finishes)) {
					const finish = product.finishes.find((cur) => cur.uniqueId === product.uniqueId) || product.finishes[0];
					if (finish) {
						const image = finish.image;
						const uri = helpers.getCloudinaryImageUrl({
							section: PRODUCT_SECTION,
							name: image,
							manufacturer: product.manufacturer,
							...IMAGE_42,
						});
						return (
							<View
								key={index}
								style={componentStyles.border}
							>
								<Image
									source={{ uri }}
									{...IMAGE_42}
								/>
							</View>
						);
					}
				}
			});
		}
	};

	render() {
		const {
			analyticsData,
			favorite,
			favoriteId,
			onPress,
			style,
		} = this.props;

		return (
			<View style={[componentStyles.row, style]}>
				<View style={componentStyles.rowHeader}>
					<Text weight="bold">
						{favorite.name}
					</Text>
					<Text color="grey"> {pluralize('Item', favorite.itemCount, true)}</Text>
				</View>
				<TouchableOpacity
					style={componentStyles.rowContent}
					onPress={() => {
						onPress(favoriteId);
						if (analyticsData) {
							store.dispatch(trackAction(analyticsData.trackName, analyticsData.trackData));
						}
					}}
				>
					<View
						style={componentStyles.overflow}
						onLayout={this.onOverflowLayout}
					>
						{this.renderOverflowLayout(favorite, favoriteId)}
					</View>
					<Icon
						name={helpers.getIcon('arrow-forward')}
						size={25}
						color={styles.colors.grey}
					/>
				</TouchableOpacity>
			</View>
		);
	}

}

FavoritesListRow.propTypes = {
	favorite: PropTypes.object,
	favoriteId: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
	onDelete: PropTypes.func,
	onPress: PropTypes.func,
	style: ViewPropTypes.style,
	analyticsData: PropTypes.shape({
		trackName: PropTypes.string.isRequired,
		trackData: PropTypes.object,
	}),
};

FavoritesListRow.defaultProps = {
	onDelete: helpers.noop,
	onPress: helpers.noop,
};
