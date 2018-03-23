jest.unmock('react-native');
jest.mock('react-native-star-rating', () => 'StarRating');
jest.mock('../../../lib/styles');
jest.mock('BuildLibrary');
jest.mock('../../../lib/helpers', () => ({
	noop: jest.fn(),
}));

import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import ProductReview from '../ProductReview';

const props = {
	rating: 4,
	ratingRange: 5,
	title: 'title',
	reviewText: 'text',
	nickName: 'nickname',
	date: 'date string',
	syndicationSource: {
		imageUrl: '/image/url',
		name: 'syndication name',
	},
};

describe('ProductReview', () => {
	it('should render', () => {
		const wrapper = create(<ProductReview {...props} />).toJSON();
		expect(wrapper).toMatchSnapshot();
	});
	it('should render with no syndication source', () => {
		const newProps = {...props};
		delete newProps.syndicationSource;
		const wrapper = create(<ProductReview {...newProps} />).toJSON();
		expect(wrapper).toMatchSnapshot();
	});
});
