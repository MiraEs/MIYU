'use strict';

export function hasProjects(projects = {}) {
	if (!Object.keys(projects).length) {
		return false;
	}
	const {
		active: {
			invitedProjects: activeInvited = [],
			myProjects: activeProjects = [],
			sharedProjects: activeShared = [],
		},
		archived: {
			invitedProjects: archivedInvited = [],
			myProjects: archivedProjects = [],
			sharedProjects: archivedShared = [],
		},
	} = projects;

	const hasActive = activeProjects.length > 0 ||
		activeShared.length > 0 ||
		activeInvited.length > 0;
	const hasArchived = archivedProjects.length > 0 ||
		archivedShared.length > 0 ||
		archivedInvited.length > 0;

	return hasActive || hasArchived;
}

export function hasMergedProjects(projects = {}, min = 0) {
	if (!Object.keys(projects).length) {
		return false;
	}
	const {
		active: {
			invitedProjects: activeInvited = [],
			myProjects: activeProjects = [],
			sharedProjects: activeShared = [],
		},
		archived: {
			invitedProjects: archivedInvited = [],
			myProjects: archivedProjects = [],
			sharedProjects: archivedShared = [],
		},
	} = projects;
	return (activeProjects.length + activeShared.length + activeInvited.length) > min ||
		(archivedProjects.length + archivedShared.length + archivedInvited.length) > min;
}

export function getProject(projects, id) {
	const allProjects = [].concat(
		projects.active.myProjects,
		projects.active.sharedProjects,
		projects.active.invitedProjects,
		projects.archived.myProjects,
		projects.archived.sharedProjects,
		projects.archived.invitedProjects
	);
	const project = allProjects.filter((project = {}) => {
		return project.id === id;
	});
	if (project.length === 0) {
		return {};
	}
	return project[0];
}

export function findIndexOfSessionCartInShoppingList(allShoppingListsInProject, projectShoppingListGroupId) {
	if (!allShoppingListsInProject) {
		return -1;
	}
	let index = 0;
	let list;
	const { length } = allShoppingListsInProject;
	for (; index < length; index++) {
		list = allShoppingListsInProject[index];
		if (list && list.projectShoppingListGroupId === projectShoppingListGroupId) {
			break;
		}
	}

	return index === length ? -1 : index;
}

export function findIndexOfShoppingListsInProject(allShoppingLists, projectId) {
	if (!allShoppingLists) {
		return -1;
	}
	let index = 0;
	let list;
	const { length } = allShoppingLists;
	for (; index < length; index++) {
		list = allShoppingLists[index];
		if (list && list.project && list.project.id === projectId) {
			break;
		}
	}

	return index === length ? -1 : index;
}

export function getShoppingListsFromProject(allShoppingLists, projectId) {
	const index = findIndexOfShoppingListsInProject(allShoppingLists, projectId);
	return index > -1 ? allShoppingLists[index].shoppingLists || [] : [];
}

export function mapProjectsDataToObject(projects) {
	const {
		active: activeProjects,
		archived: archivedProjects,
	} = projects;
	const activeData = [];
	const archivedData = [];

	if (activeProjects.myProjects && activeProjects.myProjects.length) {
		activeData.push(...activeProjects.myProjects);
	}
	if (activeProjects.sharedProjects && activeProjects.sharedProjects.length) {
		activeData.push(...activeProjects.sharedProjects);
	}
	if (activeProjects.invitedProjects && activeProjects.invitedProjects.length) {
		activeData.push(
			...(activeProjects.invitedProjects.map((project) => ({
				...project,
				isInvited: true,
			})))
		);
	}

	if (archivedProjects.myProjects && archivedProjects.myProjects.length) {
		archivedData.push(...archivedProjects.myProjects);
	}
	if (archivedProjects.sharedProjects && archivedProjects.sharedProjects.length) {
		archivedData.push(...archivedProjects.sharedProjects);
	}
	if (archivedProjects.invitedProjects && archivedProjects.invitedProjects.length) {
		archivedData.push(
			...(archivedProjects.invitedProjects.map((project) => ({
				...project,
				isInvited: true,
			})))
		);
	}

	return {
		active: activeData,
		archived: archivedData,
	};
}
