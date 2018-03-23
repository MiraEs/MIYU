import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	ViewPropTypes,
} from 'react-native';
import { TouchableOpacity } from 'BuildLibrary';
import { STORE_ID } from '../../constants/constants';
import { withNavigation } from '@expo/ex-navigation';
import {
	ARTICLE,
	CATEGORY,
	ROUTE,
} from '../../constants/ContentConstants';
import { connect } from 'react-redux';

@withNavigation
export class AtomLinkPicker extends Component {

	constructor(props) {
		super(props);
		const { links } = this.props;
		if (links && links[STORE_ID]) {
			const link = links[STORE_ID];
			if (link.linkType && link.data && Array.isArray(link.data.selected)) {
				const selected = link.data.selected[0];
				switch (link.linkType.toLowerCase()) {
					case 'category': {
						const categoryId = selected.categoryId;
						this.linkRoute = 'category';
						this.linkProps = {
							selectedFacets: link.facets ? link.facets.selected : [],
							storeId: selected.storeId,
							categoryId,
						};
						this.trackingData = { _c: categoryId };
						break;
					}
					case 'video': {
						this.linkRoute = 'video';
						const video = props.videoIncludes[selected];
						this.linkProps = {
							...video,
						};
						break;
					}
					case 'product': {
						this.linkRoute = 'productDetail';
						let uniqueId;
						if (link.finish) {
							if (typeof link.finish.uniqueId === 'number') {
								uniqueId = link.finish.uniqueId;
							}
						}
						this.linkProps = {
							compositeId: selected,
							uniqueId,
						};
						this.trackingData = { _s: selected };
						break;
					}
					case 'favorite': {
						this.linkRoute = 'favoritesList';
						this.linkProps = {
							favoriteId: selected,
						};
						this.trackingData = { _f: selected };
						break;
					}
					case 'article': {
						this.linkRoute = 'content';
						this.linkProps = {
							id: selected,
							type: ARTICLE,
						};
						this.trackingData = { _a: selected };
						break;
					}
					case 'page': {
						this.linkRoute = 'content';
						this.linkProps = {
							id: selected.id,
							type: ROUTE,
						};
						this.trackingData = { _r: selected.id };
						break;
					}
					case 'brand': {
						this.linkRoute = 'content';
						this.linkProps = {
							id: selected.id,
							type: CATEGORY,
						};
						this.trackingData = { _b: selected.id };
						break;
					}
					case 'profile': {
						this.linkRoute = 'profile';
						this.linkProps = {
							profile: props.profileIncludes[selected],
						};
					}
				}
			}
		}
	}

	render() {
		const link = this.props.links[STORE_ID];
		const { group } = this.props;
		if (link && link.data && this.linkRoute) {
			return (
				<TouchableOpacity
					onPress={() => {
						if (this.linkRoute) {
							this.props.navigator.push(this.linkRoute, this.linkProps);
						}
					}}
					trackAction={this.props.trackAction}
					trackContextData={{
						...this.trackingData,
						_cr: this.props.contentItemId,
						_g: group.id,
					}}
					activeOpacity={0.5}
				>
					{this.props.children}
				</TouchableOpacity>
			);
		} else {
			return null;
		}
	}

}

AtomLinkPicker.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.string,
		PropTypes.element,
		PropTypes.number,
	]).isRequired,
	group: PropTypes.object.isRequired,
	contentItemId: PropTypes.string.isRequired,
	links: PropTypes.object.isRequired,
	navigator: PropTypes.object,
	accentColor: PropTypes.bool,
	style: ViewPropTypes.style,
	trackAction: PropTypes.string.isRequired,
	profileIncludes: PropTypes.object,
	videoIncludes: PropTypes.object,
};

export default connect((state) => {
	return {
		profileIncludes: state.contentReducer.profileIncludes,
		videoIncludes: state.contentReducer.videoIncludes,
	};
}, null)(AtomLinkPicker);
