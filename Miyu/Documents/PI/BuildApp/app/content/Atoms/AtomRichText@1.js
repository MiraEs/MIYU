import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import QuillRender from 'react-native-quill-render';
import styles from '../../lib/styles';

class AtomRichText extends Component {
	render() {
		return (
			<QuillRender
				data={this.props.textData.ops}
				textColor={styles.colors.secondary}
				linkColor={styles.colors.primary}
				listIndent={styles.measurements.gridSpace2}
			/>
		);
	}
}

AtomRichText.propTypes = {
	textData: PropTypes.shape({
		ops: PropTypes.array,
	}),
};

export default AtomRichText;
