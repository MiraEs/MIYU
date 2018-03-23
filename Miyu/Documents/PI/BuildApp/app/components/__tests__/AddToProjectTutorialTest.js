'use strict';

jest.unmock('react-native');
jest.unmock('../../../app/components/AddToProjectTutorial');

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-deprecated-custom-components');
jest.mock('../../../app/lib/styles');
jest.mock('../../../app/lib/SimpleStoreHelpers', () => ({
	setAddToProjectTutorial: jest.fn(() => Promise.resolve()),
}));
jest.mock('../../../app/lib/eventEmitter', () => ({
	emit: jest.fn(),
}));
jest.mock('BuildLibrary');
jest.mock('BuildNative');

import AddToProjectTutorial from '../AddToProjectTutorial';
import SimpleStoreHelpers from '../../lib/SimpleStoreHelpers';
import EventEmitter from '../../lib/eventEmitter';
import React from 'react';
import renderer from 'react-test-renderer';

const defaultProps = {
	isLoggedIn: false,
	onPress: jest.fn(),
};

describe('AddToProjectTutorial component', () => {

	it('should render AddToProjectTutorial with required props', () => {
		const tree = renderer.create(<AddToProjectTutorial {...defaultProps} />);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('should render AddToProjectTutorial with isLoggedIn=true', () => {
		const props = {
			isLoggedIn: true,
			onPress: jest.fn(),
		};
		const tree = renderer.create(<AddToProjectTutorial {...props} />);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('should call hideTutorial', () => {
		const tree = renderer.create(<AddToProjectTutorial {...defaultProps} />);
		tree.getInstance().hideTutorial();
		expect(SimpleStoreHelpers.setAddToProjectTutorial).toHaveBeenCalledWith(true);
		expect(EventEmitter.emit).toHaveBeenCalledWith('hideScreenOverlay');
	});
});
