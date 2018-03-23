import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
} from 'react-native';
import { Text } from 'BuildLibrary';
import styles from '../lib/styles';
import SimpleModal from './SimpleModal';

const componentStyles = StyleSheet.create({
	modalView: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	pad: {
		padding: styles.measurements.gridSpace1,
	},
});

export default class SessionInformationModal extends Component {

	renderSessionInfo = () => {
		const { lastViewedProduct, sessionCartId } = this.props;
		if (lastViewedProduct && lastViewedProduct.selectedFinish) {
			return (
				<View style={componentStyles.modalView}>
					<Text
						weight="bold"
						size="large"
					>
						Your Session Information
					</Text>
					<View style={styles.elements.flexRow}>
						<Text weight="bold">Cart #: </Text>
						<Text
							weight="normal"
							selectable={true}
						>
							{sessionCartId}
						</Text>
					</View>
					<View style={componentStyles.pad}/>
					<View style={styles.elements.flexRow}>
						<Text weight="bold">Last Viewed Item: </Text>
						<Text
							weight="normal"
							selectable={true}
						>
							{lastViewedProduct.manufacturer} {lastViewedProduct.productId}
						</Text>
					</View>
					<View style={styles.elements.flexRow}>
						<Text weight="bold">Product ID: </Text>
						<Text
							weight="normal"
							selectable={true}
						>
							{lastViewedProduct.selectedFinish.uniqueId}
						</Text>
					</View>
					<View style={styles.elements.flexRow}>
						<Text weight="bold">Product Model #: </Text>
						<Text
							weight="normal"
							selectable={true}
						>
							{lastViewedProduct.productId}
						</Text>
					</View>
					<View style={componentStyles.pad}/>
				</View>
			);
		}
		return (
			<View style={componentStyles.modalView}>
				<Text
					weight="bold"
					size="large"
				>
					Your Session Information
				</Text>
				<View style={styles.elements.flexRow}>
					<Text weight="bold">Cart #: </Text>
					<Text
						weight="normal"
						selectable={true}
					>
						{sessionCartId}
					</Text>
				</View>
				<View style={componentStyles.pad}/>
			</View>
		);
	};

	render() {
		return (
			<SimpleModal>
				{this.renderSessionInfo()}
			</SimpleModal>
		);
	}
}

SessionInformationModal.propTypes = {
	lastViewedProduct: PropTypes.object,
	sessionCartId: PropTypes.number.isRequired,
};

SessionInformationModal.defaultProps = {
	lastViewedProduct: {},
};
