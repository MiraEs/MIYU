import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Animated,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import AtomComponent from '../AtomComponent';
import TrackingActions from '../../lib/analytics/TrackingActions';
import styles from '../../lib/styles';
import {
	ParallaxScrollView,
	Image,
} from 'BuildLibrary';
import { withNavigation } from '@expo/ex-navigation';
import BannerGradient from '../../components/BannerGradient';
import helpers from '../../lib/helpers';

const height = 250;
const overlayHeight = 120;

const componentStyles = StyleSheet.create({
	cta: {
		backgroundColor: styles.colors.primary,
		padding: styles.measurements.gridSpace2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	foreground: {
		justifyContent: 'flex-end',
		alignItems: 'center',
		padding: styles.measurements.gridSpace2,
		flex: 1,
	},
	gradient: {
		width: styles.dimensions.width,
		height,
	},
	headline: {
		backgroundColor: 'transparent',
	},
	overlayImage: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	subheadlineContainer: {
		flexDirection: 'row',
		marginBottom: styles.measurements.gridSpace1,
		alignItems: 'center',
	},
	subheadline: {
		backgroundColor: 'transparent',
	},
	subheadlineBold: {
		backgroundColor: 'transparent',
		paddingLeft: styles.measurements.gridSpace1 / 2,
	},
});

@withNavigation
export default class NativeSaleSection extends Component {

	constructor(props) {
		super(props);
		this.state = { foregroundOpacity: new Animated.Value(0) };
	}

	scrollTo = (props) => {
		this.scrollView && this.scrollView.scrollTo(props);
	};

	renderOverlayImage = () => {
		if (this.props.media_image_overlay && this.props.media_image_overlay.public_id) {
			return (
				<View style={componentStyles.overlayImage}>
					<AtomComponent
						{...this.props.media_image_overlay}
						uri={helpers.getOverlayImageUrl(this.props.media_image_overlay && this.props.media_image_overlay.public_id, overlayHeight)}
						resizeMode="contain"
						height={overlayHeight}
					/>
				</View>
			);
		}
	};

	render() {
		const { contentItem, useCustomComponent } = this.props;
		const customHeight = (styles.dimensions.width / 750) * 650;
		return (
			<ParallaxScrollView
				ref={(ref) => this.scrollView = ref}
				parallaxHeaderHeight={useCustomComponent && helpers.isIOS() ? customHeight + 1 : height}
				contentBackgroundColor={styles.colors.greyLight}
				backgroundColor={styles.colors.greyLight}
				renderBackground={() => {
					if (useCustomComponent && helpers.isIOS()) {
						return (
							<Image
								source={require('../../../images/arHomePage.gif')}
								style={{
									width: styles.dimensions.width,
									height: customHeight,
									backgroundColor: styles.colors.white,
									borderBottomWidth: styles.dimensions.borderBottomWidth,
									borderColor: styles.colors.grey,
								}}
							/>
						);
					}
					return (
						<AtomComponent
							onLoad={() => {
								Animated.timing(this.state.foregroundOpacity, {
									duration: 800,
									toValue: 1,
								}).start();
							}}
							height={height}
							width={styles.dimensions.width}
							crop="fill"
							debug={true}
							gravity="custom"
							loadingLogo={true}
							{...this.props.media_image}
						>
							<BannerGradient style={componentStyles.gradient} />
						</AtomComponent>
					);
				}}
				renderForeground={() => {
					if (useCustomComponent && helpers.isIOS()) {
						return (
							<TouchableOpacity
								onPress={() => {
									this.props.navigator.push('category', {
										categoryId: 130385,
									});
								}}
								style={{ height: customHeight }}
							/>
						);
					}
					return (
						<Animated.View style={[componentStyles.foreground, { opacity: this.state.foregroundOpacity }]}>
							{this.renderOverlayImage()}
							<AtomComponent
								color="white"
								weight="bold"
								size="larger"
								lineHeight={false}
								style={componentStyles.headline}
								{...this.props.headline}
							/>
							<View style={componentStyles.subheadlineContainer}>
								<AtomComponent
									lineHeight={false}
									textAlign="center"
									color="white"
									size="large"
									family="archer"
									style={componentStyles.subheadline}
									{...this.props.subheadline}
								/>
								<AtomComponent
									lineHeight={false}
									textAlign="center"
									color="white"
									size="large"
									family="archer"
									weight="bold"
									style={componentStyles.subheadlineBold}
									{...this.props.subheadline_bold}
								/>
							</View>
							<AtomComponent
								{...this.props.cta_url}
								group={contentItem.group}
								contentItemId={contentItem.id}
								trackAction={TrackingActions.NATIVE_HOME_CTA}
							>
								<AtomComponent
									color="white"
									weight="bold"
									lineHeight={false}
									style={componentStyles.cta}
									{...this.props.cta}
								/>
							</AtomComponent>
						</Animated.View>
					);
				}}
			>
				<AtomComponent
					{...this.props.related_categories}
					scrollEnabled={false}
				/>
			</ParallaxScrollView>
		)
			;
	}

}

NativeSaleSection.propTypes = {
	contentItem: PropTypes.object.isRequired,
	cta: PropTypes.object,
	cta_url: PropTypes.object,
	media_image: PropTypes.object,
	media_image_overlay: PropTypes.object,
	heading: PropTypes.object,
	headline: PropTypes.object,
	related_categories: PropTypes.object,
	subheadline: PropTypes.object,
	subheadline_bold: PropTypes.object,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
	useCustomComponent: PropTypes.bool,
};
