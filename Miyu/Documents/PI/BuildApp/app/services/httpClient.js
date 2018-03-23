import {
	NetInfo,
	StatusBar,
} from 'react-native';
import auth from '../lib/auth';
import {
	DID_LOGIN_WITH_SOCIAL,
	SOCIAL_LOGIN_TYPE,
} from '../constants/constants';
import store from 'react-native-simple-store';
import {
	keychainDomain,
	api,
} from '../lib/environment';
import helpers from '../lib/helpers';
import facebookService from './facebookService';
import EventEmitter from '../lib/eventEmitter';
import NetworkError from '../errors/NetworkError';
import { unauthorizedError } from '../actions/ErrorActions';
import configStore from '../store/configStore';

function beginRequest() {
	if (helpers.isIOS()) {
		StatusBar.setNetworkActivityIndicatorVisible(true);
	}
}

function endRequest() {
	if (helpers.isIOS()) {
		StatusBar.setNetworkActivityIndicatorVisible(false);
	}
}

function _clearBearerToken() {
	delete this.accessToken;
}

function _getNewToken(method, url, body) {
	_clearBearerToken.call(this);
	// httpClient is declared globally in this file
	// and this function won't run without it being initialized
	// eslint-disable-next-line no-use-before-define
	return httpClient[method](url, body); // NOSONAR
}

function parseText(response) {
	return new Promise((resolve, reject) => {
		if (typeof response.text !== 'function') {
			resolve(response);
		}

		if (__DEV__) {
			// https://github.com/facebook/react-native/issues/6679 :(
			setTimeout(() => null, 0);
		}

		return response.text()
			.then((text) => {
				const result = text.length ? JSON.parse(text) : {};
				resolve(result);
			})
			.catch(() => reject('Unknown Error'));
	});
}

function parseStatusCode(method, url, body, response) {
	return new Promise((resolve, reject) => {
		if (response.ok) {
			return resolve(response);
		}

		if (response.status === 401) {
			return resolve(_getNewToken.call(this, method, url, body));
		}

		// other error - pass it down the line
		return parseText(response)
			.then((resObj) => {
				const result = Array.isArray(resObj) ? resObj[0] : resObj;
				return reject(new Error(result.message || 'Service Unavailable.'));
			})
			.catch((error) => {
				return reject(new Error(error.message || 'Service Unavailable.'));
			});
	});
}

function wrappedFetch(url, options) {
	const retries = 3;
	const delay = 100;
	return new Promise((resolve, reject) => {
		const retryFetch = (n, delay) => {
			fetch(url, options)
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					if (n > 0) {
						setTimeout(() => {
							retryFetch(--n, delay * 2);
						}, delay);
					} else {
						EventEmitter.emit('showErrorAlert', false);
						reject(error);
					}
				});
		};
		retryFetch(retries, delay);
	});
}

function _decorateUrl(url) {
	let result = url;
	if (!url.startsWith('http')) {
		result = `${api.url}${url}`;
	}
	return result;
}

function _post(url, body = {}) {
	url = _decorateUrl(url);
	const method = 'post';
	beginRequest();

	return fetch(url, {
		method,
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${this.accessToken}`,
			Accept: 'application/json',
		},
	})
		.then(parseStatusCode.bind(this, method, url, body))
		.then(parseText)
		.then((data) => {
			endRequest();
			return data;
		})
		.catch((error) => {
			endRequest();
			throw error;
		});
}

function _put(url, body = {}) {
	url = _decorateUrl(url);
	const method = 'put';
	beginRequest();

	return fetch(url, {
		method,
		body: JSON.stringify(body),
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${this.accessToken}`,
			Accept: 'application/json',
		},
	})
		.then(parseStatusCode.bind(this, method, url, body))
		.then(parseText)
		.then((data) => {
			endRequest();
			return data;
		})
		.catch((error) => {
			endRequest();
			throw error;
		});
}

function _get(url) {
	const method = 'get';
	url = _decorateUrl(url);
	beginRequest();
	return wrappedFetch(url, {
		headers: {
			Authorization: `Bearer ${this.accessToken}`,
			Accept: 'application/json',
		},
	})
		.then(parseStatusCode.bind(this, method, url, undefined))
		.then(parseText)
		.then((data) => {
			endRequest();
			return data;
		})
		.catch((error) => {
			endRequest();
			throw error;
		});
}

