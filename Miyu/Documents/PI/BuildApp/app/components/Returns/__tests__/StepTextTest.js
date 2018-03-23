jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-native');

import StepText from '../StepText';
import React from 'react';
import renderer from 'react-test-renderer';

const defaultProps = {
	currentStep: 1,
	maxStep: 3,
};

describe('StepText component', () => {
	it('it should render', () => {
		const tree = renderer.create(
			<StepText {...defaultProps} />
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});
});
