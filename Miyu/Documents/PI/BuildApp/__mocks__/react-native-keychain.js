'use strict';

module.exports = {
	resetInternetCredentials: jest.fn(),
	getInternetCredentials: jest.fn(() => {
		return new Promise((resolve) => resolve());
	}),
	setInternetCredentials: jest.fn(),
};
