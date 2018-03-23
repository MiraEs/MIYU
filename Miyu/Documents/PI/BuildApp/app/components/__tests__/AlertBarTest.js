
jest.unmock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');

import 'react-native';
import React from 'react';
import AlertBar from '../AlertBar';

const defaultProps = {};

describe('AlertBar', () => {

	it('should render with default props', () => {
		const tree = require('react-test-renderer').create(
			<AlertBar {...defaultProps} />
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('should show an alert', () => {
		const wrapper = require('react-test-renderer').create(
			<AlertBar {...defaultProps} />
		);
		const playAlertsSpy = spyOn(wrapper.getInstance(), 'playAlerts');
		wrapper.getInstance().showAlert('message');
		expect(playAlertsSpy).toBeCalled();
		const { alertQueue } = wrapper.getInstance();
		expect(alertQueue).toEqual([{
			message: 'message',
			type: 'success',
			button: null,
			bannerVisibleTimeout: 3000,
		}]);
	});

	it('should play alerts', () => {
		const wrapper = require('react-test-renderer').create(
			<AlertBar {...defaultProps} />
		);
		const instance = wrapper.getInstance();
		const callbackQueueSpy = jest.fn();
		instance.alertCallbackQueue.push(callbackQueueSpy);
		instance.playAlerts();
		expect(callbackQueueSpy).toBeCalled();
		expect(instance.playingAlerts).toEqual(false);
		instance.alertQueue.push({
			message: 'message',
			type: 'warning',
			button: null,
			bannerVisibleTimeout: 2,
		});
		const fadeInDownSpy = spyOn(instance, 'fadeInDown');
		instance.playAlerts();
		expect(instance.playingAlerts).toEqual(true);
		expect(fadeInDownSpy).toBeCalledWith('message', 'warning', null, instance.playAlerts, 2);
	});

	it('should render with isMessageVisible set to false', () => {
		const wrapper = require('react-test-renderer').create(
			<AlertBar {...defaultProps} />
		);
		wrapper.getInstance().setState({
			isMessageVisible: true,
		});
		expect(wrapper.toJSON()).toMatchSnapshot();
	});

	it('should handle fadeInDown', () => {
		const wrapper = require('react-test-renderer').create(
			<AlertBar {...defaultProps} />
		);
		const callbackSpy = jest.fn();
		const fadeOutUpSpy = spyOn(wrapper.getInstance(), 'fadeOutUp');
		wrapper.getInstance().fadeInDown('message', 'error', callbackSpy, 500);
		expect(fadeOutUpSpy).not.toBeCalled();
	});

});
