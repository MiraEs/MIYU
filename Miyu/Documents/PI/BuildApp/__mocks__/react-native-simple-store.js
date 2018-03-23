export default {
	save: jest.fn(),
	get: jest.fn(() => ({
		then: jest.fn(() => ({
			done: jest.fn(),
			catch: jest.fn(() => ({ done: jest.fn() })),
		})),
	})),
};
