jest.unmock('react-native');
import 'react-native';
import React from 'react';
import moment from 'moment';
import CalendarPicker from '../Library/Calendar/CalendarPicker';
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('BuildLibrary');

const defaultProps = {
	dates: [
		'2017-01-01',
		'2017-02-15',
		'2017-03-31',
	],
	onSelectDate: jest.fn(),
};

describe('CalendarPicker component', () => {

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<CalendarPicker {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render with a selected date', () => {
		const tree = require('react-test-renderer').create(
			<CalendarPicker
				{...defaultProps}
				selection={moment.utc('01-01-2017', 'MM-DD-YYYY')}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
