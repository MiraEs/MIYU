jest.unmock('react-native');
jest.mock('BuildLibrary');
jest.mock('BuildNative');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('../../../app/components/FixedBottomButton', () => 'FixedBottomButton');
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import CreateFavoritesListModal from '../CreateFavoritesListModal';

const defaultProps = {
	onCreatePress: jest.fn(),
};

describe('CreateFavoritesListModal component', () => {

	it('should render CreateFavoritesListModal with only required props', () => {
		const tree = renderer.create(
			<CreateFavoritesListModal
				{...defaultProps}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render CreateFavoritesListModal with an error message', () => {
		const tree = renderer.create(
			<CreateFavoritesListModal
				{...defaultProps}
				error="ERROR"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
