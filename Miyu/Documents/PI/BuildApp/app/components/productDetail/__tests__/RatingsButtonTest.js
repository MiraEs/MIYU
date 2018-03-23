
jest.mock('BuildNative');
jest.mock('build-library');
jest.mock('react-native-star-rating');
jest.mock('../../TappableListItem', () => 'TappableListItem');
jest.mock('../../../services/httpClient', () => ({}));
jest.mock('../../../lib/helpers', () => ({}));
jest.mock('../../../lib/styles');
jest.mock('../../../store/configStore', () => ({}));
import React from 'react';
jest.unmock('react-native');
import 'react-native';
import renderer from 'react-test-renderer';

import { RatingsButton } from '../RatingsButton';

const fullProps = {
	reviewRating: {
		numReviews: 23,
	},
	onPress: jest.fn(),
};

describe('RatingsButton', () => {
	it('should render with full props', () => {
		const wrapper = renderer.create(<RatingsButton {...fullProps} />);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should render null with no reviewRatings', () => {
		const wrapper = renderer.create(<RatingsButton reviewRating={{}} />);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
});
