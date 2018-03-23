jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-native');

import ReturnPolicyLink from '../ReturnPolicyLink';
import React from 'react';
import renderer from 'react-test-renderer';

describe('ReturnPolicyLink component', () => {
	it('it should render', () => {
		const tree = renderer.create(
			<ReturnPolicyLink />
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});
});
