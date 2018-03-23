'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
	TouchableHighlight,
} from 'react-native';
import {
	ScrollView,
	ListView,
	Text,
	withScreen,
} from 'BuildLibrary';
import styles from '../lib/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ShippingMethod from '../components/ShippingMethod';
import { setSelectedShippingIndex } from '../actions/CartActions';
import { trackState } from '../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({
	formContent: {
		marginTop: styles.measurements.gridSpace1,
		paddingHorizontal: styles.measurements.gridSpace1,
	},
	price: {
		alignSelf: 'flex-end',
		color: styles.colors.secondary,
		fontSize: styles.fontSize.small,
		justifyContent: 'flex-start',
	},
	touchTarget: {
		padding: styles.measurements.gridSpace1,
	},
	listItem: {
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
		marginBottom: styles.measurements.gridSpace2,
		backgroundColor: styles.colors.white,
	},
	selectedListItem: {
		borderColor: styles.colors.accent,
		borderWidth: styles.dimensions.borderWidthLarge,
	},
});

export class ShippingMethodScreen extends Component {

	constructor(props) {
		super(props);
		this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
		this.state = {
			selectedShippingIndex: props.selectedShippingIndex,
			shippingOptions: this.ds.cloneWithRows(props.shippingOptions),
			error: '',
		};
	}


	componentWillReceiveProps({ selectedShippingIndex, shippingOptions }) {
		this.setState({
			selectedShippingIndex,
			shippingOptions: this.ds.cloneWithRows(shippingOptions),
		});
	}

	setScreenTrackingInformation() {
		return {
			name: 'build:app:shippingmethod',
		};
	}

	getListItemStyle = (rowID, selectedShippingIndex) => {
		const result = [componentStyles.listItem];

		if (rowID === selectedShippingIndex) {
			result.push(componentStyles.selectedListItem);
		}

		return result;
	};

	handleFormChange = (selectedShippingIndex) => {
		const { shippingOptions, actions, onSaveSuccess } = this.props;

		actions.setSelectedShippingIndex(selectedShippingIndex);

		this.setState({
			selectedShippingIndex,
			shippingOptions: this.ds.cloneWithRows(shippingOptions),
			error: '',
		});
		onSaveSuccess();
	};

	renderList = () => {
		const { shippingOptions } = this.state;

		if (!shippingOptions || !shippingOptions._cachedRowCount) {
			return <Text>Please enter a shipping address before choosing a method.</Text>;
		}

		return (
			<ListView
				dataSource={shippingOptions}
				renderRow={this.renderShippingMethod}
			/>);
	};

	renderShippingMethod = (listItem, sectionID, rowID) => {
		const { selectedShippingIndex } = this.state;
		rowID = Number(rowID);

		return (
			<View
				style={this.getListItemStyle(rowID, selectedShippingIndex)}
			>
				<TouchableHighlight
					onPress={this.handleFormChange.bind(this, rowID)}
					underlayColor="rgba(0, 0, 0, .1)"
				>
					<View style={componentStyles.touchTarget}>
						<ShippingMethod shippingMethod={listItem} />
					</View>
				</TouchableHighlight>
			</View>
		);
	};

	render() {
		const { error } = this.state;
		return (
			<View
				style={styles.elements.screenGreyLight}
			>
				<ScrollView
					style={componentStyles.formContent}
					ref={(ref) => this.scrollView = ref}
					scrollsToTop={true}
				>
					<Text
						weight="bold"
						size="large"
					>
						Select a Shipping Method
					</Text>
					<Text
						color="error"
						size="small"
					>
						{error}
					</Text>
					{this.renderList()}
				</ScrollView>
			</View>
		);
	}

}

ShippingMethodScreen.route = {
	navigationBar: {
		visible: true,
		title: 'Shipping Method',
	},
};

ShippingMethodScreen.propTypes = {
	selectedShippingIndex: PropTypes.number,
	shippingOptions: PropTypes.array,
	actions: PropTypes.object,
	onSaveSuccess: PropTypes.func.isRequired,
	loading: PropTypes.bool,
};

ShippingMethodScreen.defaultProps = {
	selectedShippingIndex: 0,
	shippingOptions: [],
	loading: false,
};

const mapStateToProps = (state) => {
	return {
		error: state.userReducer.errors.checkout,
		shippingOptions: state.cartReducer.cart.shippingOptions || [],
		selectedShippingIndex: state.cartReducer.selectedShippingIndex,
		loading: state.cartReducer.isLoading,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			setSelectedShippingIndex,
			trackState,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withScreen(ShippingMethodScreen));
