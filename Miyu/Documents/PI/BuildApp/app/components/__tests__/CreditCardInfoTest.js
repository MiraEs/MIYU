'use strict';

jest.mock('../../services/httpClient', () => ({}));
jest.mock('../../store/configStore', () => ({}));
jest.mock('../../lib/analytics/tracking');
jest.mock('../../lib/styles');
jest.mock('BuildNative');
jest.mock('BuildLibrary');

jest.unmock('react-native');

import CreditCardInfo from '../CreditCardInfo';
import React from 'react';

const defaultProps = {
	name: 'name',
	cardType: 'VISA',
	lastFour: '1234',
	expDate: 1496300400000,
};

describe('CreditCardInfo component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<CreditCardInfo {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with no name', () => {
		const tree = require('react-test-renderer').create(
			<CreditCardInfo
				{...defaultProps}
				name={undefined}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with no expDate', () => {
		const tree = require('react-test-renderer').create(
			<CreditCardInfo
				{...defaultProps}
				expDate={undefined}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should not render without a cardType', () => {
		const tree = require('react-test-renderer').create(
			<CreditCardInfo
				{...defaultProps}
				cardType={undefined}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should not render without a lastFour', () => {
		const tree = require('react-test-renderer').create(
			<CreditCardInfo
				{...defaultProps}
				lastFour={undefined}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
