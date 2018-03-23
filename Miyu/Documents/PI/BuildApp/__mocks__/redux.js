const redux = {
	applyMiddleware: jest.fn(),
	bindActionCreators: jest.fn((actions, dispatch) => {
		const map = {};
		Object.keys(actions || {}).forEach((key) => {
			map[key] = dispatch(actions[key]);
		});
		return map;
	}),
	combineReducers: jest.fn(),
	compose: () => { return jest.fn(); },
	createStore: jest.fn(),
};

module.exports = redux;
