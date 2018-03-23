'use strict';
import { createAction } from 'redux-actions';
import EventEmitter from '../lib/eventEmitter';

function showAlertAction(message, type, button, callback, bannerVisibleTimeout) {
	EventEmitter.emit('showScreenAlert', {
		message,
		type,
		button,
		callback,
		bannerVisibleTimeout,
	});
}

const showAlert = createAction('SHOW_ALERT_ACTION', showAlertAction);

module.exports = {
	showAlert,
};
