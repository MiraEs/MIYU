'use strict';

jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('../../components/TappableListItem', () => 'TappableListItem');
jest.mock('../../actions/ProductsActions', () => ({
	getProductAttachments: jest.fn(),
}));
jest.mock('../../actions/AnalyticsActions', () => ({
	trackState: jest.fn(),
}));
jest.mock('../../lib/helpersWithLoadRequirements', () => ({
	openURL: jest.fn(),
}));

jest.unmock('react-native');

import {
	ProductAttachments,
	mapStateToProps,
	mapDispatchToProps,
} from '../ProductAttachments';
import React from 'react';
import productsActions from '../../actions/ProductsActions';
import { trackState } from '../../actions/AnalyticsActions';
import { create } from 'react-test-renderer';
import { openURL } from '../../lib/helpersWithLoadRequirements';

const compositeId = 1234;

const defaultProps = {
	actions: {
		trackState: jest.fn(),
		getProductAttachments: jest.fn(() => ({ catch: jest.fn(() => ({ done: jest.fn() })) })),
	},
	attachments: [{
		displayName: 'display name',
		url: '/url',
	}],
};

describe('ProductAttachments component', () => {

	it('should render correctly', () => {
		const tree = create(
			<ProductAttachments {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should handle attachment press', () => {
		const instance = create(<ProductAttachments {...defaultProps} />).getInstance();
		const url = '/url';
		instance.onAttachmentPress(url);
		expect(openURL).toBeCalledWith(url);
	});

	it('should mapStateToProps', () => {
		const state = {
			productsReducer: {
				[compositeId]: {
					attachments: [{
						test: true,
					}],
				},
			},
		};
		const result = mapStateToProps(state, {
			compositeId,
		});
		expect(result).toEqual({
			attachments: [{
				test: true,
			}],
		});
	});

	it('should mapDispatchToProps', () => {
		const dispatch = jest.fn(fn => fn);
		const result = mapDispatchToProps(dispatch);
		expect(result).toEqual({
			actions: {
				getProductAttachments: productsActions.getProductAttachments,
				trackState,
			},
		});
	});
});
