/* eslint-disable react/no-multi-comp */

const ReduxActions = {
	createAction: jest.fn((str, payloadCreator) => (...payload) => {
		payload = payloadCreator ? payloadCreator(...payload) : payload[0];
		let action = {
			type: str,
			payload,
		};
		if (payload instanceof Error) {
			action = {
				...action,
				error: true,
			};
		}
		return action;
	}),
	handleActions: jest.fn((actions, initialState) => {
		return function(state, action) {
			if (action && action.type && actions[action.type]) {
				return actions[action.type](state, action);
			} else {
				return initialState;
			}
		};
	}),
};

module.exports = ReduxActions;
