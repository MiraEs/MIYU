import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import branch from 'react-native-branch';
import Share from 'react-native-share';
import NavigationBarIconButton from './NavigationBarIconButton';
import TrackingActions from '../../lib/analytics/TrackingActions';
import helpers from '../../lib/helpers';

export class NavigationBarProductShareButton extends Component {

	onSharePress = async () => {
		const {
			manufacturer,
			title,
			productId,
			compositeId,
			type,
			selectedFinish,
			uniqueId,
			useBranchLinksForShare,
		} = this.props;
		let url = `https://www.build.com/${helpers.slugify(`${manufacturer}-${productId}`)}/s${compositeId}${uniqueId ? `?uid=${uniqueId}` : ''}`;
		if (useBranchLinksForShare) {
			const branchUniversalObject = await branch.createBranchUniversalObject(`${manufacturer} ${productId} ${title}`, {
				title: `${manufacturer} ${productId} ${title} on Build.com`,
				contentIndexingMode: 'private',
			});
			const linkProperties = {
				feature: 'product page share',
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
			message: `View the ${manufacturer} ${productId} ${title} on Build.com`,
			title: 'Share Product',
			url,
		}).then((result) => {
			tracking.trackProductShared(result, {
				manufacturer,
				title,
				productId,
				compositeId,
				type,
				selectedFinish,
			});
		}).catch(helpers.noop).done();

	};

	render() {
		const {
			description,
		} = this.props;
		return (
			<NavigationBarIconButton
				onPress={this.onSharePress}
				iconName={helpers.getIcon('share')}
				loading={!description}
				trackAction={TrackingActions.PDP_NAV_TAP_SHARE}
			/>
		);
	}

}

NavigationBarProductShareButton.propTypes = {
	manufacturer: PropTypes.string,
	title: PropTypes.string,
	productId: PropTypes.string,
	compositeId: PropTypes.number,
	type: PropTypes.string,
	selectedFinish: PropTypes.object,
	uniqueId: PropTypes.number,
	useBranchLinksForShare: PropTypes.bool,
	description: PropTypes.string,
};

NavigationBarProductShareButton.defaultProps = {

};

export const mapStateToProps = (state, ownProps) => {
	const product = state.productsReducer[ownProps.compositeId];
	if (!product) {
		return {
			description: '',
		};
	}
	const {
		manufacturer,
		title,
		productId,
		type,
		selectedFinish,
		description,
	} = product;
	let uniqueId;
	if (selectedFinish && selectedFinish.uniqueId) {
		uniqueId = selectedFinish.uniqueId;
	}
	return {
		useBranchLinksForShare: state.featuresReducer.features.useBranchLinksForShare,
		manufacturer,
		title,
		productId,
		type,
		selectedFinish,
		uniqueId,
		description,
	};
};

export default connect(mapStateToProps)(NavigationBarProductShareButton);
