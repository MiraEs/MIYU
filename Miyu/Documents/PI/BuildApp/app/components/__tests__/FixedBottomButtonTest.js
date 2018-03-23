jest.unmock('react-native');
jest.mock('BuildNative');
jest.mock('../../../app/services/httpClient', () => ({}));

import 'react-native';
import React from 'react';
import FixedBottomButton from '../FixedBottomButton';
import renderer from 'react-test-renderer';

const defaultProps = {
	buttonText: 'test button',
	onPress: jest.fn(),
	trackAction: 'test',
	accessibilityLabel: 'test button',
};

describe('FixedBottomButton component', () => {

	it('should render correctly', () => {
		const tree = renderer.create(<FixedBottomButton {...defaultProps} />);
		expect(tree.toJSON()).toMatchSnapshot();
	});

});
