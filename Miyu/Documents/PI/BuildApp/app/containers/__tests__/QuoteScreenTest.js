jest.unmock('react-native');
import 'react-native';
import React from 'react';
import { QuoteScreen } from '../QuoteScreen';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('BuildLibrary');
jest.mock('BuildNative');
jest.mock('../../../app/components/NavigationBar', () => 'NavigationBar');
jest.mock('../../../app/components/FavoriteButton', () => 'FavoriteButton');
jest.mock('../../../app/components/button', () => 'Button');
jest.mock('../../../app/components/Cart/CartRow', () => 'CartRow');
jest.mock('../../../app/containers/CartScreen', () => 'CartScreen');

const defaultProps = {
	actions: {
		trackState: jest.fn(),
	},
	composite: {
		quote: {
			cartNumber: 12345,
			employeeId: 12345,
			employeeEmail: 'test@build.com',
			employeeFullName: 'Test',
			expirationDate: 1,
			hidePricing: false,
			onlineAllowed: true,
			phoneNumber: '1231231234',
			projectTitle: 'test',
			quoteCreateDate: 1,
		},
		sessionCart: {
			quantity: 1,
			sessionCartItems: [],
			subTotal: 1,
		},
	},
	loading: false,
	title: '',
	quoteNumber: '1',
};

describe('QuotesScreen container', () => {

	it('should render correctly with no quote number', () => {
		const tree = require('react-test-renderer').create(
			<QuoteScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
