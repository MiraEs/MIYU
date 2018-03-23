'use strict';
import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	TouchableOpacity,
} from 'react-native';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';
import { Text } from 'BuildLibrary';
import Icon from 'react-native-vector-icons/Ionicons';
import tracking from '../../lib/analytics/tracking';

const componentStyles = StyleSheet.create({
	component: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-end',
		borderTopWidth: styles.dimensions.borderWidth,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
	},
	buttonRowWrapper: {
		flexGrow: 1,
		alignItems: 'flex-end',
	},
	buttonRow: {
		flexDirection: 'row',
		flexGrow: 1,
		alignItems: 'flex-end',
	},
	button: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: 70,
	},
	primaryButton: {
		backgroundColor: styles.colors.primary,
	},
	errorButton: {
		backgroundColor: styles.colors.error,
	},
});

class CartRowActions extends Component {

	onAddToProject = () => {
		this.props.onAddToProject(this.props.cartItem);
	};

	onDeleteCartItem = () => {
		const cartItem = this.props.cartItem;
		tracking.trackCartItemDelete(cartItem, true);
		this.props.onDeleteCartItem(cartItem);
	};

	renderAddToProjectButton = () => {
		if (this.props.enableShoppingLists) {
			return (
				<View style={componentStyles.component}>
					<TouchableOpacity
						style={[componentStyles.button, componentStyles.primaryButton]}
						onPress={this.onAddToProject}
					>
						<Icon
							color={styles.colors.white}
							name="md-folder-open"
							size={30}
						/>
						<Text
							size="small"
							color="white"
							textAlign="center"
						>
							Add to Project
						</Text>
					</TouchableOpacity>
				</View>
			);
		}
	};

	render() {
		return (
			<View style={componentStyles.buttonRowWrapper}>
				<View style={componentStyles.buttonRow}>
					{this.renderAddToProjectButton()}
					<View style={componentStyles.component}>
						<TouchableOpacity
							style={[componentStyles.button, componentStyles.errorButton]}
							onPress={this.onDeleteCartItem}
						>
							<Icon
								color={styles.colors.white}
								name={helpers.getIcon('trash')}
								size={30}
							/>
							<Text
								size="small"
								color="white"
								textAlign="center"
							>
								Remove
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}
}

CartRowActions.propTypes = {
	rowId: PropTypes.string.isRequired,
	cartItem: PropTypes.object.isRequired,
	enableShoppingLists: PropTypes.bool,
	onAddToProject: PropTypes.func.isRequired,
	onDeleteCartItem: PropTypes.func.isRequired,
};

CartRowActions.defaultProps = {
	enableShoppingLists: false,
};

export default CartRowActions;
