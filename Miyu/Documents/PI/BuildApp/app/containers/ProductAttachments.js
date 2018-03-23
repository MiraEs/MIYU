
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { ListView } from 'BuildLibrary';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from '../lib/styles';
import productsActions from '../actions/ProductsActions';
import TappableListItem from '../components/TappableListItem';
import helpers from '../lib/helpers';
import { openURL } from '../lib/helpersWithLoadRequirements';
import { trackState } from '../actions/AnalyticsActions';

export class ProductAttachments extends Component {

	componentDidMount() {
		const { actions, compositeId } = this.props;
		actions.getProductAttachments(compositeId).catch(helpers.noop).done();
		actions.trackState('build:app:productattachment');
	}

	onAttachmentPress = (uri, title) => {
		if (helpers.isIOS()) {
			openURL(uri);
		} else {
			this.props.navigator.push('productAttachmentDetail', {
				uri,
				title,
			});
		}
	};

	renderRow = (attachment) => {
		return (
			<TappableListItem
				body={attachment.displayName}
				leadIcon={helpers.getIcon('attach')}
				onPress={() => this.onAttachmentPress(attachment.url, attachment.displayName)}
			/>
		);
	};

	render() {
		const dataSource = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1.displayName !== r2.displayName,
		}).cloneWithRows(this.props.attachments);
		return (
			<ListView
				dataSource={dataSource}
				enableEmptySections={true}
				renderRow={this.renderRow}
				style={styles.elements.screenWithHeader}
			/>
		);
	}

}

ProductAttachments.route = {
	navigationBar: {
		title: 'Manufacturer Resources',
		visible: true,
	},
};

ProductAttachments.propTypes = {
	actions: PropTypes.object.isRequired,
	attachments: PropTypes.array.isRequired,
	compositeId: PropTypes.number.isRequired,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
};

ProductAttachments.defaultProps = {
	attachments: [],
};

export const mapStateToProps = (state, ownProps) => {
	const {
		attachments,
	} = state.productsReducer[ownProps.compositeId];
	return {
		attachments,
	};
};

export const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getProductAttachments: productsActions.getProductAttachments,
			trackState,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductAttachments);
