import validatorReducer from '../validatorReducer';

describe('validatorReducer', () => {
	it('should return initialState', () => {
		expect(validatorReducer(undefined, {})).toMatchSnapshot();
	});

	it('should return the correct state for VALIDATE to true', () => {
		expect(validatorReducer({}, {
			type: 'VALIDATE',
			payload: {data: 'payload'},
		})).toMatchSnapshot();
	});

});
