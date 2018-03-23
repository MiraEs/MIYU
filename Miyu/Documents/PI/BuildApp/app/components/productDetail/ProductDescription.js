
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	ScrollView,
	withScreen,
} from 'BuildLibrary';
import { Text } from 'build-library';
import productsActions from '../../actions/ProductsActions';
import HTML from '../HTML';
import styles from '../../lib/styles';

const componentStyles = StyleSheet.create({
	screen: {
		backgroundColor: styles.colors.white,
		padding: styles.measurements.gridSpace1,
		flex: 1,
	},
	screenAlignCenter: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	content: {
		marginBottom: styles.measurements.gridSpace2,
	},
});

export class ProductDescription extends Component {

	componentDidMount() {
		const {
			actions,
			compositeId,
			shortDescription,
		} = this.props;
		if (!shortDescription || shortDescription.length === 0) {
			actions.getProductCompositeDescription({ compositeId });
		}
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:productdesc',
		};
	}

	renderTitle() {
		if (this.props.title) {
			return <Text weight="bold">{this.props.title}</Text>;
		}
	}

	render() {
		const { compositeDescriptionError } = this.props;
		if (compositeDescriptionError) {
			return (
				<View style={[componentStyles.screen, componentStyles.screenAlignCenter]}>
					<Text textAlign="center">{compositeDescriptionError}</Text>
				</View>
			);
		}
		return (
			<ScrollView style={componentStyles.screen}>
				<View style={componentStyles.content}>
					{this.renderTitle()}
					<HTML json={this.props.shortDescription} />
				</View>
			</ScrollView>
		);
	}

}

ProductDescription.route = {
	navigationBar: {
		visible: true,
		title: 'Product Description',
	},
};

ProductDescription.propTypes = {
	actions: PropTypes.shape({
		getProductCompositeDescription: PropTypes.func,
	}),
	compositeDescriptionError: PropTypes.string,
	compositeId: PropTypes.number.isRequired,
	shortDescription: PropTypes.arrayOf(PropTypes.shape({})),
	title: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
	let title = '';
	let shortDescription = [];
	let compositeDescriptionError;
	const composite = state.productsReducer[ownProps.compositeId];
	if (composite && composite.compositeDescription) {
		title = composite.compositeDescription.title;
		shortDescription = composite.compositeDescription.blocks;
	}
	if (composite && composite.compositeDescriptionError) {
		compositeDescriptionError = composite.compositeDescriptionError;
	}
	return {
		compositeDescriptionError,
		title,
		shortDescription,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getProductCompositeDescription: productsActions.getProductCompositeDescription,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(ProductDescription));
