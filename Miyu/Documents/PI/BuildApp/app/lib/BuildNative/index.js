/**
 * @providesModule BuildNative
 */
'use strict';
import Device from './Device';
import LinkingManager from './LinkingManager';

const BuildNative = {
	get Device() { return new Device(); },
	get LinkingManager() { return new LinkingManager(); },
};

module.exports = BuildNative;
