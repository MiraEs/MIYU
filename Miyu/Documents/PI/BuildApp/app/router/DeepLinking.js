import UrlPattern from 'url-pattern';
import url from 'url';
import router from './index';
import helpers from '../lib/helpers';
import store from '../store/configStore';
import { trackAction } from '../actions/AnalyticsActions';
import TrackingActions from '../lib/analytics/TrackingActions';
import { HOME } from '../constants/constants';

const patterns = {
	article: /^\/(.+)\/a([0-9]+)(\?.*)*$/,
	category: /^\/(.+)\/c([0-9]+)(\?.*)*$/,
	pPage: /^\/(.+)\/p([0-9]+)(\?.*)*$/,
	sPage: /^\/(?:.+)\/s([0-9]+)(\?.*)?$/, // https://regex101.com/r/4OyX7c/3
	routePage: /^(\/[A-Za-z\-]+)(\?.*)*$/,
};

function convertTypes(props = {}, types = {}) {
	const obj = {};
	Object.keys(props).forEach((key) => {
		if (types[key] === 'number' && props[key]) {
			obj[key] = helpers.toInteger(props[key]);
		} else {
			obj[key] = props[key];
		}
	});
	return obj;
}

function handleAfter(uri) {
	if (uri && uri.options && typeof uri.options.after === 'function') {
		uri.options.after();
	}
}

class DeepLinking {

	constructor() {
		this.URIs = [];

		this.registerUrl(new UrlPattern(patterns.category, ['slug', 'categoryId', 'query']), {
			routeName: 'category',
			tabName: HOME,
			appendProps(linkedUrl) {
				const selectedFacets = [];
				const query = url.parse(linkedUrl, true).query;
				if (query) {
					Object.keys(query).forEach((key) => {

						// matches F followed by digits (ex. F1234)
						if (/^f[0-9]+$/i.test(key)) {
							const value = query[key];

							// if multi-selected facets
							if (Array.isArray(value)) {
								value.forEach((val) => {
									selectedFacets.push({
										facetId: helpers.toInteger(key.substring(1)),
										value: val,
									});
								});
							} else {
								selectedFacets.push({
									facetId: helpers.toInteger(key.substring(1)),
									value,
								});
							}
						}
					});
				}
				return {
					selectedFacets,
					clearExistingFacets: true,
				};
			},
			types: {
				slug: 'string',
				categoryId: 'number',
			},
		});
		this.registerUrl(new UrlPattern(patterns.pPage, ['slug', 'uniqueId', 'query']), {
			routeName: 'productDetail',
			tabName: HOME,
			types: {
				slug: 'string',
				uniqueId: 'number',
			},
		});
		this.registerUrl(new UrlPattern(patterns.sPage, ['compositeId', 'query']), {
			routeName: 'productDetail',
			tabName: HOME,
			appendProps(linkedUrl) {
				const query = url.parse(linkedUrl, true).query;
				const props = {};
				if (query && query.uid) {
					const uniqueId = helpers.toInteger(query.uid);
					if (typeof uniqueId === 'number') {
						props.uniqueId = uniqueId;
					}
				}
				return props;
			},
			types: {
				slug: 'string',
				compositeId: 'number',
				uniqueId: 'number',
			},
		});
		this.registerUrl(new UrlPattern(patterns.article, ['slug', 'id', 'query']), {
			routeName: 'content',
			tabName: HOME,
			types: { id: 'number' },
		});
		this.registerUrl(new UrlPattern(patterns.routePage, ['pageRoute', 'query']), {
			routeName: 'content',
			tabName: HOME,
			appendProps(linkedUrl) {
				const query = url.parse(linkedUrl, true).query;
				const props = {};
				if (query && query.tab) {
					props.tab = decodeURIComponent(query.tab).toLowerCase();
				}
				return props;
			},
			types: {
				pageRoute: 'string',
				tab: 'string',
			},
		});
	}

	registerUrl(linkedUrl, options = {}) {
		this.URIs.push({
			url: linkedUrl,
			options,
		});
	}

	getAppLocationByURI(linkedUrl) {
		let props;
		const matchedURI = this.URIs.find((route) => {
			props = route.url.match(linkedUrl);
			if (props) {
				props = convertTypes(props, route.options.types);
				if (route.options && route.options.appendProps && typeof route.options.appendProps === 'function') {
					props = {
						...props,
						...route.options.appendProps(linkedUrl),
					};
				}

				return route;
			}
		});
		try {
			const requestedRoute = router.getRoute(matchedURI.options.routeName, props);
			if (matchedURI && requestedRoute) {
				handleAfter(matchedURI);
				return {
					route: requestedRoute,
					tabName: matchedURI.options.tabName,
				};
			}
		} catch (error) {
			store.dispatch(trackAction(TrackingActions.DEEPLINKING_ROUTE_MATCH_ERROR, error));
		}
	}

	getURIFromBranchPayload(payload = {}) {
		if (payload && payload.params) {
			const {
				$canonical_url,
				$desktop_url,
				$android_url,
				$ios_url,
			} = payload.params;

			if ($canonical_url) {
				return $canonical_url;
			} else if ($desktop_url) {
				return $desktop_url;
			} else if ($android_url) {
				return $android_url;
			} else if ($ios_url) {
				return $ios_url;
			}
		}
	}

}

module.exports = new DeepLinking();
