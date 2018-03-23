/**
 * This component is used to display a gallery of images.
 *
 * If you are displaying a gallery of product images that will be
 * modifying a product config, then see ProductDetailLargeImageGalleryScreen
 *
 */

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	InteractionManager,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import {
	ScrollView,
	Image,
	withScreen,
} from 'BuildLibrary';
import { NavigationStyles } from '@expo/ex-navigation';
import NavigationBarTextButton from '../components/navigationBar/NavigationBarTextButton';
import styles from '../lib/styles';
const {
	width,
	height,
} = styles.dimensions;
import { Navigator } from 'react-native-deprecated-custom-components';
import helpers from '../lib/helpers';
import Gallery from 'react-native-gallery';

const NAV_BAR_AND_IMAGE_NAV_HEIGHT = 74 + Navigator.NavigationBar.Styles.General.TotalNavHeight;
const componentStyles = StyleSheet.create({
	image: {
		height: height - NAV_BAR_AND_IMAGE_NAV_HEIGHT,
		width,
	},
	navImage: {
		width: 50,
		height: 50,
		marginHorizontal: styles.measurements.gridSpace1 / 2,
	},
	selectedNavImage: {
		width: 60,
		height: 60,
		borderWidth: styles.dimensions.borderWidthLarge,
		borderColor: styles.colors.accent,
		marginHorizontal: styles.measurements.gridSpace1 / 2,
	},
	imageNavContainer: {
		alignItems: 'center',
		backgroundColor: styles.colors.greyLight,
		paddingVertical: styles.measurements.gridSpace1,
	},
	bottomNav: {
		flex: 0,
		backgroundColor: styles.colors.greyLight,
	},
});

const IMAGE_NAV_PLUS_MARGIN = 57;
const SCREEN_CENTER = (width / 2 - 30);

export class LargeImageGalleryScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currentIndex: props.currentIndex,
			initialPage: props.currentIndex,
		};
		this.scrollView = {
			scrollTo: helpers.noop,
		};
	}

	componentWillMount() {
		InteractionManager.runAfterInteractions(() => {
			this.props.navigator.updateCurrentRouteParams({
				onDonePress: () => this.onDonePress(),
			});
		});
	}

	componentWillReceiveProps({ currentIndex }) {
		const { currentIndex: oldIndex } = this.props;
		if (currentIndex !== oldIndex) {
			this.setState({ currentIndex });
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:largeimagegallery',
		};
	}

	onNavigationPress = (index) => {
		this.scrollView.scrollTo({ x: (index + 1) * IMAGE_NAV_PLUS_MARGIN - SCREEN_CENTER });
		this.setState({ currentIndex: index }, () => this.props.onNavigationPress(index));
	};

	getImages = () => {
		return this.props.images.map((image) => image.uri);
	};

	renderNavigation = () => {
		const { images } = this.props;
		const { currentIndex } = this.state;
		const imageNav = images.map((image, index) => {
			return (
				<TouchableOpacity
					key={index}
					onPress={() => {
						if (this.gallery) {
							this.gallery.getViewPagerInstance().setPage(index, false);
							this.onNavigationPress(index);
						}
					}}
				>
					<Image
						source={image}
						style={index === currentIndex ? componentStyles.selectedNavImage : componentStyles.navImage}
					/>
				</TouchableOpacity>
			);
		});
		return (
			<ScrollView
				ref={(ref) => {
					if (ref) {
						this.scrollView = ref;
					}
				}}
				horizontal={true}
				contentContainerStyle={componentStyles.imageNavContainer}
				showsHorizontalScrollIndicator={false}
			>
				{imageNav}
			</ScrollView>
		);
	};

	onDonePress = () => {
		this.props.navigator.pop();
	};

	render() {
		const { height, width } = StyleSheet.flatten(componentStyles.image);
		return (
			<View style={styles.elements.screen}>
				<Gallery
					ref={(ref) => {
						if (ref) {
							this.gallery = ref;
						}
					}}
					images={this.getImages()}
					initialPage={this.state.initialPage}
					onPageSelected={this.onNavigationPress}
					fallbackUrl={helpers.getCloudinaryNoImageAvailableUrl({
						height,
						width,
					})}
				/>
				<View style={componentStyles.bottomNav}>
					{this.renderNavigation()}
				</View>
			</View>
		);
	}
}

LargeImageGalleryScreen.route = {
	styles: {
		...NavigationStyles.SlideVertical,
		gestures: null,
	},
	navigationBar: {
		visible: true,
		title(props) {
			return props.title;
		},
		renderLeft() {
			return null;
		},
		renderRight(route) {
			return (
				<NavigationBarTextButton onPress={() => route.params.onDonePress()}>
					Done
				</NavigationBarTextButton>
			);
		},
	},
};

LargeImageGalleryScreen.propTypes = {
	currentIndex: PropTypes.number.isRequired,
	images: PropTypes.array,
	navigator: PropTypes.shape({
		pop: PropTypes.func,
		updateCurrentRouteParams: PropTypes.func,
	}),
	onNavigationPress: PropTypes.func,
	title: PropTypes.string.isRequired,
};

LargeImageGalleryScreen.defaultProps = {
	currentIndex: 0,
	images: [],
	onNavigationPress: helpers.noop,
};

export default withScreen(LargeImageGalleryScreen);
