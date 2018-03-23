import { create } from 'react-test-renderer';
import Modal from '../Modal';
import React from 'react';

jest.mock('../../../app/lib/analytics/tracking');
jest.mock('../NavigationBar', () => 'NavigationBar');

const defaultProps = {

};

function setup() {
	const wrapper = create(<Modal {...defaultProps} />);
	return {
		wrapper,
	};
}

describe('Modal component', () => {
	it('should render correctly', () => {
		const { wrapper } = setup();
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
});
