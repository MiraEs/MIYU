'use strict';

jest.mock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

import ProjectRow from '../ProjectRow';
import React from 'react';
import renderer from 'react-test-renderer';

const defaultProps = {
	project: 'Test',
	projectNameFilter: 'Test',
	onPress: jest.fn(),
};

const project1 = {
	name: 'Test',
	shoppingListQuantityPurchased: 1,
	teamMemberCount: 1,
	totalItemsInProject: 1,
};

const project2 = {
	name: 'Another name',
};

describe('ProjectRow component', () => {
	it('should render a string', () => {
		const tree = renderer.create(
			<ProjectRow {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a project', () => {
		const tree = renderer.create(
			<ProjectRow
				{...defaultProps}
				project={project1}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render a project', () => {
		const tree = renderer.create(
			<ProjectRow
				{...defaultProps}
				project={project2}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render an element', () => {
		class Test extends React.Component {
			render() {
				return React.createElement('Test');
			}
		}
		const tree = renderer.create(
			<ProjectRow
				{...defaultProps}
				project={<Test />}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});


});
