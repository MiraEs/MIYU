
import Instabug from '../lib/Instabug';
import deepLinking from '../router/DeepLinking';
import { NavigationActions } from '@expo/ex-navigation';
import { trackAction } from './AnalyticsActions';
import url from 'url';
import trackingActions from '../lib/analytics/TrackingActions';
import environment from '../lib/environment';
import { InteractionManager } from 'react-native';

let isBranchSubscribeEnabled = true;

function routeToTab(dispatch, location) {
	const { pageRoute } = location.route.params;
	if (pageRoute && pageRoute === environment.homeRoute) {
		dispatch(NavigationActions.popToTop('home'));
		InteractionManager.runAfterInteractions(() => {
			dispatch(NavigationActions.updateCurrentRouteParams(location.tabName, location.route.params));
		});
	} else {
		dispatch(NavigationActions.push(location.tabName, location.route));
	}
}

/**
 * Get's the parsed URI's path, attempts to match it to a location (tab and route) in the app,
 * and if it finds a match attempts to push to that location.
 * @param uri
 * @param dispatch
 * @param getState
 * @param count
 */
function attemptToRouteToURI(uri, dispatch, getState, count = 0) {
	const location = deepLinking.getAppLocationByURI(uri);
	if (location && location.route) {
		try {
			const { navigators } = getState().navigation;
			if (navigators && navigators.root && navigators.main) {
				dispatch(NavigationActions.popToTop('root'));
				dispatch(NavigationActions.jumpToTab('main', {
					key: location.tabName,
				}));
			}
			if (navigators[location.tabName]) {
				routeToTab(dispatch, location);
			} else if (count < 10) {
				// we set this timeout so that the StackNavigation instances are
				// initialized in each of the tabs in the case that we launch the app
				// fresh from a link.
				// This is just a retry.
				setTimeout(() => attemptToRouteToURI(uri, dispatch, getState, (count + 1)), 100);
			}
		} catch (error) {
			Instabug.log(`Failed to route to URI: ${uri}`);
		}
	}
	const parsedURI = url.parse(uri, true);
	if (parsedURI && parsedURI.query && parsedURI.query.sab && parsedURI.query.sab === '1') {
		dispatch(trackAction(trackingActions.DEEPLINKING_SMART_APP_BANNER, {
			uri,
		}));
	}
}

const deepLinkingActions = {

	getStandardUrlPath(uri) {
		// we have to check for the applink variation because the url.parse function cannot parse them correctly
		if (uri.toLowerCase().indexOf('buildapp://') === 0) {
			uri = uri.replace('buildapp://', '/');
		}
		return url.parse(uri).path;
	},

	/**
	* Handle general links
	*/
	handleLink(uri) {
		return (dispatch, getState) => {
			dispatch(trackAction(trackingActions.DEEPLINKING_ROUTE_FROM_URI, {
				uri,
			}));
			uri = deepLinkingActions.getStandardUrlPath(uri);
			attemptToRouteToURI(uri, dispatch, getState);
		};
	},

	/**
	* Handle links from Branch.io's subscribe function.
	*/
	handleBranchLink(payload) {
		return (dispatch, getState) => {
			const uri = deepLinking.getURIFromBranchPayload(payload);
			if (payload && !payload.error && uri && isBranchSubscribeEnabled) {
				dispatch(trackAction(trackingActions.DEEPLINKING_ROUTE_FROM_URI, {
					uri,
				}));

				// We have to do this garbage because on Android when the app is launched
				// fresh from a Branch.io link this function gets run twice for the same
				// URL.
				// https://github.com/BranchMetrics/react-native-branch-deep-linking/issues/79
				//
				// start garbage
				isBranchSubscribeEnabled = false;
				setTimeout(() => isBranchSubscribeEnabled = true, 1000);
				// end garbage

				attemptToRouteToURI(url.parse(uri).path, dispatch, getState);
			}
		};
	},
};

module.exports = deepLinkingActions;
