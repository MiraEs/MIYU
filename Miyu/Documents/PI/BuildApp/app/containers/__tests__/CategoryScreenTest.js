
jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('../../../app/content/Atoms/AtomText@1', () => 'AtomText@1');
jest.mock('../../../app/router', () => ({}));

jest.unmock('react-native');

import { CategoryScreen } from '../CategoryScreen';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
	},
};

describe('CategoryScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<CategoryScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
