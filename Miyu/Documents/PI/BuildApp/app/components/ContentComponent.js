import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { withScreen } from 'BuildLibrary';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	StyleSheet,
	View,
} from 'react-native';
import TemplateComponent from '../content/TemplateComponent';
import {
	getContent,
	getRoutePage,
} from '../actions/ContentActions';
import styles from '../lib/styles';
import ContentError from './ContentError';
import { trackAction } from '../actions/AnalyticsActions';
const componentStyles = StyleSheet.create({
	background: {
		flex: 1,
		backgroundColor: styles.colors.greyLight,
	},
});

export class ContentComponent extends Component {

	setScreenTrackingInformation() {
		return (props) => {
			if (props && props.trackName) {
				return {
					name: props.trackName,
				};
			}
		};
	}

	getScreenData = () => {
		const {
			actions,
			contentItem,
			id,
			type,
			pageRoute,
		} = this.props;
		if (!contentItem.content) {
			if (pageRoute) {
				actions.getRoutePage(pageRoute);
			} else if (id) {
				actions.getContent(id, type);
			}
		}
	};

	render() {
		const { contentItem, error, tab } = this.props;
		let content;
		if (error) {
			content = <ContentError retry={this.getScreenData}/>;
		} else {
			content = (
				<TemplateComponent
					contentItem={contentItem}
					selectedTab={tab}
				/>
			);
		}
		return (
			<View style={componentStyles.background}>
				{content}
			</View>
		);
	}

}

ContentComponent.route = {
	navigationBar: {
		visible: false,
	},
};

ContentComponent.propTypes = {
	actions: PropTypes.object,
	contentItem: PropTypes.object.isRequired,
	id: PropTypes.number,
	pageRoute: PropTypes.string,
	error: PropTypes.object,
	loading: PropTypes.bool,
	trackName: PropTypes.string.isRequired,
	type: PropTypes.string,
	tab: PropTypes.string,
};

ContentComponent.defaultProps = {
	trackName: 'build:app:content',
};

const mapStateToProps = (state, ownProps) => {
	const error = state.contentReducer.errors[ownProps.id || ownProps.pageRoute];
	let contentItem;
	if (ownProps.pageRoute) {
		contentItem = state.contentReducer.routePages[ownProps.pageRoute];
	} else {
		contentItem = state.contentReducer.contentItems[ownProps.id];
	}
	return {
		loading: contentItem === undefined && !error,
		contentItem: contentItem || {},
		error,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getContent,
			getRoutePage,
			trackAction,
		}, dispatch),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withScreen(ContentComponent));
