
jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('BuildNative');
jest.unmock('react-native');
import 'react-native';
import React from 'react';
import { ImageGallery } from '../ImageGallery';

const defaultProps = {
	images: [{uri: 'test'}],
	title: 'test',
	currentIndex: 0,
	compositeId: 12345,
};

describe('ImageGallery Container', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<ImageGallery {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
