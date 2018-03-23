'use strict';

jest.mock('../../services/httpClient', () => ({}));
jest.mock('../../store/configStore', () => ({}));
jest.mock('../../lib/analytics/tracking');
jest.mock('../../lib/styles');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../components/Form', () => 'Form');
jest.mock('../../components/FormInput', () => 'FormInput');

jest.unmock('react-native');

import { EditAccountDetailsScreen } from '../EditAccountDetailsScreen';
import React from 'react';
import { shallow } from 'enzyme';

const defaultProps = {
	actions: {
		trackState: jest.fn(),
		updateCustomer: jest.fn(() => Promise.resolve()),
	},
	firstName: 'test',
	lastName: 'test',
	email: 'test@test.com',
};

describe('EditAccountDetailsScreen component', () => {

	it('should render correctly', () => {
		const tree = shallow(<EditAccountDetailsScreen {...defaultProps} />);
		expect(tree).toMatchSnapshot();
	});

	describe('handleChange', () => {
		it('should have firstname ', () => {
			const tree = new EditAccountDetailsScreen(defaultProps);
			const input = {
				firstName: {
					value: 'first',
				},
			};
			tree.setState = jest.fn();
			tree.handleChange(input);
			expect(tree.setState).toHaveBeenCalledWith({ firstName: input.firstName.value });
		});

		it('should have firstname and lastname', () => {
			const tree = new EditAccountDetailsScreen(defaultProps);
			const input = {
				firstName: {
					value: 'first',
				},
				lastName: {
					value: 'last',
				},
			};
			tree.setState = jest.fn();
			tree.handleChange(input);
			expect(tree.setState).toHaveBeenCalledWith({
				firstName: input.firstName.value,
				lastName: input.lastName.value,
			});
		});

		it('should have firstname, lastname and email', () => {
			const tree = new EditAccountDetailsScreen(defaultProps);
			const input = {
				firstName: {
					value: 'first',
				},
				lastName: {
					value: 'last',
				},
				email: {
					value: 'email@email.com',
				},
			};
			tree.setState = jest.fn();
			tree.handleChange(input);
			expect(tree.setState).toHaveBeenCalledWith({
				firstName: input.firstName.value,
				lastName: input.lastName.value,
				email: input.email.value,
			});
		});
	});

	describe('handleSubmit', () => {
		it('should validate all fields before submitting', () => {
			const tree = new EditAccountDetailsScreen(defaultProps);
			tree.firstName = {
				triggerValidation: jest.fn(() => true),
			};
			tree.lastName = {
				triggerValidation: jest.fn(() => true),
			};
			tree.email = {
				triggerValidation: jest.fn(() => true),
			};
			tree.setState = jest.fn();
			tree.handleSubmit();
			expect(tree.setState).toHaveBeenCalledWith({ isLoading: true });
			expect(tree.props.actions.updateCustomer).toHaveBeenCalledWith(tree.state);
		});
	});
});
