import React, {
	Component,
	PropTypes,
} from 'react';
import { View } from 'react-native';
import ListHeader from '../../components/listHeader';
import AtomComponent from '../AtomComponent';

class AtomSection extends Component {
	render() {
		const {
			heading,
			editorial_blobs,
			renderAsFAQ,
			group,
			contentItemId,
		} = this.props;
		if (renderAsFAQ) {
			return (
				<View>
					<ListHeader text={this.props.heading.text} />
					{
						editorial_blobs &&
						<AtomComponent
							{...editorial_blobs}
							listItemProps={{
								renderAsFAQ: true,
								group,
								contentItemId,
							}}
						/>
					}
				</View>
			);
		}
		return (
			<View>
				{heading && <ListHeader text={this.props.heading.text} />}
				{editorial_blobs && <AtomComponent {...editorial_blobs} />}
			</View>
		);
	}

}

AtomSection.propTypes = {
	heading: PropTypes.shape({
		text: PropTypes.string,
	}),
	editorial_blobs: PropTypes.object,
	renderAsFAQ: PropTypes.bool,
	group: PropTypes.object,
	contentItemId: PropTypes.string,
};

AtomSection.defaultProps = {};

export default AtomSection;

