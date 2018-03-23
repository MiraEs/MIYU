'use strict';
jest.unmock('../../../app/lib/bugsnag');

describe('app/lib/bugsnag.js', () => {
	describe('bugsnag should work', () => {
		it('should initialilze bugsnag in beta', () => {
			jest.mock('BuildNative', () => ({
				Device: {
					isBeta: () => true,
					isRelease: () => false,
					isTest: () => false,
				},
			}));
			const bugsnag = require('../bugsnag');

			expect(bugsnag).toMatchSnapshot();

		});
		it('should initialilze bugsnag in release', () => {
			jest.mock('BuildNative', () => ({
				Device: {
					isBeta: () => false,
					isRelease: () => true,
					isTest: () => false,
				},
			}));
			const bugsnag = require('../bugsnag');

			expect(bugsnag).toMatchSnapshot();

		});
		it('should initialilze bugsnag in debug', () => {
			jest.mock('BuildNative', () => ({
				Device: {
					isBeta: () => false,
					isRelease: () => false,
					isTest: () => false,
				},
			}));
			const bugsnag = require('../bugsnag');

			expect(bugsnag).toMatchSnapshot();

		});
	});


});
