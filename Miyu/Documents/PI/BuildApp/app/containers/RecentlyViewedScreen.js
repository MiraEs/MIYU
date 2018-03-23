import {
	StyleSheet,
	View,
} from 'react-native';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import HeaderSearch from './HeaderSearch';
import {
	withScreen,
	GridView,
	Text,
} from 'BuildLibrary';
import { trackState } from '../actions/AnalyticsActions';
import AtomComponent from '../content/AtomComponent';
import ProductDrop from '../components/ProductDrop';
import { SEARCH_GRID } from '../constants/searchConstants';
import Icon from 'react-native-vector-icons/Ionicons';
import TrackingActions from '../lib/analytics/TrackingActions';
import { withNavigation } from '@expo/ex-navigation';

const componentStyles = StyleSheet.create({
	cta: {
		backgroundColor: styles.colors.primary,
		padding: styles.measurements.gridSpace2,
		marginTop: styles.measurements.gridSpace2,
	},
	screen: {
		flexGrow: 1,
	},
	gridWrapper: {
		flexGrow: 1,
	},
	gridView: {
		marginRight: styles.measurements.gridSpace1,
	},
	icon: {
		marginVertical: 14,
	},
	shopButton: {
		flex: 0,
		marginTop: styles.measurements.gridSpace5,
	},
	titleText: {
		marginLeft: styles.measurements.gridSpace2,
	},
	noRecentView: {
		flexBasis: styles.dimensions.width,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: styles.measurements.gridSpace6,
	},
});

export class RecentlyViewedScreen extends Component {

	componentDidMount() {
		this.props.registerScrollTo(this.scrollTo);
	}

	componentDidUpdate({ products }) {
		// if the products change, scroll to the top of the list
		if (products !== this.props.products) {
			this.scrollTo();
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:recentlyviewed',
		};
	}

	onPressProductDrop = () => {
		this.props.navigation.performAction(({ tabs }) => tabs('main').jumpToTab('home'));
	};

	scrollTo = (props) => {
		if (this.list && typeof this.list.scrollTo === 'function') {
			this.list.scrollTo(props);
		}
	};

	renderScreenContent = () => {
		const {
			maxItems,
			products,
		} = this.props;

		if (products.length) {
			return (
				<View style={componentStyles.gridWrapper}>
					<GridView
						ref={(ref) => this.list = ref}
						items={this.props.products}
						itemsPerRow={2}
						renderItem={this.renderProductDrop}
						style={componentStyles.gridView}
						scrollsToTop={true}
						maxItems={maxItems}
					/>
				</View>
			);
		}

		return this.renderNoResults();
	};

	renderNoProductsMessage = () => {
		const { recently_viewed} = this.props.contentItem.content;
		if (recently_viewed.no_products_message) {
			return (
				<AtomComponent
					{...recently_viewed.no_products_message}
					textAlign="center"
					weight="bold"
					color="greyDark"
				/>
			);
		}
	};

	renderCTA = () => {
		const {
			content: { recently_viewed },
			id,
			group,
			profileIncludes,
			videoIncludes,
		} = this.props.contentItem;
		if (recently_viewed.cta_url) {
			return (
				<AtomComponent
					{...recently_viewed.cta_url}
					contentItemId={id}
					group={group}
					profileIncludes={profileIncludes}
					videoIncludes={videoIncludes}
					trackAction={TrackingActions.RECENTLY_VIEWED_CTA}
				>
					<AtomComponent
						weight="bold"
						color="white"
						style={componentStyles.cta}
						{...recently_viewed.cta}
					/>
				</AtomComponent>
			);
		}
	};

	renderNoResults = () => {
		if (this.props.contentItem) {
			return (
				<View style={componentStyles.noRecentView}>
					<Text
						size="larger"
						weight="bold"
						color="greyDark"
						textAlign="center"
					>
						No Recently Viewed Products
					</Text>
					<Icon
						name="md-time"
						size={80}
						color={styles.colors.greyDark}
						style={componentStyles.icon}
					/>
					{this.renderNoProductsMessage()}
					{this.renderCTA()}
				</View>
			);
		}
	};

	renderProductDrop = (product) => {
		const {
			compositeId: productCompositeId,
			data: {
				manufacturer,
				productId,
				selectedFinish,
				title,
			},
		} = product;
		const productDrop = {
			manufacturer,
			productCompositeId,
			productId,
			title,
		};

		return (
			<ProductDrop
				key={productDrop.productCompositeId}
				onPress={this.onPressProductDrop}
				productDrop={productDrop}
				selectedFinish={selectedFinish}
				showFavorite={false}
				viewStyle={SEARCH_GRID}
			/>
		);
	};

	render() {
		return (
			<View
				style={componentStyles.screen}
			>
				{this.renderScreenContent()}
			</View>
		);
	}
}

RecentlyViewedScreen.route = {
	navigationBar: {
		renderTitle() {
			return <HeaderSearch showLogo={true}/>;
		},
	},
};

RecentlyViewedScreen.propTypes = {
	actions: PropTypes.object,
	navigation: PropTypes.shape({
		performAction: PropTypes.func,
	}),
	navigator: PropTypes.object,
	products: PropTypes.array,
	registerScrollTo: PropTypes.func.isRequired,
	contentItem: PropTypes.object.isRequired,
	maxItems: PropTypes.number,
};

RecentlyViewedScreen.defaultProps = {
	products: [],
	registerScrollTo: helpers.noop,
};

const mapStateToProps = (state) => {
	return {
		products: state.HistoryReducer.products,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			trackState,
		}, dispatch),
	};
};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(withScreen(RecentlyViewedScreen)));
