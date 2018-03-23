import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { withScreen } from 'BuildLibrary';
import Pdf from 'react-native-pdf';

const componentStyles = StyleSheet.create({
	pdf: {
		flex: 1,
	},
});

class ProductAttachmentDetail extends Component {

	setScreenTrackingInformation() {
		return {
			name: 'build:app:productattachmentdetail',
		};
	}

	render() {
		return (
			<Pdf
				source={{
					uri: this.props.uri,
					cache: true,
				}}
				style={componentStyles.pdf}
			/>
		);
	}

}

ProductAttachmentDetail.route = {
	navigationBar: {
		title: (params) => params.title,
		visible: true,
	},
};

ProductAttachmentDetail.propTypes = {
	uri: PropTypes.string.isRequired,
};

export default withScreen(ProductAttachmentDetail);
