import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EventEmitter from '../lib/eventEmitter';
import styles from '../lib/styles';
import {
	Image,
	Text,
} from 'BuildLibrary';
import helpers from '../lib/helpers';
import {
	MORE,
	HOME,
	LISTS,
} from '../constants/constants';
import eventsActions from '../actions/EventsActions';
import { withNavigation } from '@expo/ex-navigation';
import { setTutorialMode } from '../actions/LayoutActions';
import tracking from '../lib/analytics/tracking';
import TrackingActions from '../lib/analytics/TrackingActions';
import Icon from 'react-native-vector-icons/Ionicons';

const componentStyles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'relative',
	},
	skipButton: {
		alignItems: 'center',
		flexDirection: 'row',
		paddingTop: helpers.isIOS() ? styles.measurements.gridSpace4 : styles.measurements.gridSpace3,
		marginRight: styles.measurements.gridSpace2,
		alignSelf: 'flex-end',
	},
	offScreen: {
		position: 'absolute',
		bottom: -1000,
		left: 0,
	},
});

@withNavigation
export class Tutorial extends Component {

	constructor(props) {
		super(props);
		this.generator = this.tutorialGenerator();
		this.offset = helpers.isAndroid() ? 25 : 0;
		this.state = {
			tutorialItems: this.generator.next().value,
		};
	}

	componentWillMount() {
		this.props.actions.setTutorialMode(true);
	}

	*tutorialGenerator() {
		yield [{
			text: 'Shop the entire Build catalog',
			image: require('../images/arrows/arrow1/arrow1.png'),
			styles: () => {
				const { homeTab } = this.props;
				if (homeTab) {
					const bottom = homeTab.y + homeTab.height + this.offset;
					const left = homeTab.x + homeTab.width / 8;
					return {
						arrow: {
							position: 'absolute',
							bottom,
							left,
						},
						text: {
							position: 'absolute',
							bottom: bottom + 160,
							left: left + 66 + styles.measurements.gridSpace1,
							width: 180,
						},
					};
				}
			},
		}, {
			text: 'View your items in the cart and checkout with ease',
			textAlign: 'right',
			image: require('../images/arrows/arrow5/arrow5.png'),
			styles: () => {
				const { cartTab } = this.props;
				if (cartTab) {
					const bottom = cartTab.y + cartTab.height + this.offset;
					const right = cartTab.x;
					return {
						arrow: {
							position: 'absolute',
							bottom,
							right,
						},
						text: {
							position: 'absolute',
							bottom: bottom + 48,
							width: 150,
							left: styles.dimensions.width - right,
						},
					};
				}
			},
		}];
		yield [{
			text: 'Quickly find any product you\'re looking for',
			image: require('../images/arrows/arrow3/arrow3.png'),
			styles: () => {
				const top = helpers.isAndroid() ? 36 : 48;
				const left = 20;
				return {
					arrow: {
						position: 'absolute',
						top,
						left,
					},
					text: {
						position: 'absolute',
						top: top + 60,
						left: left + 29,
						width: 250,
					},
				};
			},
		}, {
			text: 'Get your questions answered by a Build Advisor',
			image: require('../images/arrows/arrow2/arrow2.png'),
			styles: () => {
				const { expertsTab } = this.props;
				if (expertsTab) {
					const bottom = expertsTab.y + expertsTab.height + this.offset;
					const right = expertsTab.x - expertsTab.width - 10;
					return {
						arrow: {
							position: 'absolute',
							right,
							bottom,
						},
						text: {
							position: 'absolute',
							width: 175,
							bottom: bottom + 60,
							right,
						},
					};
				}
			},
		}];
		this.props.navigation.performAction(({ tabs }) => tabs('main').jumpToTab(MORE));
		this.props.actions.triggerEvent('scrollAccountTabToTop');
		yield [{
			text: 'View or edit your account details',
			image: require('../images/arrows/arrow5/arrow5.png'),
			styles: () => {
				const { accountDetailsButton } = this.props;
				if (accountDetailsButton) {
					const top = accountDetailsButton.pageY - 60;
					const left = accountDetailsButton.pageX + 30;
					return {
						arrow: {
							position: 'absolute',
							left,
							top,
						},
						text: {
							position: 'absolute',
							width: 250,
							left: left + 35,
							top: top - 20,
						},
					};
				}
			},
		}, {
			text: 'Follow your orders for status changes and shipping updates',
			image: require('../images/arrows/arrow6/arrow6.png'),
			styles: () => {
				const { ordersButton } = this.props;
				if (ordersButton) {
					const top = ordersButton.pageY + 40;
					const left = ordersButton.pageX + 50;
					return {
						arrow: {
							position: 'absolute',
							left,
							top,
						},
						text: {
							position: 'absolute',
							width: 190,
							left: left + 74,
							top: top + 10,
						},
					};
				}
			},
		}];
		this.props.navigation.performAction(({ tabs }) => tabs('main').jumpToTab(LISTS));
		this.props.actions.triggerEvent('scrollListOverviewToTop');
		yield [{
			text: 'Create and manage your Build projects',
			image: require('../images/arrows/arrow6/arrow6.png'),
			styles: () => {
				const { projectsButton } = this.props;
				if (projectsButton) {
					const top = projectsButton.pageY + 50;
					const left = projectsButton.pageX + 30;
					return {
						arrow: {
							position: 'absolute',
							left,
							top,
						},
						text: {
							position: 'absolute',
							width: 220,
							left: left + 72,
							top: top + 35,
						},
					};
				}
			},
		}, {
			text: 'View all of your favorited products',
			image: require('../images/arrows/arrow8/arrow8.png'),
			styles: () => {
				const { favoritesButton } = this.props;
				if (favoritesButton) {
					const top = favoritesButton.pageY + 50;
					const left = favoritesButton.pageX + 50;
					return {
						arrow: {
							position: 'absolute',
							left,
							top,
						},
						text: {
							position: 'absolute',
							width: 190,
							left: left + 65,
							top: top + 35,
						},
					};
				}
			},
		}];
		this.finishTutorial();
	}

