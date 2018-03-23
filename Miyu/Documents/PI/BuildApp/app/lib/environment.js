import { Platform } from 'react-native';
import { AdjustConfig } from 'react-native-adjust';
import { Device } from 'BuildNative';

const environment = {
	api: {
		url: 'https://api.build.com',
		basicAuthToken: 'YnVpbGRfY2xpZW50OjEyMzQ1Ng==',
		anonymousKey: ']k;7_W&.fm5c(vV3',
	},
	host: 'http://www.build.com',
	secureHost: 'https://www.build.com',
	keychainDomain: 'www.build.com',
	manufacturerCallToActionPhone: '5309619574',
	phone: '8004828960',
	proSupportPhone: '8004714956',
	apnsPlatform: Platform.OS === 'ios' ? 'APNS' : 'GCM',
	hockeyAppId: '6a507cf31c194d7587d9efebbac0ecb5',
	gcmSenderId: '996673081628',
	paypalDomain: 'www.build.com',
	lookbackioId: 'NdtpcMBmoLCAWspSQ',
	adjustAppToken: 'nmxf9s2d6a68',
	adjustEnvironment: AdjustConfig.EnvironmentProduction,
	bugsnag: '83a6702d6c3da98e5d2fa2d727f2f2d8',
	homeRoute: '/native-home',
	bazaarVoice: {
		url: 'api.bazaarvoice.com/data/reviews.json?apiversion=5.4',
		apiKey: 'caQhv5n6wqQjf6ycCrxy8ETsxI7Bg2Q6SxVmbfZBPEtS4',
	},
	paymentGateway: {
		url: 'https://payments.build.com/creditcard/tokenize',
	},
	reduxLogger: false,
	applePay: {
		merchantIdentifier: 'merchant.com.build.buildapp-prod',
	},
};

if (__DEV__) { // NOSONAR
	environment.api.url = 'http://dev-api.build.com'; // NOSONAR
	environment.host = 'http://localhost:3000'; // NOSONAR
	environment.secureHost = 'http://localhost:3000'; // NOSONAR
	environment.gcmSenderId = '61278265908'; // NOSONAR
	environment.apnsPlatform = Platform.OS === 'ios' ? 'APNS_SANDBOX' : 'GCM_SANDBOX'; // NOSONAR
	environment.paypalDomain = 'sandbox.build.com'; // NOSONAR
	environment.adjustEnvironment = AdjustConfig.EnvironmentSandbox; // NOSONAR
	environment.bazaarVoice = { // NOSONAR
		url: 'stg.api.bazaarvoice.com/data/reviews.json?apiversion=5.4', // NOSONAR
		apiKey: 'ca6daqRHJLQKWwtEDuBX47PgoqxW7nDQrAvlPbpmJcb9Q', // NOSONAR
	}; // NOSONAR
	environment.paymentGateway.url = 'http://paymentgateway-dev-1.build.internal:8080/creditcard/tokenize'; // NOSONAR
	environment.reduxLogger = true; // NOSONAR
} // NOSONAR

if (Device.isTest()) {
	environment.api.url = 'https://test-api.build.com';
	environment.paymentGateway.url = 'https://test-payments.build.com/creditcard/tokenize';
}

module.exports = environment;
