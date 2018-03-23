import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	Animated,
	LayoutAnimation,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../lib/styles';
import { Text } from 'BuildLibrary';
import helpersWithLoadRequirements from '../lib/helpersWithLoadRequirements';

const componentStyles = StyleSheet.create({
	activityRow: {
		paddingTop: styles.measurements.gridSpace1,
	},
	status: {
		paddingBottom: styles.measurements.gridSpace1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	progressBar: {
		flexDirection: 'row',
		backgroundColor: styles.colors.greyDark,
		height: styles.measurements.gridSpace2,
		borderRadius: styles.measurements.gridSpace2,
	},
	progressWrapper: {
		flex: 1,
		paddingRight: styles.measurements.gridSpace1,
	},
	detailsButton: {
		padding: styles.measurements.gridSpace1,
		borderColor: styles.colors.grey,
		borderWidth: styles.dimensions.borderWidth,
		alignSelf: 'flex-start',
		flexDirection: 'row',
		alignItems: 'center',
	},
	icon: {
		marginLeft: styles.measurements.gridSpace1,
	},
	borderTop: {
		borderTopColor: styles.colors.greyLight,
		borderTopWidth: styles.dimensions.borderWidth,
	},
	smallSection: {
		borderBottomWidth: styles.dimensions.borderWidth,
		borderBottomColor: styles.colors.greyLight,
		paddingVertical: styles.measurements.gridSpace1,
	},
	section: {
		borderTopWidth: styles.dimensions.borderWidth,
		borderTopColor: styles.colors.greyLight,
		paddingVertical: styles.measurements.gridSpace2,
		paddingHorizontal: styles.measurements.gridSpace1,
	},
	statusText: {
		marginTop: styles.measurements.gridSpace1,
	},
});

export default class ShippingTrackingDetails extends Component {

	constructor(props) {
		super(props);
		this.state = {
			progress: new Animated.Value(0),
			shimmer: new Animated.Value(0),
			maxProgress: 0,
		};
	}

	componentDidMount() {
		this.state.progress.setValue(0);
		this.state.shimmer.setValue(0);
		this.setState({
			progressPercent: this.mapStatusToProgress(),
		}, () => {
			if (this.state.progressPercent > 0) {
				Animated.sequence([
					Animated.timing(this.state.progress, { toValue: 1, delay: 200 }),
					Animated.timing(this.state.shimmer, { toValue: 1, duration: 500 }),
				]).start();
			}
		});
	}

	mapStatusToProgress = () => {
		const { shippingStatus } = this.props.shippingTrackingDetails;
		if (shippingStatus) {
			switch (shippingStatus.toLowerCase()) {
				case 'processing':
				case 'generated':
					return 0.25;
				case 'delivered':
					return 1;
				case 'intransit':
				case 'in-transit':
					return 0.5;
				case 'out-on-delivery':
				case 'pickup':
					return 0.75;
				case 'failure':
				case 'exception':
					return -1;
				default:
					return 0;
			}
		}
		return 0;
	};

	getProgressBar = () => {
		const { shippingStatus, shippingCarrier, trackingNumber } = this.props.shippingTrackingDetails;
		if (shippingStatus) {
			return (
				<View
					style={componentStyles.progressBar}
					onLayout={(event) => {
						const maxProgress = event.nativeEvent.layout.width;
						this.setState({ maxProgress });
					}}
				>
					<Animated.View style={[componentStyles.progressBar, this.getProgressStyle()]}>
						<Animated.View style={[componentStyles.progressBar, this.getShimmerStyle()]}/>
					</Animated.View>
					<Animated.View style={this.getSpacerStyle()}/>
				</View>
			);
		} else {
			const trackingURL = this.getTrackingUrl(trackingNumber, shippingCarrier);
			return (
				<TouchableOpacity onPress={() => helpersWithLoadRequirements.openURL(trackingURL)}>
					<Text
						color="primary"
						weight="bold"
					>
						#{trackingNumber}
					</Text>
				</TouchableOpacity>
			);
		}
	};

	renderProgress = () => {
		const { deliveryDate, shippingCarrier, shippingStatus } = this.props.shippingTrackingDetails;
		let label = shippingCarrier;
		if (deliveryDate) {
			if (shippingStatus && shippingStatus.toLowerCase() === 'delivered') {
				label = `Delivered on ${deliveryDate}`;
			} else {
				label = `Estimated to arrive on ${deliveryDate}`;
			}
		}
		return (
			<View style={componentStyles.section}>
				<Text
					lineHeight={false}
					weight="bold"
					size="large"
				>
					{label}
				</Text>
				<View style={componentStyles.status}>
					<View style={componentStyles.progressWrapper}>
						{this.getProgressBar()}
						<Text
							style={componentStyles.statusText}
							size="small"
							capitalize="first"
							lineHeight={false}
						>
							{shippingStatus ? shippingStatus || 'Unknown' : 'Tracking unavailable for this item.'}
						</Text>
					</View>
					<TouchableOpacity
						style={componentStyles.detailsButton}
						onPress={() => {
							LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
							this.setState({
								showDetails: !this.state.showDetails,
							});
						}}
					>
						<Text lineHeight={false}>
							Details
						</Text>
						<Icon
							style={componentStyles.icon}
							name={`ios-arrow-${this.state.showDetails ? 'up' : 'down'}`}
							size={25}
							color={styles.colors.secondary}
						/>
					</TouchableOpacity>
				</View>
			</View>
		);
	};

	getProgressStyle = () => {
		if (this.state.progressPercent > 0) {
			const flex = this.state.progress.interpolate({
				inputRange: [0, 1],
				outputRange: [.05, this.state.progressPercent],
			});
			return {
				backgroundColor: styles.colors.primary,
				flex,
			};
		}
		if (this.state.progressPercent < 0) {
			return {
				backgroundColor: styles.colors.error,
				flex: 1,
			};
		}
	};

	getSpacerStyle = () => {
		if (this.state.progressPercent > 0) {
			const flex = this.state.progress.interpolate({
				inputRange: [0, 1],
				outputRange: [this.state.progressPercent, 1 - this.state.progressPercent],
			});
			return {
				flex,
			};
		}
	};

	getShimmerStyle = () => {
		const opacity = this.state.shimmer.interpolate({
			inputRange: [0, 0.5, 1],
			outputRange: [0, .25, 0],
		});
		return {
			flex: 1,
			backgroundColor: styles.colors.white,
			opacity,
		};
	};

	getWeight = () => {
		const { unitOfMeasurement, weight } = this.props.shippingTrackingDetails;
		if (0 < weight) {
			return `, ${weight} ${unitOfMeasurement.toLowerCase()}.`;
		}
	};

	renderActivityLocation = (event) => {
		if (event.location) {
			return <Text size="small">{event.location}</Text>;
		}
	};

	renderTrackingEvents = () => {
		const { shippingTrackingEvents } = this.props.shippingTrackingDetails;
		if (shippingTrackingEvents.length) {
			const events = shippingTrackingEvents.map((event, index) => {
				return (
					<View
						key={index}
						style={componentStyles.activityRow}
					>
						<Text
							size="small"
							weight="bold"
						>
							{event.date}, {event.time}
						</Text>
						{this.renderActivityLocation(event)}
						<Text size="small">{event.description}</Text>
					</View>

				);
			});
			return (
				<View style={componentStyles.section}>
					<Text
						lineHeight={false}
						weight="bold"
					>
						Activity:
					</Text>
					{events}
				</View>
			);
		}
	};

	getTrackingUrl = (trackingNumber, shippingCarrier) => {
		if (shippingCarrier.toLowerCase().includes('ups')) {
			return `https://wwwapps.ups.com/WebTracking/track?track=yes&trackNums=${trackingNumber}`;
		} else if (shippingCarrier.toLowerCase().includes('fedex')) {
			return `https://www.fedex.com/apps/fedextrack/?action=track&trackingnumber=${trackingNumber}&cntry_code=us`;
		}
	};

	renderTrackingNumber = () => {
		const { shippingCarrier, shippingStatus, trackingNumber } = this.props.shippingTrackingDetails;
		let trackingNumberText;
		const trackingURL = this.getTrackingUrl(trackingNumber, shippingCarrier);
		if (trackingURL) {
			trackingNumberText = (
				<TouchableOpacity onPress={() => helpersWithLoadRequirements.openURL(trackingURL)}>
					<Text color="primary">#{trackingNumber}</Text>
				</TouchableOpacity>
			);
		} else {
			trackingNumberText = <Text>#{trackingNumber}</Text>;
		}
		if (shippingStatus) {
			return (
				<View style={componentStyles.section}>
					<Text
						weight="bold"
						lineHeight={false}
					>
						Tracking:
					</Text>
					{trackingNumberText}
					<Text>{shippingCarrier}{this.getWeight()}</Text>
				</View>
			);
		}
	};

	renderDetails = () => {
		const { shipTo } = this.props.shippingTrackingDetails;
		if (this.state.showDetails) {
			return (
				<View>
					{this.renderTrackingNumber()}
					<View style={componentStyles.section}>
						<Text
							lineHeight={false}
							weight="bold"
						>
							Shipping To:
						</Text>
						<Text>{shipTo.firstName} {shipTo.lastName}</Text>
						<Text>{shipTo.address}</Text>
						<Text>{shipTo.city}, {shipTo.state} {shipTo.country}</Text>
					</View>
					{this.renderTrackingEvents()}
				</View>
			);
		}
	};

	render() {
		return (
			<View>
				{this.renderProgress()}
				{this.renderDetails()}
			</View>
		);
	}

}

ShippingTrackingDetails.propTypes = {
	shippingTrackingDetails: PropTypes.object.isRequired,
	style: PropTypes.number,
};
