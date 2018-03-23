import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	FlatList,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styles from '../lib/styles';
import {
	withScreen,
	Text,
} from 'BuildLibrary';
import EventEmitter from '../lib/eventEmitter';
import OrderListItem from '../components/OrderListItem';
import helpers from '../lib/helpers';
import {
	PRODUCT_SECTION,
	IMAGE_75,
} from '../constants/CloudinaryConstants';
import { loadReturns } from '../actions/OrderActions';
import PhoneHelper from '../lib/PhoneHelper';

const componentStyles = StyleSheet.create({
	list: {
		paddingHorizontal: styles.measurements.gridSpace1,
		flex: 1,
		backgroundColor: styles.colors.greyLight,
	},
	header: {
		paddingTop: styles.measurements.gridSpace1,
		flexDirection: 'row',
		justifyContent: 'center',
	},
});

export class ReturnsScreen extends Component {

	getScreenData = () => {
		const {
			actions,
			user: { customerId },
		} = this.props;
		actions.loadReturns(customerId).catch(helpers.noop).done();
	};

	setScreenTrackingInformation() {
		return {
			name: 'build:app:more:returns',
		};
	}

	onPressReturn = (returnId) => {
		this.props.navigator.push('returnDetails', { returnId });
	};

	returnKeyExtractor({ returnId }, index) {
		return returnId || index;
	}

	renderHeader = () => {
		const phone = PhoneHelper.getPhoneNumberByUserType(this.props.user);
		return (
			<View style={componentStyles.header}>
				<TouchableOpacity onPress={() => EventEmitter.emit('onCallUs', phone)}>
					<Text
						size="small"
						color="primary"
					>
						Call {PhoneHelper.formatPhoneNumber(phone)}
					</Text>
				</TouchableOpacity>
				<Text size="small"> to setup a return</Text>
			</View>
		);
	};

	renderReturn = ({ item: returnItem }) => {
		const details = [
			`Return #${returnItem.returnId}`,
			`Order #${returnItem.orderNumber}`,
			helpers.toUSD(returnItem.returnTotal),
			helpers.getDateStrictFormat(returnItem.returnDate),
		];
		const imageUri = helpers.getCloudinaryImageUrl({
			...IMAGE_75,
			section: PRODUCT_SECTION,
			name: returnItem.productImage,
			...IMAGE_75,
		});
		return (
			<OrderListItem
				image={{ uri: imageUri }}
				title={returnItem.status}
				details={details}
				onPress={() => this.onPressReturn(returnItem.returnId)}
				projectName={returnItem.projectName}
			/>
		);
	};

	render() {
		let content;
		const {
			error,
			returns,
		} = this.props;
		if (!returns && error) {
			content = (
				<Text
					textAlign="center"
					color="error"
				>
					There was an error loading your returns.
				</Text>
			);
		} else {
			content = (
				<FlatList
					data={this.props.returns}
					ListEmptyComponent={<Text textAlign="center">There are no returns to display.</Text>}
					ListHeaderComponent={this.renderHeader}
					keyExtractor={this.returnKeyExtractor}
					renderItem={this.renderReturn}
					style={componentStyles.list}
				/>
			);
		}
		return (
			<View style={styles.elements.screenWithHeaderGreyLight}>
				{content}
			</View>
		);
	}
}

ReturnsScreen.propTypes = {
	loading: PropTypes.bool,
	returns: PropTypes.array,
	actions: PropTypes.object,
	error: PropTypes.string,
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
	user: PropTypes.object,
};

ReturnsScreen.route = {
	navigationBar: {
		title: 'Returns',
	},
};

const mapStateToProps = (state) => {
	return {
		loading: state.ordersReducer.loadingReturns,
		error: state.ordersReducer.errors.loadReturns,
		returns: state.ordersReducer.returns,
		user: state.userReducer.user,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			loadReturns,
		}, dispatch),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withScreen(ReturnsScreen));
