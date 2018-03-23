import { create } from 'react-test-renderer';

jest.mock('../../../../app/store/configStore', () => ({}));
jest.mock('../../../../app/lib/analytics/tracking');
jest.mock('../../../../app/components/Form', () => 'Form');
jest.mock('../../../../app/components/FormInput', () => 'FormInput');

jest.unmock('react-native');

import React from 'react';
import { SignUpForm } from '../SignUpForm';

const defaultProps = {
	isCheckout: false,
	user: {},
	isPro: false,
};


function setup(props) {
	const wrapper = create(
		<SignUpForm
			{...defaultProps}
			{...props}
		/>
	);
	return {
		wrapper,
	};
}

describe('SignUpForm component', () => {
	it('should render SignUpForm', () => {
		const { wrapper } = setup();
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should render with pro signup', () => {
		const { wrapper } = setup({
			showEnrollAsPro: true,
		});
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
});
