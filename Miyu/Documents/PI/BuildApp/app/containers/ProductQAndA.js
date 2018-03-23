'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Text,
	withScreen,
	ListView,
} from 'BuildLibrary';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { elements } from '../lib/styles';
import TappableListItem from '../components/TappableListItem';
import { setProductQAndAFilter } from '../actions/ProductDetailActions';
import SearchFilterInput from '../components/SearchFilterInput';
import TextHighlighter from '../components/TextHighlighter';
import { removeHTML } from '../lib/helpers';
import ProductAnswer from '../components/productDetail/ProductAnswer';

export class ProductQAndA extends Component {

	constructor(props) {
		super(props);
		this.renderRow = this.renderRow.bind(this);
		this.getQAndAData = this.getQAndAData.bind(this);
		this.getQuestionText = this.getQuestionText.bind(this);
		this.navigateToAnswer = this.navigateToAnswer.bind(this);
	}

	componentWillUnmount() {
		this.props.actions.setProductQAndAFilter('');
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:productqa',
		};
	}

	getQuestionText(entry) {
		const { filterTerm } = this.props;
		if (filterTerm) {
			return (
				<TextHighlighter
					fullText={removeHTML(entry.title)}
					textToMatch={filterTerm}
				/>);
		}
		return <Text weight="bold">{removeHTML(entry.title)}</Text>;
	}

	getQAndAData() {
		const { filterTerm, productQuestions } = this.props;
		if (filterTerm) {
			return productQuestions.filter((question) => {
				const { title } = question;
				return title.toLowerCase().indexOf(filterTerm.toLowerCase()) !== -1;
			}) ;
		}
		return productQuestions;
	}

	navigateToAnswer(question, answer) {
		this.props.navigator.push('productAnswer', {
			question,
			answer,
		});
	}

	renderRow(entry) {
		return (
			<TappableListItem
				title={this.getQuestionText(entry)}
				body={
					<ProductAnswer>
						<Text numberOfLines={4}>{removeHTML(entry.body)}</Text>
					</ProductAnswer>
				}
				onPress={() => this.navigateToAnswer(entry.title, entry.body)}
			/>
		);
	}

	render() {
		const dataSource = new ListView.DataSource({
			rowHasChanged: () => true,
		}).cloneWithRows(this.getQAndAData());
		return (
			<View style={elements.screenWithHeader}>
				<SearchFilterInput
					onChangeText={this.props.actions.setProductQAndAFilter}
					placeholder="Search Q&A"
				/>
				<ListView
					keyboardShouldPersistTaps="always"
					keyboardDismissMode="on-drag"
					enableEmptySections={true}
					dataSource={dataSource}
					renderRow={this.renderRow}
				/>
			</View>
		);
	}

}

ProductQAndA.route = {
	navigationBar: {
		title: 'Product Q&A',
		visible: true,
	},
};

ProductQAndA.propTypes = {
	actions: PropTypes.object.isRequired,
	compositeId: PropTypes.number.isRequired,
	filterTerm: PropTypes.string.isRequired,
	productQuestions: PropTypes.array.isRequired,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
};

export default connect((state, ownProps) => {
	return {
		productQuestions: state.productsReducer[ownProps.compositeId].productQuestions,
		filterTerm: state.productDetailReducer.questionAndAnswerFilter,
	};
}, (dispatch) => {
	return {
		actions: bindActionCreators({
			setProductQAndAFilter,
		}, dispatch),
	};
})(withScreen(ProductQAndA));
