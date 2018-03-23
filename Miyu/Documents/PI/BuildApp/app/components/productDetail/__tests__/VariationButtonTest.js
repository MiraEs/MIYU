
jest.mock('build-library');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('../../../lib/analytics/TrackingActions', () => ({}));
jest.mock('../../../lib/ProductConfigurationHelpers', () => ({}));
jest.mock('../../../lib/styles');

import React from 'react';
jest.unmock('react-native');
import 'react-native';
import renderer from 'react-test-renderer';

import { VariationButton } from '../VariationButton';

const fullProps = {
	variations: [{
		variationProducts: [{
			currentVariation: true,
			variationName: 'variation name',
		}],
		name: 'variation type',
	}],
	selectedFinish: {
		finish: 'finish name',
	},
	onPress: jest.fn(),
};

describe('VariationButton', () => {
	it('should render with full props', () => {
		const wrapper = renderer.create(<VariationButton {...fullProps} />);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should render null with no variations', () => {
		const wrapper = renderer.create(<VariationButton />);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
});
