'use strict';

jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-redux');
jest.mock('redux');
jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/helpers');
jest.mock('../../../app/lib/SimpleStoreHelpers');
jest.mock('../../../app/lib/eventEmitter');

jest.unmock('react-native');

import { AddToProjectModal } from '../AddToProjectModal';
import React from 'react';
import EventEmitter from '../../../app/lib/eventEmitter';

const defaultProps = {
	projects: [],
	navigator: {
		pop: jest.fn(),
		updateCurrentRouteParams: jest.fn(),
	},
};

describe('AddToProjectModal component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<AddToProjectModal {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	describe('onDoneButtonPress', () => {
		it('should call EventEmitter.emit', () => {
			const tree = require('react-test-renderer').create(
				<AddToProjectModal {...defaultProps} />
			);
			tree.getInstance().onDoneButtonPress();
			expect(EventEmitter.emit).toHaveBeenCalled();
		});
	});
});
