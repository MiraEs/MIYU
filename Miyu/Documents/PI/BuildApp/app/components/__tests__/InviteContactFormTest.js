jest.unmock('react-native');
jest.unmock('../../../app/components/InviteContactForm');
jest.unmock('../../../app/lib/Validations');

jest.mock('../../../app/lib/styles');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('BuildNative');

import React from 'react';
import InviteContactForm from '../../../app/components/InviteContactForm';
import renderer from 'react-test-renderer';

const defaultProps = {
	email: 'test@test.com',
	onHandleChange: jest.fn(),
};

describe('InviteContactForm component', () => {

	it('should render InviteContactForm with props', () => {
		const tree = renderer.create(<InviteContactForm {...defaultProps} />);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	describe('validateEmail', () => {
		it('should return true', () => {
			const tree = renderer.create(<InviteContactForm {...defaultProps} />);
			const result = tree.getInstance().validateEmail('test@test.com');
			expect(result).toEqual(true);
		});

		it('should return error message', () => {
			const tree = renderer.create(<InviteContactForm {...defaultProps} />);
			const result = tree.getInstance().validateEmail('garbage');
			expect(result).toEqual('Please enter a valid email address.');
		});
	});
});
