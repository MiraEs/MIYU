
import {
	createNavigationEnabledStore,
	NavigationReducer,
} from '@expo/ex-navigation';
import {
	applyMiddleware,
	createStore,
	combineReducers,
	compose,
} from 'redux';
import { AsyncStorage } from 'react-native';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers/index';
import {
	validatorMiddleware,
	validatorReducer,
} from '../validator';
import environment from '../lib/environment';
import checkoutValidators from '../reducers/validators/checkout';
import { persistStore, autoRehydrate } from 'redux-persist';
import createCompressor from 'redux-persist-transform-compress';

let middleware = [thunkMiddleware, validatorMiddleware(checkoutValidators)];

if (__DEV__ && environment.reduxLogger) {
	middleware = [
		...middleware,
		createLogger(),
	];
}

const createStoreWithMiddleware = compose(
	applyMiddleware(...middleware),
	autoRehydrate(),
)(createStore);

const createStoreWithNavigation = createNavigationEnabledStore({
	createStore: createStoreWithMiddleware,
	navigationStateKey: 'navigation',
});

const store = createStoreWithNavigation(
	combineReducers({
		navigation: NavigationReducer,
		validator: validatorReducer,
		...rootReducer,
	})
);

if (module.hot) {
	module.hot.accept(() => {
		const nextRootReducer = require('../reducers/index').default;
		store.replaceReducer(nextRootReducer);
	});
}

const compressor = createCompressor();

// before you whitelist a reducer to persist it,
// any actions fired before rehydration will be lost.
// if your reducer will receive actions at app start up,
// look into an Action buffer
// https://github.com/rt2zz/redux-persist/blob/master/README.md#action-buffer
persistStore(store, {
	whitelist: ['HistoryReducer'],
	storage: AsyncStorage,
	transforms: [compressor],
});

export default store;
