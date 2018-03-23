'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import {
	Text,
	ListView,
} from 'BuildLibrary';
import {
	elements,
	colors,
	measurements,
} from '../lib/styles';
import { setProductSpecFilter } from '../actions/ProductDetailActions';
import SearchFilterInput from '../components/SearchFilterInput';
import TextHighlighter from '../components/TextHighlighter';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { trackState } from '../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({
	spec: {
		paddingVertical: measurements.gridSpace1,
		paddingHorizontal: measurements.gridSpace2,
	},
	list: {
		paddingTop: measurements.gridSpace1,
	},
	lightSpec: {
		backgroundColor: colors.white,
	},
	darkSpec: {
		backgroundColor: colors.lightGray,
	},
});

export class ProductSpecifications extends Component {

	componentDidMount() {
		this.props.actions.trackState('build:app:productspecs');
	}

	componentWillUnmount() {
		this.props.actions.setProductSpecFilter('');
	}

	getRowColor = (id) => {
		return id % 2 === 1 ? componentStyles.darkSpec : componentStyles.lightSpec;
	};

	getProductSpecData = () => {
		const { productSpecFilter, productSpecs } = this.props;
		if (productSpecFilter) {
			return productSpecs.filter((spec) => {
				if (!spec.hidden) {
					return spec.attributeName.toLowerCase().indexOf(productSpecFilter.toLowerCase()) !== -1;
				}
			});
		}
		return productSpecs.filter((spec) => !spec.hidden);
	};

	renderAttributeName = (attributeName) => {
		const { productSpecFilter } = this.props;
		if (productSpecFilter) {
			return (
				<TextHighlighter
					fullText={attributeName}
					textToMatch={productSpecFilter}
				/>);
		}
		return <Text weight="bold">{attributeName}</Text>;
	};

	renderRow = (spec, sectionId, rowId) => {
		let values = [];
		if (spec && Array.isArray(spec.productSpecValue)) {
			values = spec.productSpecValue.map((item) => item.value);
		}
		return (
			<View style={[componentStyles.spec, this.getRowColor(rowId)]}>
				{this.renderAttributeName(spec.attributeName)}
				<Text>{values.join(', ')}</Text>
			</View>
		);
	};

	render() {
		const dataSource = new ListView.DataSource({
			rowHasChanged:() => true,
		}).cloneWithRows(this.getProductSpecData());
		return (
			<View style={elements.screenWithHeader}>
				<SearchFilterInput
					onChangeText={this.props.actions.setProductSpecFilter}
					placeholder="Search Product Specifications"
				/>
				<ListView
					dataSource={dataSource}
					enableEmptySections={true}
					renderRow={this.renderRow}
					style={componentStyles.list}
				/>
			</View>
		);
	}

}

ProductSpecifications.route = {
	navigationBar: {
		visible: true,
		title: 'Product Specifications',
	},
};

ProductSpecifications.propTypes = {
	actions: PropTypes.object.isRequired,
	compositeId: PropTypes.number.isRequired,
	productSpecFilter: PropTypes.string.isRequired,
	productSpecs: PropTypes.array.isRequired,
};

ProductSpecifications.defaultProps = {
	productSpecFilter: '',
};

const mapStateToProps = (state, ownProps) => {
	return {
		productSpecs: state.productsReducer[ownProps.compositeId].productSpecs,
		productSpecFilter: state.productDetailReducer.productSpecFilter,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			setProductSpecFilter,
			trackState,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductSpecifications);
