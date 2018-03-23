'use strict';

jest.unmock('../ScrollableHelpers');
jest.mock('react-native');
jest.mock('../styles');

import ScrollableHelpers from '../ScrollableHelpers';

describe('ScrollableHelpers', () => {

	describe('scrollRefToKeyboard', () => {
		const scrollResponder = {
			scrollResponderScrollNativeHandleToKeyboard: jest.fn(),
		};

		it('should call with the default params', () => {
			ScrollableHelpers.scrollRefToKeyboard(
				scrollResponder,
				'test',
				{},
			);
			expect(scrollResponder.scrollResponderScrollNativeHandleToKeyboard)
				.toBeCalledWith(
					undefined,
					67,
					true,
				);
		});

		it('should call with the default params', () => {
			ScrollableHelpers.scrollRefToKeyboard(
				scrollResponder,
				'test',
				{ offset: 1 },
			);
			expect(scrollResponder.scrollResponderScrollNativeHandleToKeyboard)
				.toBeCalledWith(
					undefined,
					1,
					true,
				);
		});
	});
});
