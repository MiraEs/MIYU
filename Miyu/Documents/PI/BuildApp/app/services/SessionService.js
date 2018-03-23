import client from './httpClient';

const SessionService = {
	saveSession(request) {
		const url = '/v1/session/';

		return client.post(url, request);
	},
	getSession(request) {
		const url = `/v1/session/${request.cid}`;

		return client.get(url);
	},
};

export default SessionService;
