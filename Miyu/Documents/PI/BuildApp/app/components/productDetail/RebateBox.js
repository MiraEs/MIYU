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
import helpersWithLoadRequirements from '../../lib/helpersWithLoadRequirements';
import environment from '../../lib/environment';
import Icon from 'react-native-vector-icons/Ionicons';
import pluralize from 'pluralize';
import TrackingActions from '../../lib/analytics/TrackingActions';

const componentStyles = StyleSheet.create({
	rebateBox: {
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingVertical: styles.measurements.gridSpace2,
		marginBottom: styles.measurements.gridSpace2,
		flexDirection: 'row',
		backgroundColor: 'white',
	},
	textColumn: {
		marginLeft: styles.measurements.gridSpace2,
		flex: 1,
	},
	bulletRowWrapper: {
		marginTop: styles.measurements.gridSpace1,
		flexDirection: 'row',
		paddingLeft: styles.measurements.gridSpace2,
	},
	bulletText: {
		flex: 1,
		marginLeft: styles.measurements.gridSpace3,
	},
	detailsContainer: {
		marginBottom: styles.measurements.gridSpace2,
	},
});

class RebateBox extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showDetails: false,
		};
	}

	getDetails = () => {
		const {
			rebates,
			rebates: { length },
		} = this.props;

		if (this.state.showDetails) {
			return (
				<View style={componentStyles.detailsContainer}>
					<Text>
						{length > 1 ? 'These' : 'A'} mail-in {pluralize('rebate', length, false)}{' '}
						{pluralize('is', length, false)} available for this product!
					</Text>
					{
						rebates.map((rebate) => {
							return (
								<View key={rebate.rebateId}>
									<View style={componentStyles.bulletRowWrapper}>
										<Text>&bull;</Text>
										<View style={componentStyles.bulletText}>
											<LinkButton onPress={() => helpersWithLoadRequirements.openURL(`${environment.secureHost}${rebate.link}`, TrackingActions.REBATE_LINK)}>
												<Text color="primary">{rebate.linkText}</Text>
											</LinkButton>
											<Text
												color="greyDark"
												size="small"
												style={componentStyles.offerEnds}
											>
												Offer Ends {helpers.getDateStrictFormat(rebate.endDate)}.
												Send By {helpers.getDateStrictFormat(rebate.sendByDate)}
											</Text>
										</View>
									</View>
								</View>
							);
						})
					}
				</View>
			);
		}
	};

	getShowHideText = () => {
		return this.state.showDetails ? 'Hide' : 'View';
	};

	render() {
		const { rebates: { length } } = this.props;

		return (
			<View style={componentStyles.rebateBox}>
				<Icon
					color={styles.colors.accent}
					name="md-mail-open"
					size={30}
				/>
				<View style={componentStyles.textColumn}>
					<Text
						color="accent"
						weight="bold"
					>
						{pluralize('Rebate', length, false)} Available
					</Text>
					{this.getDetails()}
					<View style={styles.elements.flexRow}>
						<LinkButton onPress={() => this.setState({ showDetails: !this.state.showDetails })}>
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

RebateBox.propTypes = {
	rebates: PropTypes.arrayOf(
		PropTypes.shape({
			link: PropTypes.string.isRequired,
			linkText: PropTypes.string.isRequired,
			endDate: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.number,
			]).isRequired,
			sendByDate: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.number,
			]).isRequired,
			startDate: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.number,
			]).isRequired,
		}),
	),
};

RebateBox.defaultProps = {
	rebates: [],
};

export default RebateBox;