function _delete(url) {
	url = _decorateUrl(url);
	const method = 'delete';
	beginRequest();

	return fetch(url, {
		method,
		headers: {
			Authorization: `Bearer ${this.accessToken}`,
			Accept: 'application/json',
		},
	})
		.then(parseStatusCode.bind(this, method, url, undefined))
		.then(parseText)
		.then((data) => {
			endRequest();
			return data;
		})
		.catch((error) => {
			endRequest();
			throw error;
		});
}

function _authenticate(options, deleteOnWrongPassword = true, dispatchUnauthorizedError = true) {
	const data = new FormData();
	for (const key in options) {
		if (options.hasOwnProperty(key)) {
			data.append(key, options[key]);
		}
	}

	return fetch(`${api.url}/oauth/token`, {
		method: 'post',
		body: data,
		headers: {
			'Authorization': `Basic ${api.basicAuthToken}`,
			Accept: 'application/json',
		},
	})
	.then((response) => {
		if (__DEV__) {
			// https://github.com/facebook/react-native/issues/6679 :(
			setTimeout(() => null, 0);
		}
		return response.json();
	})
	.then((response) => {
		if (response && response.access_token) {
			this.accessToken = response.access_token;
			return response;
		} else {
			if (deleteOnWrongPassword) {
				auth.resetCredentialsForDomain(keychainDomain);
			}
			let message = 'Failed to authenticate with oauth endpoint';
			if (response && response.error === 'unauthorized') {
				message = 'Invalid email address and/or password.';
				if (dispatchUnauthorizedError) {
					configStore.dispatch(unauthorizedError(true));
				}
			}
			throw new Error(message);
		}
	})
	.catch((error) => { throw error; });
}

function _anonymousAuthentication() {
	const data = new FormData();
	data.append('username', 'anonymous');
	data.append('password', api.anonymousKey);
	data.append('grant_type', 'password');

	return fetch(`${api.url}/oauth/token`, {
		method: 'post',
		body: data,
		headers: {
			'Authorization': `Basic ${api.basicAuthToken}`,
			Accept: 'application/json',
		},
	})
	.then((response) => {
		if (__DEV__) {
			// https://github.com/facebook/react-native/issues/6679 :(
			setTimeout(() => null, 0);
		}
		return response.json();
	})
	.then((response) => {
		if (response && response.access_token) {
			return response.access_token;
		} else {
			throw new Error('Failed to authenticate anonymous user with oauth endpoint.');
		}
	})
	.catch((error) => { throw error; });
}

/**
 * Get a new access token for the user since theirs has expired
 */
function _getBearerToken() {
	// we batch all the calls here because these are all done on device so
	// we aren't too concerned about performance being affected
	return Promise.all([
		store.get(DID_LOGIN_WITH_SOCIAL),
		store.get(SOCIAL_LOGIN_TYPE),
		auth.getCredentialsForDomain(keychainDomain),
	])
		.then(([didLogInWithSocial, socialLoginType, credentials]) => {
			if (didLogInWithSocial) {
				// log user in with social
				if (socialLoginType === 'facebook') {
					return facebookService.getToken().then((userAccessToken) => {
						const options = {
							userAccessToken,
							socialLoginType,
							grant_type: 'social_login',
						};
						return _authenticate.call(this, options);
					});
				} else {
					// currently we only support facebook login
					const message = `Unsupported social login type: ${socialLoginType}`;
					console.error(message);
					throw new Error(message);
				}
			} else if (credentials) {
				// log user in with credentials
				const options = {
					...credentials,
					grant_type: 'password',
				};
				return _authenticate.call(this, options);
			} else {
				return _anonymousAuthentication.call(this)
					.then((token) => {
						if (token) {
							this.accessToken = token;
							return token;
						} else {
							const message = 'Failed to authenticate with oauth endpoint';
							throw new Error(message);
						}
					});
			}
		})
		.catch((error) => { throw error; });
}

class HttpClient {

	constructor() {
		this.isConnected = true;
		NetInfo.isConnected.addEventListener('change', (isConnected) => {
			this.isConnected = isConnected;
		});
	}

	/**
	 * Wrap DELETE requests and set activity indicator statuses
	 */
	delete(url) {
		if (this.isConnected) {
			if (this.accessToken) {
				return _delete.call(this, url);
			} else {
				return _getBearerToken.call(this)
					.then(_delete.bind(this, url));
			}
		} else {
			return this.displayNetworkErrorAlert();
		}
	}

	clearBearerToken() {
		_clearBearerToken.call(this);
	}

