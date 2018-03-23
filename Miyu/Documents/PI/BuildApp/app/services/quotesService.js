'use strict';
import client from './httpClient';

const quotesService = {

	getQuoteComposite(quoteNumber) {
		const url = `/v1/quotes/composite?quoteNumber=${quoteNumber}&siteId=82`;

		return client.get(url);
	},

};

module.exports = quotesService;
