import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
	ViewPropTypes,
} from 'react-native';
import styles from '../lib/styles';
import { Text } from 'BuildLibrary';

const componentStyles = StyleSheet.create({
	default: {
		paddingTop: styles.measurements.gridSpace1,
	},
	borderBottom: {
		borderBottomColor: styles.colors.grey,
		borderBottomWidth: styles.dimensions.borderWidth,
	},
	container: {
		backgroundColor: styles.colors.greyLight,
	},
});

export default class ListHeader extends Component {

	style() {
		const style = [componentStyles.default];
		if (this.props.background) {
			style.push(componentStyles.container);
		}
		if (this.props.border) {
			style.push(componentStyles.borderBottom);
		}
		if (this.props.style) {
			style.push(this.props.style);
		}
		return style;
	}

	render() {
		const { accessibilityLabel, text } = this.props;
		return (
			<View
				style={this.style()}
				accessibilityLabel={accessibilityLabel}
			>
				<Text
					family="archer"
					lineHeight={false}
					style={styles.elements.listHeader}
					weight="bold"
				>
					{text.toUpperCase()}
				</Text>
			</View>
		);
	}

}

ListHeader.propTypes = {
	text: PropTypes.string,
	accessibilityLabel: PropTypes.string,
	border: PropTypes.bool,
	background: PropTypes.bool,
	style: ViewPropTypes.style,
};

ListHeader.defaultProps = {
	border: true,
	background: true,
};
