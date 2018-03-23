import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import DealsTemplate from './Templates/DealsTemplate@1';
import Article from './Templates/Article';
import SharedPromo from './Templates/SharedPromo@1';
import NativeHome from './Templates/NativeHome@1';
import AtomText from './Atoms/AtomText@1';
import NativeSupportHelp from './Templates/NativeSupportHelp@1';

export default class TemplateComponent extends Component {

	render() {
		const { contentItem, selectedTab } = this.props;
		let error = 'No content found.';
		if (contentItem && contentItem.content) {
			const { content } = contentItem;
			if (content._type) {
				switch (content._type.split('.')[0]) {
					case 'deals-template@1':
						return (
							<DealsTemplate
								contentItem={contentItem}
								selectedTab={selectedTab}
							/>
						);
					case 'shared-promo@1':
						return <SharedPromo contentItem={contentItem}/>;
					case 'native-home@1':
						return (
							<NativeHome
								contentItem={contentItem}
								selectedTab={selectedTab}
							/>
						);
					case 'article-vendor-product-spotlight@1':
					case 'article-vendor-product-spotlight@2':
					case 'article-before-after@1':
					case 'article-before-after@2':
						return <Article contentItem={contentItem}/>;
					case 'native-support-help@1':
						return <NativeSupportHelp contentItem={contentItem} />;
					default:
						error = `Unknown template: ${content._type}`;
				}
			}
		}
		if (__DEV__) {
			return (
				<AtomText
					textAlign="center"
					size="small"
					color="error"
					text={error}
				/>
			);
		}
		return null;
	}
}

TemplateComponent.propTypes = {
	contentItem: PropTypes.object.isRequired,
	selectedTab: PropTypes.string,
};
