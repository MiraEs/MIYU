// the Polyfill must be imported first so that functions
// can be polyfilled before the libraries are imported
import 'react-native-polyfill';

import React, { Component } from 'react';
import { Provider } from 'react-redux';

// Disable font scaling app-wide until we decide to honor it
import { Text } from 'react-native';
Text.defaultProps.allowFontScaling = false;

import {
	NavigationProvider,
	NavigationContext,
} from '@expo/ex-navigation';
import Index from './containers/index';
import router from './router';
import store from './store/configStore';
import environment from './lib/environment';
import { Adjust, AdjustConfig } from 'react-native-adjust';

const navigationContext = new NavigationContext({
	router,
	store,
});

class Root extends Component {

	componentDidMount() {
		const adjustConfig = new AdjustConfig(environment.adjustAppToken, environment.adjustEnvironment);
		Adjust.create(adjustConfig);
	}

	render () {
		return (
			<Provider store={store}>
				<NavigationProvider context={navigationContext}>
					<Index />
				</NavigationProvider>
			</Provider>
		);
	}
}

export default Root;
