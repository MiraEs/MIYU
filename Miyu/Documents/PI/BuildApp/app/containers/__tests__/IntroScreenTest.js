'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Tutorial', () => 'Tutorial');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('../../../app/components/Library/Pager/Pager', () => 'Pager');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

jest.unmock('react-native');

import { IntroScreen } from '../IntroScreen';
import React from 'react';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
	},
};

describe('IntroScreen component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<IntroScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
