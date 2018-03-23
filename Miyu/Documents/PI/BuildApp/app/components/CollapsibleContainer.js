'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Animated,
	StyleSheet,
	View,
} from 'react-native';
import {
	LinkButton,
	Text,
} from 'BuildLibrary';
import styles from '../lib/styles';
import pluralize from 'pluralize';
import Icon from 'react-native-vector-icons/Ionicons';

const componentStyles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		marginBottom: styles.measurements.gridSpace2,
		paddingTop: styles.measurements.gridSpace2,
	},
	link: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: styles.measurements.gridSpace2,
	},
	linkIcon: {
		marginLeft: styles.measurements.gridSpace1,
	},
	separator: {
		borderBottomWidth: styles.dimensions.borderWidth,
		marginBottom: styles.measurements.gridSpace2,
		borderColor: styles.colors.grey,
	},
});

class CollapsibleContainer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			drawerHeight: new Animated.Value(),
			drawerMaxHeight: 0,
			drawerMinHeight: 0,
			isMounting: true,
			isVisible: true,
		};
	}

	onPressToggle = () => {
		const {
			drawerHeight,
			drawerMaxHeight,
			drawerMinHeight,
			isVisible,
		} = this.state;
		const finalValue = isVisible ? drawerMinHeight : drawerMaxHeight;

		this.setState({ isVisible: !isVisible });

		Animated.timing(
			drawerHeight, {
				toValue: finalValue,
				duration: this.props.duration,
			}
		).start();
	};

	setMaxHeight = (event) => {
		if (this.state.isMounting) {
			this.state.drawerHeight.setValue(this.state.drawerMinHeight);
			this.setState({
				drawerMaxHeight: event.nativeEvent.layout.height,
				isMounting: false,
				isVisible: false,
			});
		}
	};

	renderFirstChild = () => {
		const { children } = this.props;

		// if there's only one child, `children` is an object
		if (Array.isArray(children)) {
			return children[0];
		}

		return children;
	};

	renderOtherChildren = () => {
		const [, ...rest] = this.props.children;

		if (rest && rest.length) {
			return (
				<Animated.View
					onLayout={this.setMaxHeight}
					style={{ height: this.state.drawerHeight }}
				>
					{rest}
				</Animated.View>
			);
		}
	};

	renderSeparator = () => {
		if (this.props.children.length - 1) {
			return <View style={componentStyles.separator}/>;
		}
	};

	renderToggle = () => {
		const { children: { length } } = this.props;
		const { isVisible } = this.state;
		const hiddenChildrenCount = length - 1;

		const button = isVisible ? `Hide Other ${pluralize('Offer', hiddenChildrenCount, false)}` : `Plus ${hiddenChildrenCount} Other ${pluralize('Offer', hiddenChildrenCount, false)}`;
		const arrow = isVisible ? 'ios-arrow-up' : 'ios-arrow-down';

		if (hiddenChildrenCount) {
			return (
				<LinkButton
					onPress={this.onPressToggle}
					style={componentStyles.link}
					wrapChildren={false}
				>
					<Text
						color="primary"
						lineHeight={false}
						weight="bold"
					>
						{button}
					</Text>
					<Icon
						name={arrow}
						size={20}
						color={styles.colors.primary}
						style={componentStyles.linkIcon}
					/>
				</LinkButton>
			);
		}
	};

	render() {
		const { children } = this.props;

		if (!children || !children.length) {
			return null;
		}

		return (
			<View style={componentStyles.container}>
				{this.renderFirstChild()}
				{this.renderSeparator()}
				{this.renderOtherChildren()}
				{this.renderToggle()}
			</View>
		);
	}
}

CollapsibleContainer.propTypes = {
	children: PropTypes.node,
	duration: PropTypes.number,
};

CollapsibleContainer.defaultProps = {
	duration: 300,
};

export default CollapsibleContainer;
