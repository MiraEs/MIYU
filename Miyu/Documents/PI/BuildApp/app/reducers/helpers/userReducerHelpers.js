'use strict';

export function getAvatarUrl(user) {
	if (user && user.apiUser && user.apiUser.avatar) {
		return user.apiUser.avatar;
	}
}

export function getFullName(user) {
	if (user.firstName && user.lastName) {
		return `${user.firstName} ${user.lastName}`;
	} else if (user.firstName) {
		return user.firstName;
	}
}
