jest.unmock('react-native');
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import SwatchList from '../SwatchList';

const finish = {
	finishSwatch: {
		hexValue: '#000000',
		styleValue: '',
	},
};

const finishes = [];
for (let i = 0; i < 10; i++) {
	finishes.push(finish);
}

describe('SwatchList component', () => {

	it('should render a SwatchList with required props', () => {
		const tree = renderer.create(
			<SwatchList
				width={250}
				finishes={finishes}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a SwatchList with a selectedFinishId', () => {
		const tree = renderer.create(
			<SwatchList
				width={250}
				finishes={finishes.concat({
					...finish,
					uniqueId: 123,
				})}
				selectedFinishId={123}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
