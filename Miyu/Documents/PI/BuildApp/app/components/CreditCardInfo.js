'use strict';
import React, {
	PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import styles from '../lib/styles';
import {
	Text,
	Image,
} from 'BuildLibrary';
import {
	getCardImage,
	parseCardTypeName,
} from '../lib/CreditCard';
import helpers from '../lib/helpers';

const componentStyles = StyleSheet.create({
	paymentCard: {
		flexDirection: 'row',
	},
	paymentImage: {
		margin: styles.measurements.gridSpace1,
		backgroundColor: styles.colors.white,
	},
	cardInfoContainer: {
		justifyContent: 'center',
	},
});

export default class CreditCardInfo extends PureComponent {
	renderName = () => {
		const { name } = this.props;
		if (name) {
			return <Text weight="bold">{name}</Text>;
		}
	};

	render() {
		const { cardType, lastFour, expDate } = this.props;

		if (!cardType || !lastFour) {
			return null;
		}

		return (
			<View style={componentStyles.paymentCard}>
				<Image
					style={componentStyles.paymentImage}
					source={getCardImage(parseCardTypeName(cardType))}
					resizeMode="contain"
					height={60}
					width={60}
				/>
				<View style={componentStyles.cardInfoContainer}>
					{this.renderName()}
					<Text weight="bold">**** **** **** {lastFour}</Text>
					{expDate
						? <Text size="small">EXP {helpers.getFormattedDate(expDate, 'MM/YY')}</Text>
						: null}
				</View>
			</View>
		);
	}

}

CreditCardInfo.propTypes = {
	name: PropTypes.string,
	cardType: PropTypes.string.isRequired,
	lastFour: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]).isRequired,
	expDate: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
};
