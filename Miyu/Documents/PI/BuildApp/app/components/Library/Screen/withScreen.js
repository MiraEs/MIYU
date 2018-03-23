import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	InteractionManager,
	View,
} from 'react-native';
import EventEmitter from '../../../lib/eventEmitter';
import styles from '../../../lib/styles';
import LoadingView from '../../../components/LoadingView';
import store from '../../../store/configStore';
import { trackState } from '../../../actions/AnalyticsActions';

function getDisplayName(WrappedComponent) {
	return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function withScreen(WrappedComponent, customStyle = {}) {

	class WithScreen extends Component {

		constructor(props) {
			super(props);
			this.hasBeenTracked = false;
			this.state = {
				hasFinishedInteractions: !props.loading,
			};
		}

		componentDidMount() {
			// in debug make sure to warn the engineer that the setScreenTrackingInformation method has not been set
			if (__DEV__ && !WrappedComponent.prototype.setScreenTrackingInformation) {
				console.error(`Could not find setScreenTrackingInformation method for component: ${WrappedComponent.name}`);
			}

			this.attemptTracking(this.props);

			InteractionManager.runAfterInteractions(() => {
				this.setState({
					hasFinishedInteractions: true,
				});
				if (this.props.usesRemoteData) {
					this.getData();
				}
			});

			EventEmitter.addListener('screenWillLoad', this.getData);
		}

		componentWillReceiveProps(nextProps) {
			this.attemptTracking(nextProps);
			this.attemptRefresh(nextProps);
		}

		shouldComponentUpdate(nextProps, nextState) {
			return nextState.hasFinishedInteractions;
		}

		componentWillUnmount() {
			EventEmitter.removeListener('screenWillLoad', this.getData);
		}

		warnEngineer = (trackingInfo) => {
			if (__DEV__) {
				console.error(`withScreen expected tracking information to be an object with a required property of name, but received ${JSON.stringify(trackingInfo)}`);
			}
		};

		/**
		 * Fetch the data needed from calling the getScreenData function in the wrapped component. Called after component
		 * mounts and finishes interactions.
		 */
		getData = () => {
			if (this.ref && typeof this.ref.getScreenData === 'function') {
				this.ref.getScreenData();
			}
		};

		/**
		 * Check if we need to do a refresh. Called when props are received.
		 * @param nextProps
		 */
		attemptRefresh = (nextProps) => {
			const { refresh } = nextProps;
			if (refresh && this.ref && typeof this.ref.getScreenData === 'function') {
				this.ref.getScreenData();
			}
		};

		/**
		 * Attempt to track a screen loaded based on the setScreenTrackingInformation function of the wrapped component.
		 * How this function works is that you implement a function named setScreenTrackingInformation in your screen level
		 * component and then wrap that component with the withScreen HOC. The setScreenTrackingInformation function should
		 * return an object with a required "name" prop which is the name of the state tracking event. It also optionally
		 * can have a "meta" prop which will contain meta data about the screen you would like to track. If you do not have
		 * all the necessary data to do tracking until the screen resolves some data from web services then you should return
		 * a function from the setScreenTrackingInformation function. That function that is returned from
		 * setScreenTrackingInformation will receive props every time componentWillReceiveProps is called in this HOC. From
		 * there you can check if you have the information you need to track every time that function runs and when it does
		 * you can return an object with a required "name" property and optional "meta" property. With both return types
		 * the data you provide in that object is only tracked once and the setScreenTrackingInformation function wont be
		 * called again while that component stays mounted.
		 * @param props
		 */
		attemptTracking = (props) => {
			if (!this.hasBeenTracked && this.ref && typeof this.ref.setScreenTrackingInformation === 'function') {
				const trackingInfo = this.ref.setScreenTrackingInformation(props);
				if (trackingInfo && trackingInfo.name) {
					store.dispatch(trackState(trackingInfo.name, trackingInfo.meta));
					this.hasBeenTracked = true;
				} else if (typeof trackingInfo === 'function') {
					const info = trackingInfo(props);
					if (info && info.name) {
						store.dispatch(trackState(info.name, info.meta));
						this.hasBeenTracked = true;
					} else if (info) {
						// when we get something back but it doesn't match what we expect...
						this.warnEngineer(info);
					}
				} else if (trackingInfo) {
					// when we get something back but it doesn't match what we expect...
					this.warnEngineer(trackingInfo);
				}
			}
		};

		setWrappedRef = (ref) => {
			if (ref) {
				this.ref = ref;
			}
		};

		/**
		 * Overlay a generic loading screen over the wrapped component
		 */
		renderLoadingOverlay = () => {
			if (!this.state.hasFinishedInteractions || this.props.loading) {
				return (
					<LoadingView
						backgroundColor={styles.colors.greyLight}
						overlay={true}
					/>
				);
			}
		};

		render() {
			return (
				<View style={[styles.elements.screenWithHeaderGreyLight, customStyle]}>
					<WrappedComponent
						{...this.props}
						ref={this.setWrappedRef}
					/>
					{this.renderLoadingOverlay()}
				</View>
			);
		}

	}

	WithScreen.displayName = `withScreen(${getDisplayName(WrappedComponent)})`;

	WithScreen.route = WrappedComponent.route;

	WithScreen.propTypes = {
		loading: PropTypes.bool,
		refresh: PropTypes.bool,
		usesRemoteData: PropTypes.bool,
	};

	WithScreen.defaultProps = {
		usesRemoteData: true,
	};

	return WithScreen;

}

export default withScreen;
