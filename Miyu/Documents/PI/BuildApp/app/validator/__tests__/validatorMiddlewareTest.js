
import validatorMiddleware from '../validatorMiddleware';

const next = jest.fn();
const action = jest.fn();
const store = {
	getState: jest.fn(() => ({
		validator: {},
	})),
};
const validators = {};

describe('validatorMiddleware', () => {

	it('should return a few functions', () => {
		expect(typeof validatorMiddleware()).toEqual('function');
		expect(typeof validatorMiddleware()()).toEqual('function');
		expect(typeof validatorMiddleware()()(next)).toEqual('function');
	});

	it('should call next with action when run', () => {
		validatorMiddleware(validators)(store)(next)(action);
		expect(next).toBeCalledWith(action);
	});

});
