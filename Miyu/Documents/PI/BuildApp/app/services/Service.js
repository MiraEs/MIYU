import Joi from 'rn-joi';
import uuid from 'uuid';
import helpers from '../lib/helpers';

class Service {

	constructor(options) {
		this.endpoints = {};
		this.serviceConstraints = options && options.constraints ? options.constraints : {};
	}

	request = (id, args) => {
		return new Promise((resolve, reject) => {
			const endpoint = this.endpoints[id];
			if (endpoint) {
				if (endpoint.constraints || this.serviceConstraints) {
					const constraints = {
						...this.serviceConstraints,
						...endpoint.constraints || {},
					};

					try {
						Joi.assert(args, constraints);
					} catch (error) {
						return reject(error.details);
					}
				}
				return resolve(
					this.endpoints[id].fn(args).then(
						(response) => {
							helpers.serviceErrorCheck(response);
							return response;
						}
					)
				);
			} else {
				const message = `Cannot call endpoint ${id} because it doesn't exist.`;
				if (__DEV__) {
					console.error(`${message} Something has gone terribly wrong. Unknown error.`);
				}
				return reject(message);
			}
		});
	};

	createEndpoint = (fn, constraints = {}) => {
		if (typeof fn !== 'function') {
			console.error('First argument is required and must be a function');
		} else {
			const id = uuid.v4();
			this.endpoints[id] = {
				constraints,
				fn,
			};
			return (args) => this.request(id, args);
		}
	};

}

export default Service;
