'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import {
	LinkButton,
	Text,
} from 'BuildLibrary';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';
import Icon from 'react-native-vector-icons/Ionicons';

const componentStyles = StyleSheet.create({
	salesBox: {
		paddingHorizontal: styles.measurements.gridSpace1,
		marginBottom: styles.measurements.gridSpace2,
		flexDirection: 'row',
	},
	textColumn: {
		marginLeft: styles.measurements.gridSpace2,
		flex: 1,
	},
	offerEnds: {
		marginTop: 2,
	},
	viewDetails: {
		paddingHorizontal: styles.measurements.gridSpace1,
	},
});

class SalesBox extends Component {

	constructor(props) {
		super(props);

		this.state = {
			showDetails: false,
		};
	}

	getDetails = () => {
		if (this.state.showDetails) {
			return <Text>{this.props.sale.saleDetail}</Text>;
		}
	};

	getShowHideText = () => {
		return this.state.showDetails ? 'Hide' : 'View';
	};

	render() {
		const { sale } = this.props;

		return (
			<View style={componentStyles.salesBox}>
				<Icon
					color={styles.colors.accent}
					name={helpers.getIcon('pricetag')}
					size={30}
				/>
				<View style={componentStyles.textColumn}>
					<Text
						color="accent"
						weight="bold"
					>
						{sale.catchLine}
					</Text>
					{this.getDetails()}
					<View style={styles.elements.flexRow}>
						<Text
							color="greyDark"
							size="small"
							style={componentStyles.offerEnds}
						>
							Offer Ends {helpers.getDateStrictFormat(sale.endDate)}
						</Text>
						<LinkButton
							onPress={() => this.setState({ showDetails: !this.state.showDetails })}
							style={componentStyles.viewDetails}
						>
							<Text
								color="primary"
								size="small"
								lineHeight={false}
							>
								{this.getShowHideText()} Details
							</Text>
						</LinkButton>
					</View>
				</View>
			</View>
		);
	}
}

SalesBox.propTypes = {
	sale: PropTypes.shape({
		catchLine: PropTypes.string.isRequired,
		saleDetail: PropTypes.string.isRequired,
		endDate: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number,
		]).isRequired,
	}).isRequired,
};

export default SalesBox;
