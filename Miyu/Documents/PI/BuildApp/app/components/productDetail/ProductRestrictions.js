
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { connect } from 'react-redux';
import InlineAlert from '../InlineAlert';
import pluralize from 'pluralize';
import styles from '../../lib/styles';
import Button from '../button';
import TrackingActions from '../../lib/analytics/TrackingActions';
import productConfigurationHelpers from '../../lib/ProductConfigurationHelpers';

const componentStyles = StyleSheet.create({
	inlineAlert: {
		margin: styles.measurements.gridSpace1,
	},
	bodyText: {
		textAlign: 'center',
		color: styles.colors.error,
	},
	button: {
		marginTop: styles.measurements.gridSpace1,
	},
});

export class ProductRestrictions extends Component {

	navigateToSearch = () => {
		const keyword = this.props.application;
		this.props.navigator.push('productDrops', {
			searchCriteria: {
				keyword,
				page: 1,
				pageSize: 50,
			},
			tracking: {
				name: 'build:app:productrestrictions:searchresults',
				data: {
					keyword,
				},
			},
		});
	};

	renderButton = (restriction) => {
		if (restriction.policyDescription.toLowerCase().indexOf('ab1953') !== -1) {
			return (
				<Button
					text="Shop Similar Products"
					onPress={this.navigateToSearch}
					style={componentStyles.button}
					trackAction={TrackingActions.PRODUCT_RESTRICTIONS_SHOP_SIMILAR}
					accessibilityLabel="Shop Similar Products Button"
				/>
			);
		}
	};

	renderBody = (restriction) => {
		const locales = restriction.locales.map((locale) => locale.stateCode);
		return (
			<View>
				<Text style={componentStyles.bodyText}>This item cannot be shipped to the following {pluralize('location', locales.length)}: {locales.join(', ')}</Text>
				{this.renderButton(restriction)}
			</View>
		);
	};

	renderRestrictions = () => {
		if (this.props.restrictions.length) {
			return this.props.restrictions.map((restriction, index) => {
				if (!Array.isArray(restriction.locales)) {
					return <View/>;
				}
				return (
					<InlineAlert
						key={index}
						title={restriction.policyDescription}
						style={componentStyles.inlineAlert}
					>
						{this.renderBody(restriction)}
					</InlineAlert>
				);
			});
		}
	};

	render() {
		return (
			<View>{this.renderRestrictions()}</View>
		);
	}

}

ProductRestrictions.propTypes = {
	application: PropTypes.string.isRequired,
	restrictions: PropTypes.array.isRequired,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
};

ProductRestrictions.defaultProps = {
	application: '',
	restrictions: [],
};

const mapStateToProps = (state, ownProps) => {
	const productComposite = productConfigurationHelpers.getProductComposite(ownProps.productConfigurationId) || {};
	const selectedFinish = productConfigurationHelpers.getSelectedFinish(ownProps.productConfigurationId) || {};
	return {
		application: productComposite.application,
		restrictions: selectedFinish.restrictions || [],
	};
};

export default connect(mapStateToProps)(ProductRestrictions);
