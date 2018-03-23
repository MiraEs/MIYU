jest.unmock('../../../app/actions/QuotesActions');

jest.mock('../../../app/services/quotesService', () => ({
	getQuoteComposite: jest.fn(() => Promise.resolve({})),
}));

import QuotesActions from '../QuotesActions';
import quotesService from '../../services/quotesService';

const dispatch = jest.fn();

describe('QuotesActions', () => {
	describe('getQuoteComposite', () => {
		it('should call quotesService.getQuoteComposite with quote number', () => {
			const quoteNumber = 1234;
			QuotesActions.getQuoteComposite(quoteNumber)(dispatch);
			expect(quotesService.getQuoteComposite).toHaveBeenCalledWith(quoteNumber);
		});
	});
});
