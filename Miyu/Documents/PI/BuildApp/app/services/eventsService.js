
import client from './httpClient';

const eventsService = {

	get(options, successCallback, errorCallback) {
		options = options || {};
		options.filters = options.filters || {};

		const filters = [];
		for (const filter in options.filters) {
			if (options.filters.hasOwnProperty(filter) && options.filters[filter]) {
				filters.push(`${filter}=${options.filters[filter]}`);
			}
		}
		const url = `/v1/customers/${options.customerId}/events?${filters.join('&')}`;

		return client.get(url)
			.then((data) => {
				if (data && data.code) {
					errorCallback(data);
				} else {
					successCallback(data);
				}
			})
			.catch((error) => {
				errorCallback(error);
			})
			.done();
	},

	savePostEvent(request) {
		request = request || {};
		const url = `/v1/customers/${request.customerId}/projects/${request.projectId}/postEvents`;

		return client.post(url, {
			message: request.message,
			photoIds: request.photoIds || [],
		})
			.then((response) => {
				if (response && response.eventId) {
					return response;
				}

				throw response;
			})
			.catch((error) => {
				throw error;
			});
	},
};

module.exports = eventsService;
