'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
} from 'react-native';
import {
	Text,
	ScrollView,
} from 'BuildLibrary';
import styles from '../../lib/styles';
import { removeHTML } from '../../lib/helpers';
import ProductAnswer from './ProductAnswer';
import { trackState } from '../../actions/AnalyticsActions';
import store from '../../store/configStore';

const componentStyles = StyleSheet.create({
	container: {
		padding: styles.measurements.gridSpace2,
	},
});

class ProductFullAnswer extends Component {

	componentDidMount() {
		store.dispatch(trackState('build:app:productfullanswer'));
	}

	render() {
		const {
			question,
			answer,
		} = this.props;
		return (
			<ScrollView style={[styles.elements.screenWithHeader, componentStyles.container]}>
				<Text weight="bold">{removeHTML(question)}</Text>
				<ProductAnswer>
					<Text>{removeHTML(answer)}</Text>
				</ProductAnswer>
			</ScrollView>
		);
	}

}

ProductFullAnswer.route = {
	navigationBar: {
		visible: true,
		title: 'Product Q&A',
	},
};

ProductFullAnswer.propTypes = {
	answer: PropTypes.string.isRequired,
	question: PropTypes.string.isRequired,
};

export default ProductFullAnswer;
