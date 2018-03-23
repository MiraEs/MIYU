'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Animated,
	View,
	Image,
	requireNativeComponent,
	SegmentedControlIOS,
	StyleSheet,
	TouchableOpacity,
	ViewPagerAndroid,
} from 'react-native';
import { ListView } from 'BuildLibrary';
import { withNavigation } from '@expo/ex-navigation';
import { connect } from 'react-redux';
import { goToGalleryIndex } from '../actions/ProductDetailActions';
import { bindActionCreators } from 'redux';
import styles from '../lib/styles';
const {
	width,
} = styles.dimensions;
import { isIOS } from '../lib/helpers';
import {
	LinkingManager,
	Device,
} from 'BuildNative';
import TrackingActions from '../lib/analytics/TrackingActions';
import { trackAction } from '../actions/AnalyticsActions';
import { setProductConfigurationFinish } from '../actions/ProductConfigurationsActions';

const ModelView = requireNativeComponent('ModelViewManagerSwift');

const fadeDuration = 150;
const componentStyles = StyleSheet.create({
	primaryNavDot: {
		backgroundColor: styles.colors.secondary,
		width: styles.measurements.gridSpace1,
		height: styles.measurements.gridSpace1,
		borderRadius: 4,
		marginHorizontal: styles.measurements.gridSpace1 / 2,
		marginBottom: styles.measurements.gridSpace1,
	},
	navDot: {
		backgroundColor: styles.colors.grey,
		width: styles.measurements.gridSpace1,
		height: styles.measurements.gridSpace1,
		borderRadius: 4,
		marginHorizontal: styles.measurements.gridSpace1 / 2,
		marginBottom: styles.measurements.gridSpace1,
	},
	navDotView: {
		alignSelf: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	galleryImage: {
		width,
		height: width,
	},
	galleryView: {
		flex: 1,
		flexDirection: 'column',
	},
	gallery: {
		width,
		height: width,
	},
	center: {
		alignSelf: 'center',
	},
	segmentedControl: {
		marginHorizontal: styles.measurements.gridSpace2,
		marginTop: styles.measurements.gridSpace1,
	},
	empty: {
		height: styles.measurements.gridSpace2,
	},
});

@withNavigation
export class ImageGallery extends Component {

	constructor(props) {
		super(props);
		this.initialIndex = props.currentIndex || 0;
		this.index = this.initialIndex;
		this.lastIndex = 0;
		this.state = {
			segmentedControlIndex: 0,
			anim: new Animated.Value(1),
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.currentIndex !== this.props.currentIndex && nextProps.currentIndex !== this.index) {
			this.index = nextProps.currentIndex;
			if (isIOS()) {
				const contentOffset = {
					y: 0,
					x: nextProps.currentIndex * width,
					animated: false,
				};
				if (this._listView) {
					this._listView.scrollTo(contentOffset);
				} else {
					this.pendingOffset = contentOffset;
				}
			} else {
				this._viewPager.setPageWithoutAnimation(nextProps.currentIndex);
			}
		}
	}

	/**
	 * This differs from the selectedUniqueId in that this is the uniqueId that the gallery
	 * is on, if there is one, and the selectedUniqueId is the uniqueId of the selected finish.
	 */
	getCurrentUniqueId = () => {
		const { finishes, currentIndex, selectedUniqueId } = this.props;
		const finish = finishes[currentIndex];
		if (finish && finish.uniqueId) {
			return finish.uniqueId;
		} else {
			return selectedUniqueId;
		}
	};

	renderNavigation = () => {
		if (this.state.segmentedControlIndex === 0) {
			const { currentIndex, images } = this.props;
			const imageNav = images.map((image, index) => {
				return (
					<View
						key={index}
						style={currentIndex === index ? componentStyles.primaryNavDot : componentStyles.navDot}
					/>
				);
			});
			return (<View style={componentStyles.navDotView}>{imageNav}</View>);
		} else {
			return <View style={componentStyles.empty}/>;
		}
	};

	trackView3dModel = () => {
		const {
			compositeId,
		} = this.props;
		this.props.actions.trackAction(TrackingActions.PRODUCT_3D_MODEL, {
			compositeId,
		});
	};

	trackArViewLaunch = () => {
		const {
			compositeId,
		} = this.props;
		this.props.actions.trackAction(TrackingActions.PRODUCT_AR_LAUNCH, {
			compositeId,
		});
	};

	renderAndroidGallery = () => {
		const { images, title, productConfigurationId } = this.props,
			slideImages = [];

		images.forEach((image, index) => {
			slideImages.push(
				<View
					key={index}
				>
					<TouchableOpacity
						onPress={() => {
							this.props.navigation.getNavigator('root').push('productDetailLargeImageGallery', { images, title, productConfigurationId });
						}}
					>
						<Image
							source={image}
							style={componentStyles.galleryImage}
						/>
					</TouchableOpacity>
				</View>
			);
		});
		return slideImages;
	};

	renderIOSImage = (source, sectionId, rowId) => {
		const { images, title, productConfigurationId } = this.props;
		return (
			<TouchableOpacity
				key={rowId}
				onPress={() => {
					this.props.navigation.getNavigator('root').push('productDetailLargeImageGallery', { images, title, productConfigurationId });
				}}
			>
				<Image
					key={rowId}
					source={source}
					style={componentStyles.galleryImage}
				/>
			</TouchableOpacity>
		);
	};

	onScrollEnd = ({ nativeEvent }) => {
		const { goToGalleryIndex } = this.props.actions,
			{ images, productConfigurationId } = this.props;
		//make sure we do not go out of bounds
		let newImageIndex = Math.floor(nativeEvent.contentOffset.x / width);
		if (newImageIndex < 0) {
			newImageIndex = 0;
		} else if (newImageIndex > images.length - 1) {
			newImageIndex = images.length - 1;
		}
		this.index = newImageIndex;
		goToGalleryIndex({ index: newImageIndex, productConfigurationId });
	};
	onPageSelected = ({ nativeEvent }) => {
		const { goToGalleryIndex } = this.props.actions,
			{ images, productConfigurationId } = this.props;
		//make sure we do not go out of bounds
		let newImageIndex = Math.floor(nativeEvent.position);
		if (newImageIndex < 0) {
			newImageIndex = 0;
		} else if (newImageIndex > images.length - 1) {
			newImageIndex = images.length - 1;
		}
		this.index = newImageIndex;
		goToGalleryIndex({ index: newImageIndex, productConfigurationId });
	};

	renderGallery = (controlIndex) => {
		const {
			images,
			compositeId,
		} = this.props;
		if (isIOS()) {
			if (controlIndex === 0) {
				const dataSource = new ListView.DataSource({
					rowHasChanged: (r1, r2) => r1 !== r2,
				}).cloneWithRows(images);
				const contentOffset = {
					y: 0,
					x: this.index * width,
				};
				const initialListSize = this.index ? this.index : 1; // always render at least one item
				return (
					<Animated.View style={[componentStyles.gallery, { opacity: this.state.anim }]}>
						<ListView
							ref={(ref) => this._listView = ref}
							onMomentumScrollEnd={this.onScrollEnd}
							initialListSize={initialListSize}
							scrollEnabled={true}
							dataSource={dataSource}
							contentOffset={contentOffset}
							horizontal={true}
							pagingEnabled={true}
							snapToInterval={1}
							showsHorizontalScrollIndicator={false}
							style={componentStyles.gallery}
							renderRow={this.renderIOSImage}
						/>
					</Animated.View>
				);
			} else if (controlIndex === 1) {
				// show 3D model view
				const uniqueId = this.getCurrentUniqueId();
				return (
					<Animated.View style={[componentStyles.gallery, { opacity: this.state.anim }]}>
						<ModelView
							sceneConfig={{
								compositeId,
								uniqueId,
							}}
						/>
					</Animated.View>
				);
			} else if (controlIndex === 2) {
				return this.renderGallery(this.lastIndex);
			}
		} else {
			return (
				<ViewPagerAndroid
					ref={(ref) => this._viewPager = ref}
					initialPage={this.initialIndex}
					style={componentStyles.gallery}
					onPageSelected={this.onPageSelected}
				>
					{this.renderAndroidGallery()}
				</ViewPagerAndroid>
			);
		}
	};

	onCloseArView = (error, selectedModel) => {
		const {
			productComposite,
			productConfigurationId,
			actions: { setProductConfigurationFinish },
		} = this.props;
		setProductConfigurationFinish({
			productComposite,
			productConfigurationId,
			uniqueId: selectedModel.uniqueId,
		});
	};

	render() {
		const {
			finishes,
			isArProduct,
			compositeId,
			selectedUniqueId,
		} = this.props;
		const is3dEnabled = Device.is3dModelEnabled();
		const options = Device.isArKitEnabled() ? ['Photo', '3D Model', 'See in Room'] : ['Photo', '3D Model'];
		return (
			<View style={componentStyles.galleryView}>
				{this.renderGallery(this.state.segmentedControlIndex)}
				<Animated.View style={componentStyles.center}>
					{this.renderNavigation()}
				</Animated.View>
				{is3dEnabled && isArProduct && <SegmentedControlIOS
					style={componentStyles.segmentedControl}
					values={options}
					selectedIndex={this.state.segmentedControlIndex}
					onChange={(event) => {
						const segmentedControlIndex = event.nativeEvent.selectedSegmentIndex;
						if (segmentedControlIndex === 0) {
							this.lastIndex = segmentedControlIndex;
							Animated.timing(this.state.anim, {
								toValue: 0,
								duration: fadeDuration,
							}).start(() => {
								this.setState({ segmentedControlIndex }, () => {
									if (this._listView && this.pendingOffset) {
										this._listView.scrollTo(this.pendingOffset);
										this.pendingOffset = null;
									}
									Animated.timing(this.state.anim, {
										toValue: 1,
										duration: fadeDuration,
									}).start();
								});
							});
						} else if (segmentedControlIndex === 1) {
							// 3dModel
							this.lastIndex = segmentedControlIndex;
							this.trackView3dModel();
							this.setState({ segmentedControlIndex });
						} else {
							// ArView
							this.trackArViewLaunch();
							this.setState({ segmentedControlIndex }, () => {
								LinkingManager.openArView({
									finishes: finishes.map((finish) => {
										return {
											uniqueId: finish.uniqueId,
											price: finish.pricebookCostView.cost,
										};
									}),
									compositeId,
									selectedUniqueId,
								}, this.onCloseArView);
								setTimeout(() => this.setState({ segmentedControlIndex: this.lastIndex }), 2000);
							});
						}
					}}
					tintColor={styles.colors.primary}
				/>}
			</View>
		);
	}

}

ImageGallery.propTypes = {
	isArProduct: PropTypes.bool,
	images: PropTypes.array,
	currentIndex: PropTypes.number,
	actions: PropTypes.object,
	title: PropTypes.string,
	compositeId: PropTypes.number.isRequired,
	productConfigurationId: PropTypes.string.isRequired,
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
	}),
	selectedUniqueId: PropTypes.number,
	finishes: PropTypes.array,
	productComposite: PropTypes.object,
};

ImageGallery.defaultProps = {
	title: 'Gallery',
};

function mapStateToProps(state, ownProps) {
	const screenView = state.productDetailReducer.screenViews[ownProps.productConfigurationId];
	const selectedFinish = state.productConfigurationsReducer[ownProps.productConfigurationId].selectedFinish;

	return {
		currentIndex: screenView ? screenView.imageGalleryIndex || 0 : 0,
		isArProduct: state.productDetailReducer.arProducts.includes(ownProps.compositeId),
		selectedUniqueId: selectedFinish ? selectedFinish.uniqueId : null,
		finishes: state.productsReducer[ownProps.compositeId].finishes,
		productComposite: state.productsReducer[ownProps.compositeId],
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({
			setProductConfigurationFinish,
			goToGalleryIndex,
			trackAction,
		}, dispatch),
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(ImageGallery);
