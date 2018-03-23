import React, {
	Component,
} from 'react';
import {
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import styles from '../../lib/styles';
import {
	Text,
} from 'BuildLibrary';
import Icon from 'react-native-vector-icons/Ionicons';
import EventEmitter from '../../lib/eventEmitter';

const componentStyles = StyleSheet.create({
	content: {
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingBottom: styles.measurements.gridSpace1,
	},
	container: {
		padding: styles.measurements.gridSpace1,
		marginHorizontal: styles.measurements.gridSpace3,
		backgroundColor: styles.colors.white,
	},
	icon: {
		backgroundColor: styles.colors.none,
	},
	iconWrapper: {
		position: 'absolute',
		top: -6,
		right: 8,
	},
	middleParagraph: {
		marginVertical: styles.measurements.gridSpace2,
	},
});

export default class StoreCreditModal extends Component {
	dismiss() {
		EventEmitter.emit('hideScreenOverlay');
	};

	renderCloseButton = () => {
		return (
			<TouchableOpacity
				style={componentStyles.iconWrapper}
				onPress={this.dismiss}
			>
				<Icon
					style={componentStyles.icon}
					color={styles.colors.grey}
					size={45}
					name="ios-close"
				/>
			</TouchableOpacity>
		);
	};

	render() {
		return (
			<View style={componentStyles.container}>
				<View style={componentStyles.content}>
					<Text
						size="large"
						textAlign="center"
						weight="bold"
					>
						Why am I getting store credit?
					</Text>
					<Text style={componentStyles.middleParagraph}>
						Since you have had this item for over 30 days,
						you are only eligible for store credit.
					</Text>
					<Text>
						Our return policy covers this in greater detail.
					</Text>
				</View>
				{this.renderCloseButton()}
			</View>
		);
	}
}
