
const dispatch = jest.fn();

jest.unmock('../../../app/actions/OrderActions');
import orderActions from '../OrderActions';

jest.mock('../../../app/services/customerService', () => ({
	getOrders: jest.fn(() => Promise.resolve({})),
	getOrder: jest.fn(() => Promise.resolve({})),
	getReturns: jest.fn(() => Promise.resolve({})),
	getReturn: jest.fn(() => Promise.resolve({})),
	getShippingInfo: jest.fn(() => Promise.resolve({})),
}));
import customerService from '../../services/customerService';

describe('NotificationActions', () => {

	beforeEach(() => {
		customerService.getOrders.mockClear();
		customerService.getOrder.mockClear();
		customerService.getReturns.mockClear();
		customerService.getReturn.mockClear();
		customerService.getShippingInfo.mockClear();
	});

	describe('loadOrders', () => {
		it('should return a function', () => {
			orderActions.loadOrders(1)(dispatch);
			expect(customerService.getOrders).toBeCalledWith(1);
		});

		it('should throw error', () => {
			customerService.getOrders = jest.fn(() => Promise.resolve({
				code: 500,
				message: 'yeah, you failed',
			}));
			expect(orderActions.loadOrders(1)(dispatch).then).toThrow();
		});

		it('should dispatch LOAD_ORDERS_SUCCESS', () => {
			return orderActions.loadOrders(1)(dispatch)
				.then(() => {
					expect(dispatch).toHaveBeenCalledWith({
						type: 'LOAD_ORDERS_SUCCESS',
						orders: {},
					});
				});
		});
	});

	describe('loadOrderDetails', () => {
		it('should return a function', () => {
			orderActions.loadOrderDetails(7, 123)(dispatch);
			expect(customerService.getOrder).toBeCalledWith(7, 123);
		});

		it('should throw error', () => {
			customerService.getOrder = jest.fn(() => Promise.resolve({
				code: 500,
				message: 'yeah, you failed',
			}));
			expect(orderActions.loadOrderDetails(7, 123)(dispatch).then).toThrow();
		});
	});

	describe('loadReturns', () => {
		it('should return a function', () => {
			orderActions.loadReturns(7)(dispatch);
			expect(customerService.getReturns).toBeCalledWith(7);
		});

		it('should throw error', () => {
			customerService.getReturns = jest.fn(() => Promise.resolve({
				code: 500,
				message: 'yeah, you failed',
			}));
			expect(orderActions.loadReturns(7)(dispatch).then).toThrow();
		});
	});

	describe('loadReturnDetails', () => {
		it('should return a function', () => {
			orderActions.loadReturnDetails(7, 321)(dispatch);
			expect(customerService.getReturn).toBeCalledWith(7, 321);
		});

		it('should throw error', () => {
			customerService.getReturn = jest.fn(() => Promise.resolve({
				code: 500,
				message: 'yeah, you failed',
			}));
			expect(orderActions.loadReturnDetails(7, 321)(dispatch).then).toThrow();
		});
	});

	describe('getShippingInfo', () => {
		it('should return a function', () => {
			orderActions.getShippingInfo(7, 654)(dispatch);
			expect(customerService.getShippingInfo).toBeCalledWith(7, 654);
		});
	});

});
