import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import styles from '../../lib/styles';
import { Text } from 'BuildLibrary';
import Icon from 'react-native-vector-icons/Ionicons';
import helpers from '../../lib/helpers';
import TrackingActions from '../../lib/analytics/TrackingActions';
import tracking from '../../lib/analytics/tracking';

const componentStyles = StyleSheet.create({
	button: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	component: {
		width: 210,
		flexDirection: 'row',
	},
	container: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		flex: 1,
	},
	column1: {
		backgroundColor: styles.colors.primary,
	},
	column2: {
		backgroundColor: styles.colors.accent,
	},
	column3: {
		backgroundColor: styles.colors.error,
	},
});

export default class FavoritesRowActions extends Component {

	trackAction = (name) => {
		try
		{
			const {
				product: {
					manufacturer,
					productId,
				},
				selectedFinish: {
					finish,
					uniqueId,
				},
			} = this.props;
			const data = {
				finish,
				manufacturer,
				productId,
				uniqueId,
			};
			tracking.trackAction(name, data);
		} catch (e) {
			//do nothing
		}
	};

	render() {
		const favoriteProduct = {
			favoriteId: this.props.favoriteId,
			favoriteProductId: this.props.product.favoriteProductId,
			productCompositeId: this.props.product.productCompositeId,
			productUniqueId: this.props.product.uniqueId,
			selectedFinish: this.props.selectedFinish,
		};
		return (
			<View style={componentStyles.container}>
				<View style={componentStyles.component}>
					<TouchableOpacity
						onPress={() => {
							this.trackAction(TrackingActions.FAVORITE_SWIPE_CHANGE_FINISH);
							this.props.onChangeFinishTap(favoriteProduct);
						}}
						style={[componentStyles.button, componentStyles.column1]}
						accessibilityLabel="Change Finish"
					>
						<Icon
							color={styles.colors.white}
							name={helpers.getIcon('create')}
							size={30}
						/>
						<Text
							textAlign="center"
							color="white"
						>
							Change Finish
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[componentStyles.button, componentStyles.column2]}
						onPress={() => {
							this.trackAction(TrackingActions.FAVORITE_SWIPE_MOVE_OR_COPY);
							this.props.onMoveOrCopyTap(favoriteProduct);
						}}
						accessibilityLabel="Move Or Copy"
					>
						<Icon
							color={styles.colors.white}
							name={helpers.getIcon('move')}
							size={30}
						/>
						<Text
							textAlign="center"
							color="white"
						>
							Move or Copy
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[componentStyles.button, componentStyles.column3]}
						onPress={() => {
							this.trackAction(TrackingActions.FAVORITE_SWIPE_REMOVE);
							this.props.onRemoveTap(favoriteProduct);
						}}
						accessibilityLabel="Remove Product"
					>
						<Icon
							color={styles.colors.white}
							name={helpers.getIcon('trash')}
							size={30}
						/>
						<Text
							textAlign="center"
							color="white"
						>
							Remove{'\n'}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

}

FavoritesRowActions.propTypes = {
	favorites: PropTypes.object,
	product: PropTypes.object.isRequired,
	favoriteId: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]).isRequired,
	onChangeFinishTap: PropTypes.func.isRequired,
	onMoveOrCopyTap: PropTypes.func.isRequired,
	onRemoveTap: PropTypes.func.isRequired,
	selectedFinish: PropTypes.object,
};

FavoritesRowActions.defaultProps = {};
