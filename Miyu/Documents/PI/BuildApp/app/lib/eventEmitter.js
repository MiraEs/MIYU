'use strict';
import {EventEmitter as eventEmitter} from 'events';

let instance = null;

class EventEmitter {
	constructor() {
		if (!instance) {
			instance = new eventEmitter();
		}
		return instance;
	}
}

module.exports = new EventEmitter;
