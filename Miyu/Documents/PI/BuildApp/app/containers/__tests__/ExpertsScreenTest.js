
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('../../../app/components/ExpertBio', () => 'ExpertBio');
jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('redux', () => ({
	bindActionCreators: jest.fn(),
}));
jest.mock('moment', () => jest.fn(() => ({
	isDST: jest.fn(() => true),
})));

jest.unmock('react-native');
import 'react-native';
import React from 'react';
import { ExpertsScreen } from '../ExpertsScreen';

const defaultProps = {
	error: '',
	customerId: 1,
	actions: {
		getCustomerRep: jest.fn(),
		trackState: jest.fn(),
	},
	customer: {},
};

describe('ExpertsScreen Container', () => {

	it('should render a Screen', () => {
		const tree = require('react-test-renderer').create(
			<ExpertsScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a pros expert', () => {
		const props = {
			...defaultProps,
			isLoggedIn: true,
			customer: {
				rep: {
					repUserID: 1234,
					repFirstName: 'Derf',
					repLastName: 'Nabac',
					repWorkPhone: 1234,
				},
				isPro: true,
			},
		};
		const tree = require('react-test-renderer').create(
			<ExpertsScreen {...props} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render an un-owned pro', () => {
		const props = {
			...defaultProps,
			isLoggedIn: true,
			customer: {
				isPro: true,
			},
		};
		const tree = require('react-test-renderer').create(
			<ExpertsScreen {...props} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
