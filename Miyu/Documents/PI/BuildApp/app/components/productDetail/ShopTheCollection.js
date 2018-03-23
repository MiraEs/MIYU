'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Image,
	StyleSheet,
	TouchableHighlight,
	View,
} from 'react-native';
import {
	Text,
	ScrollView,
} from 'BuildLibrary';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import productConfigurationHelpers from '../../lib/ProductConfigurationHelpers';
import helpers from '../../lib/helpers';
import styles from '../../lib/styles';
import { withNavigation } from '@expo/ex-navigation';
import { searchByKeyword } from '../../actions/SearchActions';
import { PRODUCT_SECTION } from '../../constants/CloudinaryConstants';
import Icon from 'react-native-vector-icons/Ionicons';
import { HOME } from '../../constants/constants';

const componentStyles = StyleSheet.create({
	container: {
		backgroundColor: styles.colors.greyLight,
		paddingBottom: styles.measurements.gridSpace3,
	},
	title: {
		marginVertical: styles.measurements.gridSpace2,
		marginHorizontal: styles.measurements.gridSpace1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
	},
	image: {
		height: 100,
		width: 100,
	},
	tile: {
		marginHorizontal: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace1,
	},
	cost: {
		color: styles.colors.primary,
	},
	icon: {
		marginLeft: styles.measurements.gridSpace1,
		position: 'relative',
		top: helpers.isIOS() ? 5 : -3,
	},
	viewAll: {
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
		flexDirection: 'row',
	},
});

export class ShopTheCollection extends Component {

	componentDidMount() {
		if (this.props.hasProduct) {
			this.doKeywordSearch();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.hasProduct && nextProps.hasProduct) {
			this.doKeywordSearch();
		}
	}

	onProductPress = (product) => {
		const { compositeId, manufacturer, selectedFinish } = product;
		const routeProps = {
			compositeId,
			manufacturer,
			sku: selectedFinish.sku,
			finish: selectedFinish.finish,
			uniqueId: selectedFinish.uniqueId,
		};
		if (this.props.navigator.navigatorId !== HOME) {
			const homeNav = this.props.navigation.getNavigator(HOME);
			homeNav.popToTop();
			homeNav.push('productDetail', routeProps);
			this.props.navigation.performAction(({ tabs }) => tabs('main').jumpToTab(HOME));
		} else {
			this.props.navigator.push('productDetail', routeProps);
		}
	};

	doKeywordSearch = () => {
		const {
			actions,
			productComposite: {
				manufacturer,
				series,
				productCompositeId,
			},
		} = this.props;
		actions.searchByKeyword({
			keyword: `${manufacturer} ${series || ''}`.trim(),
			page: 1,
			pageSize: 15,
		}, productCompositeId);
	};

	renderProducts = () => {
		return this.props.productDrops.map((productDrop, index) => {
			const drop = helpers.setFirstAvailableFinish(productDrop);
			const selectedFinish = drop.finishes[drop.selectedFinishIndex];
			const { cost, image } = selectedFinish;

			const product = {
				compositeId: drop.productCompositeId,
				manufacturer: productDrop.manufacturer,
				selectedFinish,
				image,
				cost,
			};
			return (
				<TouchableHighlight
					key={index}
					style={componentStyles.tile}
					onPress={() => this.onProductPress(product)}
					underlayColor="transparent"
				>
					<View>
						<Image
							source={{
								uri: helpers.getCloudinaryImageUrl({
									name: product.image,
									manufacturer: product.manufacturer,
									section: PRODUCT_SECTION,
									height: 100,
									width: 100,
								}),
							}}
							style={componentStyles.image}
						/>
						<Text
							color="primary"
							weight="bold"
						>
							{helpers.toUSD(product.cost)}
						</Text>
					</View>
				</TouchableHighlight>
			);
		});
	};

	render() {
		const { productDrops } = this.props;
		if (Array.isArray(productDrops) && productDrops.length) {
			return (
				<View style={componentStyles.container}>
					<View style={componentStyles.title}>
						<Text
							weight="bold"
							size="large"
						>
							Shop the Collection
						</Text>
						<TouchableHighlight
							onPress={this.props.onViewAllPress}
							underlayColor="transparent"
						>
							<View style={componentStyles.viewAll}>
								<View>
									<Text
										color="primary"
										size="small"
									>
										View All
									</Text>
								</View>
								<Icon
									name="ios-arrow-forward"
									size={21}
									color={styles.colors.primary}
									style={componentStyles.icon}
								/>
							</View>
						</TouchableHighlight>
					</View>
					<ScrollView horizontal={true}>
						{this.renderProducts()}
					</ScrollView>
				</View>
			);
		}
		return null;
	}

}

ShopTheCollection.propTypes = {
	actions: PropTypes.object,
	onViewAllPress: PropTypes.func.isRequired,
	productDrops: PropTypes.array.isRequired,
	productComposite: PropTypes.object,
	hasProduct: PropTypes.bool,
	navigator: PropTypes.shape({
		navigatorId: PropTypes.string,
		push: PropTypes.func,
	}),
	navigation: PropTypes.shape({
		getNavigator: PropTypes.func,
		performAction: PropTypes.func,
	}),
};

ShopTheCollection.defaultProps = {
	onViewAllPress: () => undefined,
	productDrops: [],
};

const mapStateToProps = (state, ownProps) => {
	const productComposite = productConfigurationHelpers.getProductComposite(ownProps.productConfigurationId);
	const { keywordSearches } = state.searchReducer;
	let productDrops = [];
	if (productComposite) {
		const query = `${productComposite.manufacturer} ${productComposite.series}`;
		productDrops = (keywordSearches[query] && keywordSearches[query].productDrops) || [];
	}
	return {
		hasProduct: !!productComposite,
		productComposite,
		productDrops,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			searchByKeyword,
		}, dispatch),
	};
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(ShopTheCollection));
