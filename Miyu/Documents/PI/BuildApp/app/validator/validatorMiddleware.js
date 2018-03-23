import Joi from 'rn-joi';


const parseError = (error) => {
	const errors = {};

	if (Array.isArray(error.details)) {
		error.details.forEach((detail) => {
			const { key } = detail.context;

			errors[key] = detail.message.replace(`"${key}" `, '');
		});

		return errors;
	}
};

const validatorMiddleware = (validators) => {
	return (store) => (next) => (action) => {
		next(action);

		const state = store.getState();
		const payload = {};

		Object.keys(validators).forEach((schema) => {
			const result = Joi.validate(state, validators[schema], {
				abortEarly: false,
				allowUnknown: true,
			});

			if (result.error) {
				payload[schema] = parseError(result.error);
			}
		});

		if (action.type !== 'VALIDATE' && JSON.stringify(state.validator) !== JSON.stringify(payload)) {
			store.dispatch({ type: 'VALIDATE', payload });
		}
	};
};

export default validatorMiddleware;


