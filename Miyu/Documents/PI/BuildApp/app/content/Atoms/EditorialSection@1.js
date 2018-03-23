import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styles from '../../lib/styles';
import AtomComponent from '../AtomComponent';

export default class EditorialSection extends Component {

	render() {
		const {
			editorial_blobs,
			heading,
			group,
			contentItemId,
		} = this.props;
		return (
			<View style={styles.elements.paddingTop}>
				<AtomComponent
					{...heading}
					style={[styles.elements.paddingHorizontal, styles.elements.paddingTop]}
					weight="bold"
					size="larger"
					family="archer"
				/>
				<AtomComponent
					{...editorial_blobs}
					listItemProps={{
						group,
						contentItemId,
					}}
				/>
			</View>
		);
	}

}

EditorialSection.propTypes = {
	contentItemId: PropTypes.string,
	editorial_blobs: PropTypes.object,
	group: PropTypes.object,
	heading: PropTypes.object,
};
