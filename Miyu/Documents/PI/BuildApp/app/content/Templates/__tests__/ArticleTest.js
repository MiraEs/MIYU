
jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.mock('../../../../app/content/Atoms/AtomText@1', () => 'AtomText@1');
jest.mock('../../../../app/services/httpClient', () => 'httpClient');
jest.mock('react-native-parallax-scroll-view');

jest.unmock('react-native');

import { Article } from '../Article';
import React from 'react';

const defaultProps = {
	contentItem: {
		content: {},
	},
};

describe('Article template', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<Article {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
