jest.unmock('../../../app/actions/SingleEventActions');

jest.mock('../../../app/services/customerService', () => ({
	getEvent: jest.fn(() => Promise.resolve({})),
}));
jest.mock('BuildNative');
jest.mock('../../../app/services/httpClient', () => ({}));

import SingleEventActions from '../SingleEventActions';
import customerService from '../../services/customerService';
import { RESET_SINGLE_EVENT_DATA } from '../../constants/singleEventConstants';

const dispatch = jest.fn();
const getState = jest.fn(() => ({
	userReducer: {
		user: {
			customerId: 1,
			firstName: 'Bob',
			lastName: 'Marley',
		},
	},
}));

describe('SingleEventActions', () => {

	describe('resetSingleEventData', () => {
		it('should return object with matching props', () => {
			const result = SingleEventActions.resetSingleEventData();
			expect(result.type).toEqual(RESET_SINGLE_EVENT_DATA);
		});
	});

	describe('getEvent', () => {
		const options = {
			customerId: 1,
			eventId: 1,
		};
		const request = { ...options };
		it('should call customersService.getEvent', () => {
			SingleEventActions.getEvent(options)(dispatch);
			expect(customerService.getEvent).toHaveBeenCalledWith(request);
		});
	});

	describe('saveComment', () => {
		let promiseAllSpy;

		beforeAll(() => {
			promiseAllSpy = spyOn(Promise, 'all').and.returnValue({ then: jest.fn() });
		});

		it('should call Promise all with array of photos', () => {
			const options = {
				eventId: 1,
				message: 'hello',
				_id: 1,
				photos: [],
			};
			SingleEventActions.saveComment(options)(dispatch, getState);
			expect(promiseAllSpy).toHaveBeenCalledWith([]);
		});
	});
});