	finishTutorial = () => {
		this.props.actions.setTutorialMode(false);
		EventEmitter.emit('hideScreenOverlay', { clearComponent: true });
		this.props.navigation.performAction(({ tabs }) => tabs('main').jumpToTab(HOME));
	};

	renderTutorialItems = () => {
		const items = [];
		this.state.tutorialItems.forEach((item, index) => {
			const styles = item.styles();
			items.push(
				<Text
					key={`text_${index}`}
					style={styles ? styles.text : componentStyles.offScreen}
					lineHeight={false}
					weight="bold"
					color="white"
					textAlign={item.textAlign || 'left'}
				>
					{item.text}
				</Text>
			);
			items.push(
				<Image
					key={`arrow_${index}`}
					style={styles ? styles.arrow : componentStyles.offScreen}
					source={item.image}
				/>,
			);
		});
		return items;
	};

	render() {
		if (!this.state.tutorialItems) {
			return null;
		}
		return (
			<TouchableWithoutFeedback
				style={componentStyles.container}
				onPress={() => {
					this.setState({
						tutorialItems: this.generator.next().value,
					});
				}}
			>
				<View style={componentStyles.container}>
					<TouchableWithoutFeedback
						onPress={() => {
							tracking.trackAction(TrackingActions.ONBOARDING_SKIP_TUTORIAL);
							this.finishTutorial();
						}}
					>
						<View style={componentStyles.skipButton}>
							<Text
								lineHeight={false}
								color="white"
							>Skip </Text>
							<Icon
								size={18}
								name="ios-arrow-forward"
								color="white"
							/>
						</View>
					</TouchableWithoutFeedback>
					{this.renderTutorialItems()}
				</View>
			</TouchableWithoutFeedback>
		);
	}

}

Tutorial.propTypes = {
	actions: PropTypes.object.isRequired,
	cartTab: PropTypes.object,
	homeTab: PropTypes.object,
	searchIcon: PropTypes.object,
	expertsTab: PropTypes.object,
	accountDetailsButton: PropTypes.object,
	ordersButton: PropTypes.object,
	projectsButton: PropTypes.object,
	favoritesButton: PropTypes.object,
	isLoggedIn: PropTypes.bool,
	navigation: PropTypes.shape({
		performAction: PropTypes.func,
	}),
};

const mapStateToProps = (state) => {
	return {
		cartTab: state.layoutReducer.CART_TAB,
		homeTab: state.layoutReducer.HOME_TAB,
		expertsTab: state.layoutReducer.EXPERTS_TAB,
		accountDetailsButton: state.layoutReducer.ACCOUNT_DETAILS_BUTTON,
		ordersButton: state.layoutReducer.ORDERS_BUTTON,
		projectsButton: state.layoutReducer.PROJECTS_BUTTON,
		favoritesButton: state.layoutReducer.FAVORITES_BUTTON,
		isLoggedIn: state.userReducer.isLoggedIn,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			setTutorialMode,
			triggerEvent: eventsActions.triggerEvent,
		}, dispatch),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Tutorial);