	/**
	 * Wrap POST requests and set activity indicator statuses
	 */
	post(url, body) {
		if (this.isConnected) {
			if (this.accessToken) {
				return _post.call(this, url, body);
			} else {
				return _getBearerToken.call(this)
					.then(_post.bind(this, url, body))
					.catch((error) => { throw error; });
			}
		} else {
			return this.displayNetworkErrorAlert();
		}
	}

	/**
	 * Wrap PUT requests and set activity indicator statuses
	 */
	put(url, body) {
		if (this.isConnected) {
			if (this.accessToken) {
				return _put.call(this, url, body);
			} else {
				return _getBearerToken.call(this)
					.then(_put.bind(this, url, body))
					.catch((error) => { throw error; });
			}
		} else {
			return this.displayNetworkErrorAlert();
		}
	}

	/**
	 * Wrap GET requests and set activity indicator statuses
	 */
	get(url) {
		if (this.isConnected) {
			if (this.accessToken) {
				return _get.call(this, url);
			} else {
				return _getBearerToken.call(this)
					.then(_get.bind(this, url))
					.catch((error) => { throw error; });
			}
		} else {
			return this.displayNetworkErrorAlert();
		}
	}

	/**
	 * Authenticate the user in through the oauth token endpoint
	 * @param  {Object} request An object containing username and password properties
	 * @return {Promise}
	 */
	authenticate(request) {
		if (this.isConnected) {
			return _authenticate.call(this, request, undefined, false);
		} else {
			return this.displayNetworkErrorAlert();
		}
	}

	anonymousOauthAuthentication() {
		if (this.isConnected) {
			return _anonymousAuthentication.call(this);
		} else {
			return this.displayNetworkErrorAlert();
		}
	}

	/**
	 * Authenticate the user in through the oauth token endpoint
	 * @param  {Object} request An object containing username and password properties
	 * @return {Promise}
	 */
	verifyPassword(request) {
		if (this.isConnected) {
			return _authenticate.call(this, request, false, false);
		} else {
			return this.displayNetworkErrorAlert();
		}
	}

	createCustomer(request) {
		if (this.isConnected) {
			return _anonymousAuthentication.call(this)
				.then((token) => {
					const url = _decorateUrl('/v1/customers/');
					return fetch(url, {
						method: 'post',
						body: JSON.stringify(request),
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
							Accept: 'application/json',
						},
					})
					.then((res) => {
						if (__DEV__) {
							// https://github.com/facebook/react-native/issues/6679 :(
							setTimeout(() => null, 0);
						}
						return res.json();
					});
				});
		} else {
			return this.displayNetworkErrorAlert();
		}
	}

	/**
	 * Call to upload images in Objective-C and Java code
	 * NOTE: we do this in this way because apparently handling image data in JS is slower
	 * https://github.com/facebook/react-native/issues/201#issuecomment-86267193
	 */
	upload(url, request) {
		if (this.isConnected) {
			const self = this;
			return new Promise((resolve, reject) => {
				if (!this.accesToken) {
					_getBearerToken.call(this)
						.then(() => resolve())
						.catch((error) => reject(error));
				} else {
					resolve();
				}
			})
				.then(() => helpers.resizeImages([{
					uri: request.imageFile,
					maxWidth: 800,
					maxHeight: 800,
				}]))
				.then((results) => {
					return new Promise((resolve, reject) => {
						if (!results || !results[0]) {
							return reject();
						}
						const photo = {
								uri: results[0],
								type: 'image/jpeg',
								name: 'image',
							},
							formData = new FormData();
						formData.append('image', photo);
						return fetch(`${api.url}${url}`, {
							method: 'post',
							body: formData,
							headers: {
								'Content-Type': 'multipart/form-data',
								Authorization: `Bearer ${self.accessToken}`,
								Accept: 'application/json',
							},
						})
							.then((res) => {
								if (__DEV__) {
									// https://github.com/facebook/react-native/issues/6679 :(
									setTimeout(() => null, 0);
								}
								resolve(res.json());
							})
							.catch((err) => reject(err));
					});
				})
				.catch((error) => console.warn(error.message));
		} else {
			return this.displayNetworkErrorAlert();
		}
	}

	displayNetworkErrorAlert() {
		EventEmitter.emit('showErrorAlert', true);
		return Promise.reject(new NetworkError('No Network Available'));
	}

}

const httpClient = new HttpClient();

export default httpClient;
