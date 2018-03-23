jest.mock('react-native');
jest.mock('../../../lib/styles');
jest.mock('../../Library/Pager/Pager', () => 'Pager');
jest.mock('../../Video', () => 'Video');
jest.mock('BuildLibrary');
jest.mock('../../../actions/AnalyticsActions', () => ({
	trackState: jest.fn(),
}));
jest.mock('../../../store/configStore', () => ({
	dispatch: jest.fn(),
}));

import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import ProductVideos from '../ProductVideos';

const props = {
	videos: [{
		videoId: 123,
		hashKey: 'hashkey',
		streamProviderCode: 456,
		title: 'title',
		description: 'description',
		screenshotId: 789,
	}],
};

describe('ProductVideos', () => {
	it('should render', () => {
		const wrapper = create(<ProductVideos {...props} />).toJSON();
		expect(wrapper).toMatchSnapshot();
	});
	it('should handle page changed', () => {
		const wrapper = create(<ProductVideos {...props} />);
		const instance = wrapper.getInstance();
		instance.onPageChanged(1, 2);
		instance.webview2 = { reload: jest.fn() };
		expect(instance.webview2.reload).not.toBeCalled();
	});
});
