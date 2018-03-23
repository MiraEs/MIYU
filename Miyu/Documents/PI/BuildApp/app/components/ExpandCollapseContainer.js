'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Animated,
	StyleSheet,
	View,
	ViewPropTypes,
} from 'react-native';
import { LinkButton } from 'BuildLibrary';
import styles from '../lib/styles';
import helpers from '../lib/helpers';
import Icon from 'react-native-vector-icons/Ionicons';

const componentStyles = StyleSheet.create({
	container: {
		borderColor: styles.colors.grey,
		borderBottomWidth: styles.dimensions.borderWidth,
		borderTopWidth: styles.dimensions.borderWidth,
	},
	headerWrapper: {
		paddingVertical: styles.measurements.gridSpace1,
		paddingHorizontal: styles.measurements.gridSpace1,
		paddingRight: styles.measurements.gridSpace2,
		flexDirection: 'row',
		alignItems: 'center',
	},
	collapseButton: {
		marginLeft: styles.measurements.gridSpace1,
		marginRight: styles.measurements.gridSpace2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	moreButton: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
});

class ExpandCollapseContainer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			drawerHeight: new Animated.Value(),
			drawerMaxHeight: 0,
			drawerMinHeight: 0,
			isMounting: true,
			isVisible: true,
			opacity: new Animated.Value(),
		};
	}

	onPressToggle = () => {
		const {
			drawerHeight,
			drawerMaxHeight,
			drawerMinHeight,
			isVisible,
			opacity,
		} = this.state;

		// isVisible is opposite at this point because we haven't toggled it yet
		const finalHeight = isVisible ? drawerMinHeight : drawerMaxHeight;
		const finalOpacity = isVisible ? 0 : 1;

		this.setState({ isVisible: !isVisible });

		const heightAnimation = Animated.timing(drawerHeight, {
			toValue: finalHeight,
			duration: this.props.duration,
		});
		const opacityAnimation = Animated.timing(opacity, {
			toValue: finalOpacity,
			duration: this.props.duration,
		});

		if (isVisible) {
			Animated.stagger(100, [opacityAnimation, heightAnimation]).start();
		} else {
			Animated.stagger(100, [heightAnimation, opacityAnimation]).start();
		}
	};

	setMaxHeight = (event) => {
		if (this.state.isMounting) {
			const { isVisible } = this.props;
			const drawerMaxHeight = event.nativeEvent.layout.height;
			const drawerHeight = isVisible ? drawerMaxHeight : this.state.drawerMinHeight;
			const opacity = isVisible ? 1 : 0;

			this.state.drawerHeight.setValue(drawerHeight);
			this.state.opacity.setValue(opacity);
			this.setState({
				isMounting: false,
				drawerMaxHeight,
				isVisible,
			});
		}
	};

	renderChildren = () => {
		const { children } = this.props;
		if (children) {
			return (
				<Animated.View
					onLayout={this.setMaxHeight}
					style={{
						height: this.state.drawerHeight,
						opacity: this.state.opacity,
					}}
				>
					{children}
				</Animated.View>
			);
		}
	};

	renderHeader = () => {
		const { header, headerWrapperStyle } = this.props;
		const { isVisible } = this.state;

		return (
			<View style={[componentStyles.headerWrapper, headerWrapperStyle]}>
				<LinkButton
					onPress={this.onPressToggle}
					style={componentStyles.collapseButton}
					wrapChildren={false}
				>
					<Icon
						color={styles.colors.greyDark}
						name={helpers.getIcon(isVisible ? 'remove' : 'add')}
						size={28}
					/>
				</LinkButton>
				{header}
				{this.renderMoreButton()}
			</View>
		);
	};

	renderMoreButton = () => {
		const { moreButton } = this.props;
		if (moreButton) {
			return (
				<View style={componentStyles.moreButton}>
					{this.props.moreButton}
				</View>
			);
		}
	};

	render() {
		const { children, style } = this.props;
		if (!children) {
			return null;
		}

		return (
			<View style={[componentStyles.container, style]}>
				{this.renderHeader()}
				{this.renderChildren()}
			</View>
		);
	}
}

ExpandCollapseContainer.propTypes = {
	children: PropTypes.node,
	duration: PropTypes.number,
	header: PropTypes.node,
	isVisible: PropTypes.bool,
	headerWrapperStyle: ViewPropTypes.style,
	moreButton: PropTypes.node,
	style: ViewPropTypes.style,
};

ExpandCollapseContainer.defaultProps = {
	duration: 200,
	isVisible: false,
};

export default ExpandCollapseContainer;
