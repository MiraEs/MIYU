jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-native');
jest.mock('../../../lib/eventEmitter', () => ({
	emit: jest.fn(),
}));

import StoreCreditModal from '../StoreCreditModal';
import React from 'react';
import renderer from 'react-test-renderer';
import eventEmitter from '../../../lib/eventEmitter';

describe('StoreCreditModal component', () => {
	it('should render', () => {
		const tree = renderer.create(
			<StoreCreditModal />
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('should emit', () => {
		const tree = renderer.create(
			<StoreCreditModal />
		);
		tree.getInstance().dismiss();
		expect(eventEmitter.emit).toBeCalledWith('hideScreenOverlay');
	});
});
