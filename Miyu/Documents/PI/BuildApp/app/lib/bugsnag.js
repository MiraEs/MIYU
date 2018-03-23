import {
	Client,
	Configuration,
} from 'bugsnag-react-native';
import environment from './environment';
import { Device } from 'BuildNative';

const configuration = new Configuration(environment.bugsnag);

//Bugsnag configuration

configuration.notifyReleaseStages = ['beta', 'production'];

if (Device.isBeta()) {
	configuration.releaseStage = 'beta';
}

if (Device.isRelease()) {
	configuration.releaseStage = 'production';
}

const bugsnag = new Client(configuration);

module.exports = bugsnag;
