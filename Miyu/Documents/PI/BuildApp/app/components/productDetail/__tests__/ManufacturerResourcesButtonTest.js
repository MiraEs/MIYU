
jest.mock('../../TappableListItem', () => 'TappableListItem');
jest.mock('../../../lib/ProductConfigurationHelpers');
jest.mock('../../../services/httpClient', () => ({}));
jest.mock('BuildNative');

import React from 'react';
jest.unmock('react-native');
import 'react-native';
import renderer from 'react-test-renderer';

import { ManufacturerResourcesButton } from '../ManufacturerResourcesButton';

const fullProps = {
	attachmentCount: 1,
	navigation: {
		getNavigator: jest.fn(() => ({
			push: jest.fn(),
		})),
	},
};

describe('ManufacturerResourcesButton', () => {
	it('should return null if there are no attachments', () => {
		const wrapper = renderer.create(<ManufacturerResourcesButton attachmentCount={0} />);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should render the button if there are any attachments', () => {
		const wrapper = renderer.create(<ManufacturerResourcesButton {...fullProps} />);
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should navigate to product attachments when pressed', () => {
		const wrapper = renderer.create(<ManufacturerResourcesButton {...fullProps} />);
		wrapper.getInstance().onManufacturerResourcesPress();
		expect(fullProps.navigation.getNavigator).toBeCalledWith('root');
	});
});
