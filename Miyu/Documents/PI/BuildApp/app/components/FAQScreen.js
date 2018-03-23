import React, {
	Component,
	PropTypes,
} from 'react';
import {
	StyleSheet,
	View,
	ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ContentActions from '../actions/ContentActions';
import { Text } from 'build-library';
import { withScreen } from 'BuildLibrary';
import styles from '../lib/styles';
import TemplateComponent from '../content/TemplateComponent';

const componentStyles = StyleSheet.create({
	errorContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export class FAQScreen extends Component {

	componentDidMount() {
		this.props.actions.getNamedSharedItem('native-support-help');
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:faqscreen',
		};
	}

	renderFaqContentItem = (contentItem) => {
		return (
			<TemplateComponent
				key={contentItem.id}
				contentItem={contentItem}
			/>
		);
	};

	render() {

		if (this.props.error) {
			return (
				<View style={[styles.elements.flex, componentStyles.errorContainer]}><Text>Could not retrieve FAQ at this time.</Text></View>
			);
		}


		return (
			<ScrollView>
				{this.props.faqSections.map(this.renderFaqContentItem)}
			</ScrollView>
		);
	}

}

FAQScreen.propTypes = {
	actions: PropTypes.shape({
		getNamedSharedItem: PropTypes.func,
	}),
	faqSections: PropTypes.array,
	error: PropTypes.bool,
};

FAQScreen.defaultProps = {};

export const mapStateToProps = (state) => {
	const { errors, namedSharedItems } = state.contentReducer;
	const faqName = 'native-support-help';
	const error = errors && errors[faqName] instanceof Error;
	const faqSections = namedSharedItems && namedSharedItems[faqName] || [];
	return {
		error,
		faqSections,
		isLoading: !error && !faqSections,
	};
};

export const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getNamedSharedItem: ContentActions.getNamedSharedItem,
		}, dispatch),
	};
};


export default connect(mapStateToProps, mapDispatchToProps)(withScreen(FAQScreen));

