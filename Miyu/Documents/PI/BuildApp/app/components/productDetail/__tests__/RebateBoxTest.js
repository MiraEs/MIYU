jest.unmock('react-native');
jest.mock('../../../services/httpClient', () => ({}));
jest.mock('../../../lib/styles');
import 'react-native';
import React from 'react';
import RebateBox from '../RebateBox';

jest.mock('BuildLibrary');
jest.mock('BuildNative');

const oneRebate = {
	rebates: [{
		title: 'Test Sale',
		description: 'Test sale details.',
		active: true,
	}],
};
const manyRebates = {
	rebates: [{
		rebateId: 32,
		startDate: 1360828800000,
		endDate: 1364367600000,
		sendByDate: 1366873200000,
		link: 'http://products.geappliances.com/MarketingObjectRetrieval/Dispatcher?RequestType=PDF&Name=72807_q1_abd_cafe_rebate.pdf',
		linkText: 'Get up $500 back with select GE Cafe items!',
	}, {
		rebateId: 52,
		startDate: 1367478000000,
		endDate: 1373439600000,
		sendByDate: 1375945200000,
		link: 'http://products.geappliances.com/MarketingObjectRetrieval/Dispatcher?RequestType=PDF&Name=74594A_q2_cafe_web_reb.pdf',
		linkText: 'Save up to $750 with 50% bonus savings',
	}],
};
const noRebates = {
	rebates: [],
};


describe('RebateBox Container', () => {
	it('should render with one rebate', () => {
		const tree = require('react-test-renderer').create(
			<RebateBox {...oneRebate} />
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('should render with more than one rebate', () => {
		const tree = require('react-test-renderer').create(
			<RebateBox {...manyRebates} />
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('should render with no rebates', () => {
		const tree = require('react-test-renderer').create(
			<RebateBox {...noRebates} />
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});
});
