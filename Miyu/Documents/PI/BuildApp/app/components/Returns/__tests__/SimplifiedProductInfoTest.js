jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../lib/helpers', () => ({
	getCloudinaryImageUrl: jest.fn(),
}));
jest.mock('../../../constants/CloudinaryConstants', () => ({}));

jest.mock('react-native');

import SimplifiedProductInfo from '../SimplifiedProductInfo';
import React from 'react';
import renderer from 'react-test-renderer';

const defaultProps = {
	finish: 'Black',
	image: 'safavieh-fox8508a-1419.jpg',
	manufacturer: 'Safavieh',
	productId: 'FOX8508',
	quantity: 1,
	returnQuantity: 1,
};

describe('SimplifiedProductInfo component', () => {
	it('it should render', () => {
		const tree = renderer.create(
			<SimplifiedProductInfo {...defaultProps} />
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('it should render a quantity', () => {
		const tree = renderer.create(
			<SimplifiedProductInfo
				{...defaultProps}
				quantity={10}
				showQuantity={true}
			/>
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});

	it('it should render a headerRowAction', () => {
		class Test extends React.Component {
			render() {
				return React.createElement('Test');
			}
		}
		const tree = renderer.create(
			<SimplifiedProductInfo
				{...defaultProps}
				headerRowAction={<Test />}
			/>
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});

});
