import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	ViewPropTypes,
} from 'react-native';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';
import {
	IMAGE_42,
	IMAGE_100,
	CATEGORY_SECTION,
	PRODUCT_SECTION,
} from '../../constants/CloudinaryConstants';
import {
	Image,
	ListView,
	Text,
	TouchableOpacity,
} from 'BuildLibrary';
import TrackingActions from '../../lib/analytics/TrackingActions';
import Video from '../../components/Video';
import AtomComponent from '../AtomComponent';
import CardView from '../../components/CardView';
import TappableListItem from '../../components/TappableListItem';
import { INCLUDE_TYPES } from '../../constants/ContentConstants';
import { withNavigation } from '@expo/ex-navigation';
import { connect } from 'react-redux';

const componentStyles = StyleSheet.create({
	category: {
		backgroundColor: styles.colors.white,
		alignItems: 'center',
		flexDirection: 'row',
		padding: 7,
	},
	label: {
		padding: styles.measurements.gridSpace1,
		paddingTop: styles.measurements.gridSpace6,
	},
	separator: {
		width: styles.measurements.gridSpace1,
	},
});

@withNavigation
export class AtomMultiselect extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }).cloneWithRows(props.selected),
		};
		const width = styles.dimensions.width - (styles.measurements.gridSpace1 * 2);
		const height = Math.round(width * (9 / 16));
		this.imageDimensions = { width, height };
	}

	renderRow = (rowId) => {
		const {
			contentReducer,
			includeType,
			navigator,
		} = this.props;
		let composite;
		switch (includeType) {

			case INCLUDE_TYPES.ARTICLE:
				composite = contentReducer.contentItems[rowId];
				const {
					content: {
						hero_media,
						title,
						_type,
					},
					group: { id },
				} = composite;
				if (_type.split('@')[0] === 'article-legacy') {
					return null;
				}
				return (
					<CardView
						onPress={() => {
							this.props.navigator.push('content', {
								title: title.text,
								contentItem: contentReducer.contentItems[id],
								id,
							});
						}}
						trackAction={TrackingActions.ARTICLE_PREVIEW_TAP}
					>
						<AtomComponent
							{...hero_media}
							{...this.imageDimensions}
							preview={true}
						/>
						<View style={styles.elements.padding1}>
							<AtomComponent {...title} />
							<Text color="primary">Read Article</Text>
						</View>
					</CardView>
				);

			case INCLUDE_TYPES.CATEGORY:
				composite = contentReducer.categoryIncludes[rowId.storeId][rowId.categoryId];
				const uri = helpers.getCloudinaryImageUrl({
					name: composite.menuImage,
					section: CATEGORY_SECTION,
					...IMAGE_42,
				});
				return (
					<TappableListItem
						style={componentStyles.category}
						onPress={() => {
							if (composite.link) {
								navigator.push('category', {
									categoryId: composite.link,
								});
							} else {
								navigator.push('category', {
									categoryId: composite.categoryId,
								});
							}
						}}
						image={{ uri }}
						body={composite.categoryName}
					/>
				);

			case INCLUDE_TYPES.FAVORITE:
				composite = contentReducer.favoriteIncludes[rowId];
				return null;

			case INCLUDE_TYPES.PRODUCT:
				composite = contentReducer.productIncludes[rowId];
				// Sometime construct will fail to provide a product compsite. This is because the product has been
				// discontinued. Construct will show an error prompting the user to remove the product, but in the
				// mean time it will simply return a null product. This check handles that case.
				if (!composite) {
					return null;
				}
				const product = composite.finishes[0];
				const imageUrl = helpers.getCloudinaryImageUrl({
					section: PRODUCT_SECTION,
					manufacturer: composite.manufacturer,
					name: product.image,
					...IMAGE_100,
				});
				return (
					<TouchableOpacity
						trackAction={TrackingActions.ARTICLE_RELATED_PRODUCT_TAP}
						trackContenxtData={{
							uniqueId: product.unqiueId,
							compositeId: composite.productCompositeId,
						}}
						onPress={() => {
							navigator.push('productDetail', {
								compositeId: composite.productCompositeId,
								uniqueId: product.uniqueId,
								manufacturer: composite.manufacturer,
								sku: product.sku,
							});
						}}
					>
						<Image
							resizeMode="contain"
							source={imageUrl}
							{...IMAGE_100}
						/>
						<Text
							color="primary"
							weight="bold"
						>
							{helpers.toUSD(product.cost)}
						</Text>
					</TouchableOpacity>
				);

			case INCLUDE_TYPES.PROFILE:
				composite = contentReducer.profileIncludes[rowId];
				return null;

			case INCLUDE_TYPES.TAG:
				composite = contentReducer.tagIncludes[rowId];
				return null;

			case INCLUDE_TYPES.USER:
				composite = contentReducer.userIncludes[rowId];
				return null;

			case INCLUDE_TYPES.VIDEO:
				composite = contentReducer.videoIncludes[rowId];
				return (
					<CardView>
						<Video
							{...composite}
							{...this.imageDimensions}
						/>
						<Text style={styles.elements.padding1}>{composite.title}</Text>
					</CardView>
				);
		}
	};

	renderLabel = () => {
		if (this.props.label) {
			return (
				<Text
					style={componentStyles.label}
					family="archer"
					weight="bold"
					size="larger"
				>
					{this.props.label}
				</Text>
			);
		}
	};

	getSeparatorStyle = () => {
		switch (this.props.includeType) {
			case INCLUDE_TYPES.PRODUCT:
				return styles.elements.paddingLeft;
			case INCLUDE_TYPES.CATEGORY:
				return { height: styles.dimensions.borderWidth };
		}
	};

	render() {
		if (this.props.selected.length) {
			return (
				<View>
					{this.renderLabel()}
					<ListView
						style={this.props.style}
						showsHorizontalScrollIndicator={false}
						dataSource={this.state.dataSource}
						horizontal={this.props.horizontal}
						renderSeparator={(i, key) => {
							return (
								<View
									key={key}
									style={this.getSeparatorStyle()}
								/>
							);
						}}
						renderRow={this.renderRow}
					/>
				</View>
			);
		} else {
			return null;
		}
	}

}

AtomMultiselect.propTypes = {
	contentReducer: PropTypes.object,
	horizontal: PropTypes.bool,
	includeType: PropTypes.oneOf(Object.keys(INCLUDE_TYPES).map((key) => INCLUDE_TYPES[key])).isRequired,
	label: PropTypes.string,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
	selected: PropTypes.array.isRequired,
	style: ViewPropTypes.style,
};

export default connect((state) => ({ contentReducer: state.contentReducer }), null)(AtomMultiselect);
