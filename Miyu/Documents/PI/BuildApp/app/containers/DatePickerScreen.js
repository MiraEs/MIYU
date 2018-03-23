import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import styles from '../lib/styles';
import {
	CalendarPicker,
	IconButton,
	Text,
	withScreen,
} from 'BuildLibrary';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import helpers from '../lib/helpers';
import { navigatorPop } from '../actions/NavigatorActions';
import {
	getDeliveryDates,
	setDeliveryDate,
} from '../actions/CartActions';
import TrackingActions from '../lib/analytics/TrackingActions';

const componentStyles = StyleSheet.create({
	summary: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: styles.measurements.gridSpace2,
	},
	footer: {
		backgroundColor: styles.colors.white,
		elevation: 3,
		shadowColor: 'black',
		shadowOpacity: 0.4,
		shadowRadius: 2,
		shadowOffset: {
			height: 1,
			width: 0,
		},
		zIndex: 2,
	},
});

export class DatePickerScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:datepickerscreen',
		};
	}

	getScreenData = () => {
		const {
			actions,
			zipCode,
		} = this.props;
		actions.getDeliveryDates(zipCode);
	};

	renderButton = () => {
		if (this.state.selectedDate) {
			return (
				<IconButton
					testID="requestDeliveryDate"
					trackAction={TrackingActions.CALENDAR_PICKER_REQUEST_DELIVERY_DATE}
					borders={false}
					iconName={helpers.getIcon('calendar')}
					style={componentStyles.footerSection}
					text="Request Delivery Date"
					textColor="white"
					onPress={() => {
						this.props.actions.setDeliveryDate(this.state.selectedDate, this.props.itemIds);
						navigatorPop('root');
					}}
				/>
			);
		}
	};

	render() {
		const {
			selectedDate,
		} = this.state;
		return (
			<View style={[styles.elements.flex1, { backgroundColor: styles.colors.greyLight }]}>
				<CalendarPicker
					dates={this.props.deliveryDates}
					selection={this.state.selectedDate}
					onSelectDate={(selectedDate) => this.setState({ selectedDate })}
				/>
				<View style={componentStyles.footer}>
					<View style={componentStyles.summary}>
						<Text lineHeight={false}>
							Selected delivery date:
						</Text>
						<Text
							lineHeight={false}
							weight="bold"
						>
							{selectedDate ? helpers.getDateStrictFormat(selectedDate) : 'Make a selection'}
						</Text>
					</View>
					{this.renderButton()}
				</View>
			</View>
		);
	}
}

DatePickerScreen.route = {
	navigationBar: {
		visible: true,
		title: 'Schedule Delivery',
	},
};

DatePickerScreen.propTypes = {
	actions: PropTypes.object.isRequired,
	deliveryDates: PropTypes.array,
	itemIds: PropTypes.array.isRequired,
	loading: PropTypes.bool,
	requestedDeliveryDate: PropTypes.object,
	zipCode: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]).isRequired,
};

export const mapStateToProps = (state) => {
	return {
		deliveryDates: state.cartReducer.cart.availableDeliveryDates || [],
		loading: !state.cartReducer.cart.availableDeliveryDates,
	};
};

export const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			getDeliveryDates,
			setDeliveryDate,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(DatePickerScreen));
