
jest.mock('../../InlineAlert', () => 'InlineAlert');
jest.mock('../../button', () => 'Button');
jest.mock('../../../lib/styles');
jest.mock('../../../lib/analytics/TrackingActions', () => ({}));
jest.mock('../../../lib/ProductConfigurationHelpers');
jest.mock('BuildNative');
jest.mock('pluralize');
jest.mock('react-redux');
jest.mock('../../../services/httpClient', () => ({}));

jest.unmock('react-native');

import React from 'react';
import 'react-native';
import { ProductRestrictions } from '../ProductRestrictions';
import renderer from 'react-test-renderer';

const fullProps = {
	application: 'application',
	restrictions: [{
		policyDescription: 'ab1953',
		locales: [{
			stateCode: 'CA',
		}],
	}],
	navigator: {
		push: jest.fn(),
	},
};

describe('ProductRestrictions', () => {

	it('should render with full props', () => {
		const wrapper = renderer.create(
			<ProductRestrictions {...fullProps} />
		);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});

	it('should handle navigateToSearch', () => {
		const wrapper = renderer.create(
			<ProductRestrictions {...fullProps} />
		);
		wrapper.getInstance().navigateToSearch();
		expect(fullProps.navigator.push).toBeCalledWith('productDrops', {
			searchCriteria: {
				keyword: 'application',
				page: 1,
				pageSize: 50,
			},
			tracking: {
				name: 'build:app:productrestrictions:searchresults',
				data: {
					keyword: 'application',
				},
			},
		});
	});

});
