import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	TouchableHighlight,
	View,
	StyleSheet,
	ViewPropTypes,
} from 'react-native';
import {
	Text,
	Image,
} from 'BuildLibrary';
import Icon from 'react-native-vector-icons/Ionicons';
import styles, { fonts } from '../lib/styles';
import IconBadge from '../components/IconBadge';
import store from '../store/configStore';
import { trackAction } from '../actions/AnalyticsActions';

const componentStyles = StyleSheet.create({
	leadIconStyle: {
		marginRight: styles.measurements.gridSpace2,
		fontSize: styles.fontSize.large,
	},
	leadImageStyle: {
		width: 42,
		height: 42,
		marginRight: styles.measurements.gridSpace2,
	},
	title: {
		fontSize: styles.fontSize.regular,
		fontFamily: fonts.mainBold,
	},
	content: {
		flex: 1,
		marginRight: styles.measurements.gridSpace1,
	},
	badgeIconPosition: {
		position: 'relative',
		marginTop: 4,
		marginLeft: styles.measurements.gridSpace1,
	},
	emptySpace: {
		margin: 13,
	},
});

export default class TappableListItem extends Component {

	renderTitle = () => {
		const { title } = this.props;
		if (typeof title === 'string') {
			return <Text style={componentStyles.title}>{title}</Text>;
		} else if (title) {
			return title;
		}
	};

	renderBody = () => {
		const { body } = this.props;
		if (typeof body === 'string') {
			return <Text>{body}</Text>;
		}
		return body;
	};

	renderIcon = (icon, style) => {
		if (icon !== 'none') {
			return (
				<Icon
					name={icon}
					size={25}
					color={styles.colors.mediumGray}
					style={style}
				/>
			);
		}
	};

	renderIconBadge = () => {
		const { badgeCount } = this.props;
		return (
			<IconBadge
				badgeCount={badgeCount}
				style={componentStyles.badgeIconPosition}
				isHiddenWhenNoCount={true}
			/>
		);
	};

	renderLeadResource = () => {
		const { leadIcon, image } = this.props;
		if (leadIcon === 'empty-space') {
			return (
				<View style={componentStyles.emptySpace}/>
			);
		} else if (leadIcon !== 'none') {
			return this.renderIcon(leadIcon, componentStyles.leadIconStyle);
		} else if (image) {
			return (
				<Image
					source={image}
					resizeMode="contain"
					style={componentStyles.leadImageStyle}
				/>
			);
		}
	};

	render() {
		const { onPress, icon, accessibilityLabel, analyticsData } = this.props;

		return (
			<TouchableHighlight
				onLayout={this.props.onLayout}
				onPress={() => {
					onPress();
					if (analyticsData) {
						store.dispatch(trackAction(analyticsData.trackName, analyticsData.trackData));
					}
				}}
				accessibilityLabel={accessibilityLabel}
				underlayColor="rgba(0, 0, 0, .1)"
			>
				<View style={this.props.style}>
					{this.renderLeadResource()}
					<View style={componentStyles.content}>
						{this.renderTitle()}
						<View style={styles.elements.flexRow}>
							{this.renderBody()}
							{this.renderIconBadge()}
						</View>
					</View>
					{this.renderIcon(icon)}
				</View>
			</TouchableHighlight>
		);
	}

}

TappableListItem.propTypes = {
	icon: PropTypes.string,
	onPress: PropTypes.func,
	body: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.element,
		PropTypes.string,
	]),
	image: PropTypes.object,
	title: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.element,
		PropTypes.string,
	]),
	numberOfLines: PropTypes.number,
	style: ViewPropTypes.style,
	leadIcon: PropTypes.string,
	accessibilityLabel: PropTypes.string.isRequired,
	badgeCount: PropTypes.number,
	onLayout: PropTypes.func,
	analyticsData: PropTypes.shape({
		trackName: PropTypes.string.isRequired,
		trackData: PropTypes.object,
	}),
};

TappableListItem.defaultProps = {
	icon: 'ios-arrow-forward',
	style: styles.elements.row,
	leadIcon: 'none',
	numberOfLines: 1,
	accessibilityLabel: '',
	badgeCount: 0,
};
