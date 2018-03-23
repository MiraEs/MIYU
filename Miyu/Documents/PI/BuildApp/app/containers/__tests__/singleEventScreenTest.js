
jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('redux');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('../../../app/content/Atoms/AtomText@1', () => 'AtomText');
jest.mock('../../../app/router', () => ({}));

jest.unmock('react-native');
import 'react-native';
import React from 'react';
import { SingleEventScreen } from '../SingleEventScreen';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
		getEvent: jest.fn(),
	},
	customerId: 0,
	error: '',
	event: {},
	eventId: 0,
	isLoading: false,
};

describe('The SingleEventScreen', () => {

	it('should render with default props', () => {
		const tree = require('react-test-renderer').create(
			<SingleEventScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a LoadingView', () => {
		const tree = require('react-test-renderer').create(
			<SingleEventScreen
				{...defaultProps}
				isLoading={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a LoadError', () => {
		const tree = require('react-test-renderer').create(
			<SingleEventScreen
				{...defaultProps}
				error="error"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
