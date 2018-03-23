import React, {
	Component,
	PropTypes,
} from 'react';
import { View } from 'react-native';
import AtomComponent from '../AtomComponent';

class NativeSupportHelp extends Component {

	render() {
		const { group, id } = this.props.contentItem;
		const { faqSections } = this.props.contentItem.content;
		if (faqSections) {
			return (
				<AtomComponent
					{...faqSections}
					listItemProps={{
						renderAsFAQ: true,
						contentItemId: id,
						group,
					}}
				/>
			);
		}
		return <View />;
	}

}

NativeSupportHelp.propTypes = {
	contentItem: PropTypes.shape({
		content: PropTypes.shape({
			faqSections: PropTypes.object,
		}),
		group: PropTypes.object,
		id: PropTypes.string,
	}),
};

NativeSupportHelp.defaultProps = {};

export default NativeSupportHelp;

