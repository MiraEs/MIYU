import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	Platform,
	View,
} from 'react-native';
import styles from '../../lib/styles';
import AtomComponent from '../AtomComponent';
import { INCLUDE_TYPES } from '../../constants/ContentConstants';
import { ParallaxScrollView } from 'BuildLibrary';
import NavigationBar from '../../components/NavigationBar';
import NavigationBarIconButton from '../../components/navigationBar/NavigationBarIconButton';
import helpers from '../../lib/helpers';
import { withNavigation } from '@expo/ex-navigation';
import BackButton from '../../components/ExNavigationBarBackButton';
import TrackingActions from '../../lib/analytics/TrackingActions';
import Share from 'react-native-share';
import branch from 'react-native-branch';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';

const height = 350;

const componentStyles = StyleSheet.create({
	author: {
		paddingBottom: styles.measurements.gridSpace2,
	},
	backButton: {
		height: styles.dimensions.tapSizeMedium,
		width: styles.dimensions.tapSizeMedium,
		justifyContent: 'center',
		alignItems: 'center',
	},
	fixedHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: styles.dimensions.width,
		position: 'absolute',
		height: styles.headerStyleSheet.General.NavBarHeight,
		...Platform.select({
			ios: {
				backgroundColor: styles.colors.white,
				paddingTop: 20,
			},
		}),
	},
	foreground: {
		flex: 1,
		justifyContent: 'flex-end',
		padding: styles.measurements.gridSpace2,
	},
});

/**
 * Article Template
 */
@withNavigation
export class Article extends Component {

	constructor(props) {
		super(props);
		this.onSharePress = this.onSharePress.bind(this);
	}

	async onSharePress() {
		const title = this.props.contentItem.content.title.text;
		let url = `https://www.build.com/${helpers.slugify(title)}/a${this.props.contentItem.group.id}`;
		if (this.props.useBranchLinksForShare) {
			const branchUniversalObject = await branch.createBranchUniversalObject(title, {
				title,
				contentIndexingMode: 'private',
			});
			const linkProperties = {
				feature: 'article share',
				channel: 'BuildApp',
			};
			const controlParams = {
				$canonical_url: url,
				$desktop_url: url,
				$android_url: url,
				$ios_url: url,
			};
			const shortLink = await branchUniversalObject.generateShortUrl(linkProperties, controlParams);
			url = shortLink.url;
		}
		Share.open({
			message: `"${title}." Read now on Build.com`,
			title: 'Share Article',
			url,
		});
	}

	renderForeground = (content) => {
		return (
			<View style={componentStyles.foreground}>
				<AtomComponent
					{...content.author}
					style={componentStyles.author}
				/>
				<AtomComponent
					{...content.title}
					gradient={true}
					color="white"
					size="xlarge"
					weight="bold"
					family="archer"
				/>
			</View>
		);
	};

	renderStickyHeader = () => {
		if (helpers.isAndroid()) {
			return (
				<NavigationBar
					title={{ text: this.props.contentItem.content.title.text }}
					light={helpers.isIOS()}
				/>
			);
		}
	};

	renderFixedHeader = () => {
		if (helpers.isAndroid()) {
			return (
				<View style={componentStyles.fixedHeader}>
					<BackButton
						tintColor={styles.colors.white}
						style={componentStyles.backButton}
					/>
					<NavigationBarIconButton
						onPress={this.onSharePress}
						iconName={helpers.getIcon('share')}
						trackAction={TrackingActions.ARTICLE_SHARE_TAP}
					/>
				</View>
			);
		} else {
			return (
				<View style={componentStyles.fixedHeader}>
					<NavigationBar
						title={{
							text: this.props.contentItem.content.title.text,
						}}
						light={true}
						rightNavButton={{
							icon: helpers.getIcon('share'),
							onPress: this.onSharePress,
							style: {
								color: styles.colors.primary,
							},
						}}
						showBackButton={true}
						style={{ width: styles.dimensions.width }}
					/>
				</View>
			);
		}
	};

	render() {
		const {
			content,
			group,
			id,
		} = this.props.contentItem;
		return (
			<ParallaxScrollView
				backgroundColor={styles.colors.white}
				renderStickyHeader={this.renderStickyHeader}
				stickyHeaderHeight={styles.headerStyleSheet.General.TotalNavHeight}
				scrollingStickyheader={false}
				contentBackgroundColor={styles.colors.greyLight}
				parallaxHeaderHeight={height}
				renderFixedHeader={this.renderFixedHeader}
				renderForeground={() => this.renderForeground(content)}
				renderBackground={() => {
					return (
						<AtomComponent
							height={height}
							width={styles.dimensions.width}
							{...content.hero_media}
						>
							<LinearGradient
								start={{ x: 0.0, y: 0 }}
								end={{ x: 0.0, y: 1.0 }}
								locations={[0, 0.38, .65]}
								colors={['#261f1780', '#FFFFFF00', '#261f1740']}
								style={{ width: styles.elements.width, height }}
							/>
						</AtomComponent>
					);
				}}
			>
				<View style={[styles.elements.screen, styles.elements.paddingBottom]}>
					<AtomComponent
						{...content.subtitle}
						style={[styles.elements.paddingTop, styles.elements.paddingHorizontal]}
						size="larger"
						fontStyle="italic"
						family="archer"
					/>
					<AtomComponent
						style={[styles.elements.paddingTop, styles.elements.paddingHorizontal]}
						{...content.summary}
						fontStyle="italic"
					/>
					<AtomComponent
						style={[styles.elements.paddingTop, styles.elements.paddingHorizontal]}
						{...content.intro}
					/>
					<AtomComponent
						{...content.editorial_sections}
						listItemProps={{
							contentItemId: id,
							group,
						}}
					/>
					<AtomComponent
						{...content.conclusion}
						group={group}
						contentItemId={id}
					/>
				</View>
				<AtomComponent
					{...content.related_products}
					style={styles.elements.paddingLeft}
					includeType={INCLUDE_TYPES.PRODUCT}
					label="Featured Products"
					horizontal={true}
				/>
				<AtomComponent
					{...content.related_categories}
					includeType={INCLUDE_TYPES.CATEGORY}
					label="Featured Categories"
				/>
				<AtomComponent
					{...content.related_articles}
					includeType={INCLUDE_TYPES.ARTICLE}
					label="Related Articles"
				/>
				<AtomComponent
					{...content.related_videos}
					includeType={INCLUDE_TYPES.VIDEO}
					label="Related Videos"
				/>
			</ParallaxScrollView>
		);
	}

}

Article.propTypes = {
	contentItem: PropTypes.shape({
		content: PropTypes.shape({
			author: PropTypes.object,
			hero_media: PropTypes.object,
			intro: PropTypes.object,
			editorial_sections: PropTypes.object,
			conclusion: PropTypes.object,
			related_products: PropTypes.object,
			related_articles: PropTypes.object,
			related_videos: PropTypes.object,
			title: PropTypes.object,
		}),
		group: PropTypes.object,
		id: PropTypes.string,
	}).isRequired,
	useBranchLinksForShare: PropTypes.bool,
};

export default connect((state) => ({ useBranchLinksForShare: state.featuresReducer.features.useBranchLinksForShare }))(Article);
