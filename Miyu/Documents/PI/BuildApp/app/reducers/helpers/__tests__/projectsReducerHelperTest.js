'use strict';

import {
	hasProjects,
	hasMergedProjects,
	getProject,
	findIndexOfSessionCartInShoppingList,
	findIndexOfShoppingListsInProject,
	getShoppingListsFromProject,
} from '../../../../app/reducers/helpers/projectsReducerHelper';

describe('hasProjects', () => {
	it('should return false for empty projects', () => {
		const result = hasProjects();
		expect(result).toEqual(false);
	});

	it('should return false for projects with no projects', () => {
		const result = hasProjects({
			active: {
				myProjects: [],
				sharedProjects: [],
			},
			archived: {
				myProjects: [],
				sharedProjects: [],
			},
		});
		expect(result).toEqual(false);
	});

	it('should return true for projects', () => {
		const result = hasProjects({
			active: {
				myProjects: [{ name: 'test' }],
				sharedProjects: [],
			},
			archived: {
				myProjects: [],
				sharedProjects: [],
			},
		});
		expect(result).toEqual(true);
	});

	it('should return false for empty projects all around', () => {
		const projects = {
			active: {},
			archived: {},
		};
		const result = hasProjects(projects);
		expect(result).toEqual(false);
	});
});

describe('hasMergedProjects', () => {
	it('should return false for empty projects', () => {
		const result = hasMergedProjects();
		expect(result).toEqual(false);
	});

	it('should return false for projects with not enough projects', () => {
		const result = hasMergedProjects({
			active: {
				myProjects: [{ name: 'test' }],
				sharedProjects: [{ name: 'test' }],
			},
			archived: {
				myProjects: [],
				sharedProjects: [],
			},
		}, 2);
		expect(result).toEqual(false);
	});

	it('should return true for projects with enough', () => {
		const result = hasMergedProjects({
			active: {
				myProjects: [{ name: 'test' }, { name: 'test' }],
				sharedProjects: [{ name: 'test' }],
			},
			archived: {
				myProjects: [],
				sharedProjects: [],
			},
		}, 2);
		expect(result).toEqual(true);
	});

	it('should return false for empty projects', () => {
		const projects = {
			active: {},
			archived: {},
		};
		const result = hasMergedProjects(projects);
		expect(result).toEqual(false);
	});
});

describe('getProject', () => {
	const sampleObj = {
		name: 'test',
		id: 2,
	};
	const projects = {
		active: {
			myProjects: [{
				name: 'test',
				id: 1,
			}, sampleObj],
			sharedProjects: [],
			invitedProjects: [],
		},
		archived: {
			myProjects: [],
			sharedProjects: [],
			invitedProjects: [],
		},
	};

	it('should return empty object if not found', () => {
		const result = getProject(projects, 0);
		expect(result).toEqual({});
	});

	it('should return an object if found', () => {
		const result = getProject(projects, 2);
		expect(result).toEqual(sampleObj);
	});
});

describe('findIndexOfSessionCartInShoppingList', () => {
	it('should find an index', () => {
		const result = findIndexOfSessionCartInShoppingList([{
			projectShoppingListGroupId: 1,
		}], 1);
		expect(result).toEqual(0);
	});

	it('should not find an index', () => {
		const result = findIndexOfSessionCartInShoppingList([{
			projectShoppingListGroupId: 2,
		}], 1);
		expect(result).toEqual(-1);
	});

	it('should return -1 if there are no shopping lists', () => {
		const result = findIndexOfSessionCartInShoppingList();
		expect(result).toEqual(-1);
	});
});

describe('findIndexOfShoppingListsInProject', () => {
	it('should find an index', () => {
		const result = findIndexOfShoppingListsInProject([{
			project: {
				id: 1,
			},
		}], 1);
		expect(result).toEqual(0);
	});

	it('should not find an index', () => {
		const result = findIndexOfShoppingListsInProject([{
			project: {
				id: 2,
			},
		}], 1);
		expect(result).toEqual(-1);
	});

	it('should return -1 if there are no shopping lists', () => {
		const result = findIndexOfShoppingListsInProject();
		expect(result).toEqual(-1);
	});
});

describe('getShoppingListsFromProject', () => {
	const shoppingLists = [{ name: 'test' }];
	it('should find an array', () => {
		const result = getShoppingListsFromProject([{
			project: {
				id: 1,
			},
			shoppingLists,
		}], 1);
		expect(result).toEqual(shoppingLists);
	});

	it('should return an empty array', () => {
		const result = getShoppingListsFromProject([{
			project: {
				id: 2,
			},
			shoppingLists,
		}], 1);
		expect(result.length).toEqual(0);
	});
});
