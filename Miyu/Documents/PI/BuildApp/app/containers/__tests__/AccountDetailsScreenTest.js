
jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('../../actions/NavigatorActions', () => ({
	navigatorPopToRoute: jest.fn(),
}));
jest.mock('../../constants/RouteIdConstants', () => ({
	ACCOUNT_DETAILS_SCREEN: 'ACCOUNT_DETAILS_SCREEN',
}));

import { AccountDetailsScreen } from '../AccountDetailsScreen';
import React from 'react';
import { Alert } from 'react-native';
import { create } from 'react-test-renderer';
import { navigatorPopToRoute } from '../../actions/NavigatorActions';
import { ACCOUNT_DETAILS_SCREEN } from '../../constants/RouteIdConstants';

const addresses = [{
	addressId: 1,
}, {
	addressId: 2,
}];

const fullProps = {
	customer: {},
	creditCards: [],
	actions: {
		trackState: jest.fn(),
		getCreditCards: jest.fn(() => ({ catch: jest.fn(() => ({ done: jest.fn()})) })),
		getCustomerAddresses: jest.fn(() => ({ catch: jest.fn(() => ({ done: jest.fn()})) })),
	},
	navigator: {
		push: jest.fn(),
	},
	addresses,
};

function setup(props = {}) {
	const wrapper = create(
		<AccountDetailsScreen
			{...fullProps}
			{...props}
		/>
	);
	const instance = wrapper.getInstance();
	return {
		wrapper,
		instance,
	};
}

describe('AccountDetailsScreen component', () => {
	it('should render correctly', () => {
		const { wrapper } = setup();
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should handle componentWillReceiveProps', () => {
		const { instance } = setup();
		instance.componentWillReceiveProps(fullProps);
		expect(instance.state).toMatchSnapshot();
	});
	it('should track the screen', () => {
		const { wrapper } = setup();
		expect(wrapper.getInstance().setScreenTrackingInformation()).toEqual({
			name: 'build:app:more:acct',
		});
	});
	it('should getScreenData', () => {
		const { instance } = setup();
		instance.getScreenData();
		expect(fullProps.actions.getCreditCards).toBeCalled();
		expect(fullProps.actions.getCustomerAddresses).toBeCalled();
	});
	it('should getCreditCards', () => {
		const { instance } = setup();
		expect(instance.getCreditCards(fullProps)).toEqual(fullProps.creditCards);
	});
	it('should getSortedAddresses', () => {
		const { instance } = setup();
		const props = {
			addresses,
		};
		expect(instance.getSortedAddresses(props)).toMatchSnapshot();
	});
	it('should addOrEditAddress', () => {
		const { instance } = setup();
		instance.addOrEditAddress(addresses[0]);
		expect(fullProps.navigator.push).toBeCalledWith('newAddress', {
			address: addresses[0],
			addressScreenState: 'EDIT_ADDRESS',
			title: 'Edit Address',
			addressTypeId: 'SHIPPING',
			onSaveSuccess: instance.navigateToAccountDetails,
		});
	});
	it('should changePassword', () => {
		const { instance } = setup();
		instance.changePassword();
		expect(fullProps.navigator.push).toBeCalledWith('changePassword');
	});
	it('should deleteCreditCard', () => {
		const { instance } = setup();
		const alertSpy = jest.spyOn(Alert, 'alert');
		instance.deleteCreditCard(1);
		expect(alertSpy).toBeCalled();
	});
	it('should deleteCustomerAddress', () => {
		const { instance } = setup();
		const alertSpy = jest.spyOn(Alert, 'alert');
		instance.deleteCustomerAddress(1);
		expect(alertSpy).toBeCalled();
	});
	it('should editDetails', () => {
		const { instance } = setup();
		instance.editDetails();
		expect(fullProps.navigator.push).toBeCalledWith('editAccountDetails');
	});
	it('should onPressNewCardButton', () => {
		const { instance } = setup();
		instance.onPressNewCardButton();
		expect(fullProps.navigator.push).toBeCalledWith('creditCardScreen', {
			hideTabs: false,
			onSaveSuccess: instance.navigateToAccountDetails,
			isCheckout: false,
		});
	});
	it('should navigateToAccountDetails', () => {
		const { instance } = setup();
		instance.navigateToAccountDetails();
		expect(navigatorPopToRoute).toBeCalledWith(ACCOUNT_DETAILS_SCREEN, 'more');
	});
});
