'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	TextInput,
	TouchableOpacity,
} from 'react-native';
import {
	ListView,
	Text,
	Button,
} from 'BuildLibrary';
import trackingActions from '../../lib/analytics/TrackingActions';
import styles from '../../lib/styles';


const componentStyles = StyleSheet.create({
	contentHeader: {
		flex: 1,
		backgroundColor: styles.colors.white,
	},
	contentWithList: {
		backgroundColor: styles.colors.greyLight,
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingTop: styles.measurements.gridSpace2,
		paddingBottom: styles.measurements.gridSpace1,
	},
	contentWithoutList: {
		backgroundColor: styles.colors.white,
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingVertical: styles.measurements.gridSpace2,
	},
	inputRow: {
		flexDirection: 'row',
		paddingTop: styles.measurements.gridSpace1,
	},
	input: {
		color: styles.colors.mediumGray,
		fontSize: styles.fontSize.regular,
		padding: styles.measurements.gridSpace1,
		height: styles.buttons.regular.height,
		backgroundColor: styles.colors.white,
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
	},
	loadButton: {
		flex: 0,
	},
	orText: {
		alignItems: 'center',
		marginVertical: styles.measurements.gridSpace3,
	},
	cartRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingVertical: styles.measurements.gridSpace2,
	},
	cartRowSeparator: {
		marginHorizontal: styles.measurements.gridSpace1,
		borderTopWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.greyLight,
	},
	spacer: {
		height: styles.measurements.gridSpace1,
	},
	spacerDouble: {
		height: styles.measurements.gridSpace2,
	},
});

class LoadCartModal extends Component {

	constructor(props) {
		super(props);

		this.state = {
			quoteNumber: null,
		};
	}

	getCarts = () => {
		const carts =this.props.carts;
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		return ds.cloneWithRows(carts);
	};

	onLoadCart = (sessionCartId) => {
		this.props.onLoadCart(sessionCartId);
	};

	onLoadQuote = () => {
		if (this.state.quoteNumber) {
			this.props.onLoadQuote(this.state.quoteNumber);
		}
	};

	renderCartRow = (cart, sectionId, rowId) => {
		return (
			<TouchableOpacity onPress={() => this.onLoadCart(cart.sessionCartId)}>
				<View
					key={rowId}
					style={componentStyles.cartRow}
				>
					<Text lineHeight={false}>{cart.name}</Text>
				</View>
			</TouchableOpacity>
		);
	};

	render() {

		if (this.props.isLoggedIn) {
			return (
				<View style={componentStyles.contentHeader}>
					<View style={componentStyles.contentWithList}>
						<Text weight="bold">Saved Cart Number</Text>
						<View style={componentStyles.inputRow}>
							<TextInput
								autoCapitalize="characters"
								autoCorrect={false}
								style={[componentStyles.input, styles.elements.flex]}
								clearButtonMode="always"
								onChangeText={(quoteNumber) => this.setState({ quoteNumber })}
								onSubmitEditing={this.onLoadQuote}
								value={this.state.quoteNumber}
								underlineColorAndroid="transparent"
							/>
							<Button
								accessibilityLabel="Load Cart Button"
								onPress={this.onLoadQuote}
								style={componentStyles.loadButton}
								text="Load"
								trackAction={trackingActions.LOAD_QUOTE}
							/>
						</View>
						<View style={componentStyles.orText}>
							<Text weight="bold">OR</Text>
						</View>
						<Text weight="bold">Select one of your Saved Carts</Text>
					</View>
					<ListView
						dataSource={this.getCarts()}
						renderRow={this.renderCartRow}
						renderSeparator={(sectionId, rowId) =>
							<View
								key={rowId}
								style={componentStyles.cartRowSeparator}
							/>
						}
						enableEmptySections={true}
						accessibilityLabel="Saved Carts"
					/>
				</View>
			);
		}

		return (
			<View style={componentStyles.contentHeader}>
				<View style={componentStyles.contentWithoutList}>
					<Button
						accessibilityLabel="Login Button"
						onPress={this.props.onLogin}
						text="Login to Access Saved Carts"
						trackAction={trackingActions.LOAD_LOGIN}
					/>
					<View style={componentStyles.orText}>
						<Text weight="bold">OR</Text>
					</View>
					<Text weight="bold">Saved Cart Number</Text>
					<View style={componentStyles.spacer}/>
					<TextInput
						autoCapitalize="characters"
						autoCorrect={false}
						style={componentStyles.input}
						clearButtonMode="always"
						onChangeText={(quoteNumber) => this.setState({ quoteNumber })}
						onSubmitEditing={this.onLoadQuote}
						onEndEditing={this.onLoadQuote}
						value={this.state.quoteNumber}
						underlineColorAndroid="transparent"
					/>
					<View style={componentStyles.spacerDouble}/>
					<Button
						accessibilityLabel="Load Cart Button"
						onPress={this.onLoadQuote}
						text="Load Cart"
						trackAction={trackingActions.LOAD_QUOTE}
					/>
				</View>
			</View>
		);
	}
}

LoadCartModal.propTypes = {
	carts: PropTypes.array,
	isLoggedIn: PropTypes.bool,
	onLoadCart: PropTypes.func.isRequired,
	onLoadQuote: PropTypes.func.isRequired,
	onLogin: PropTypes.func.isRequired,
};

LoadCartModal.defaultProps = {
	carts: [],
};

export default LoadCartModal;
