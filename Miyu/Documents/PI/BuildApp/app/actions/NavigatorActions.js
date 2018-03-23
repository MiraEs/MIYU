import { createAction } from 'redux-actions';
import { NavigationActions } from '@expo/ex-navigation';
import store from '../store/configStore';

const navigatorPop = createAction('NAVIGATION_POP', (navUID) => {
	store.dispatch(NavigationActions.pop(navUID));
});

const navigatorPush = createAction('NAVIGATION_PUSH', (route, navUID) => {
	store.dispatch(NavigationActions.push(navUID, route));
});

const navigatorPopToTop = createAction('NAVIGATION_POP_TO_TOP', (navUID) => {
	store.dispatch(NavigationActions.popToTop(navUID));
});

const navigatorReplace = createAction('NAVIGATION_REPLACE', (route, navUID) => {
	store.dispatch(NavigationActions.replace(navUID, route));
});

const navigatorPopToRoute = createAction('NAVIGATOR_POP_TO_ROUTE', (routeName, navUID) => {
	let matchingIndex = 0;
	const currentRoutes = store.getState().navigation.navigators[navUID].routes;
	const matchingRoute = currentRoutes.find((route, index) => {
		if (route.routeName === routeName) {
			matchingIndex = index;
			return true;
		}
		return false;
	});
	if (matchingRoute) {
		store.dispatch(NavigationActions.popN(navUID, (currentRoutes.length - 1) - matchingIndex));
	}
});

module.exports = {
	navigatorPop,
	navigatorPush,
	navigatorReplace,
	navigatorPopToRoute,
	navigatorPopToTop,
};
