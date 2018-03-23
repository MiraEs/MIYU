'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
	StyleSheet,
	WebView,
	ViewPropTypes,
} from 'react-native';
import styles from '../lib/styles';
import { Text } from 'BuildLibrary';

const componentStyles = StyleSheet.create({
	gallerySwatch: {
		width: 28,
		height: 28,
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.grey,
		margin: styles.measurements.gridSpace1,
		marginLeft: 0,
	},
	moreCount: {
		justifyContent: 'center',
		alignItems: 'center',
	},
});

class SwatchImage extends Component {

	getBorder() {
		return {
			borderColor: this.props.selected ? styles.colors.accent : styles.colors.grey,
			borderWidth: styles.dimensions.borderWidth,
		};
	}

	render() {
		const { moreCount, finish } = this.props,
			{ finishSwatch } = finish;
		if (moreCount) {
			return (
				<View
					style={[componentStyles.gallerySwatch, componentStyles.moreCount, this.props.style]}
				>
					<Text size="small">
						+{moreCount}
					</Text>
				</View>
			);
		}
		if (!finishSwatch) {
			return <View/>;
		}
		if (finishSwatch.styleValue) {
			const gradientStyle = `background: ${finishSwatch.styleValue.replace(/(\n|\\n)/gm, '').replace('background:', '')}`,
				html = `<!DOCTYPE html><html style="${gradientStyle}; margin: 0; background-repeat: no-repeat; background-attachment: fixed; height: 100%; width: 100%;"></html>`;
			return (
				<View style={[componentStyles.gallerySwatch, this.getBorder(), this.props.style]}>
					<WebView
						automaticallyAdjustContentInsets={false}
						scrollEnabled={false}
						source={{
							html,
						}}
						javaScriptEnabled={false}
					/>
				</View>
			);
		}
		if (finishSwatch.hexValue && (finishSwatch.hexValue.length === 3 || finishSwatch.hexValue.length === 6)) {
			return (
				<View
					style={[
						componentStyles.gallerySwatch,
						{ backgroundColor: `#${finishSwatch.hexValue}` },
						this.getBorder(),
						this.props.style,
					]}
				/>
			);
		}
		return <View/>;
	}

}

SwatchImage.propTypes = {
	selected: PropTypes.bool,
	finish: PropTypes.object.isRequired,
	moreCount: PropTypes.number,
	style: ViewPropTypes.style,
};

SwatchImage.defaultProps = {
	finish: {},
	style: {},
};

export default SwatchImage;
