
jest.mock('redux-actions');
jest.mock('@expo/ex-navigation', () => ({
	createRouter: jest.fn(),
	withNavigation: jest.fn(),
	NavigationStyles: {},
	NavigationActions: {
		pop: jest.fn((uid) => ({
			uid,
		})),
		push: jest.fn((uid, route) => ({
			route,
			uid,
		})),
		popToTop: jest.fn((uid) => ({
			uid,
		})),
		replace: jest.fn((uid, route) => ({
			route,
			uid,
		})),
		popN: jest.fn((uid, numberToPop) => ({
			uid,
			numberToPop,
		})),
	},
}));
jest.mock('../../../app/store/configStore', () => ({
	dispatch: jest.fn(),
	getState: jest.fn(() => ({
		navigation: {
			navigators: {
				nav: {
					routes: [{
						routeName: 'thisRoute',
					}, {
						routeName: 'thatRoute',
					}, {
						routeName: 'anotherRoute',
					}],
				},
			},
		},
	})),
}));
import store from '../../store/configStore';

jest.unmock('../../../app/actions/NavigatorActions');
import navigatorActions from '../NavigatorActions';

describe('NavigatorActions', () => {

	beforeEach(() => {
		store.dispatch.mockReset();
	});

	describe('navigatorPop', () => {
		it('should call store.dispatch', () => {
			const uid = 'this-is-a-uid';
			navigatorActions.navigatorPop(uid);
			expect(store.dispatch).toBeCalledWith({
				uid,
			});
		});
	});

	describe('navigatorPopToTop', () => {
		it('should call store.dispatch', () => {
			const uid = 'this-is-a-uid';
			navigatorActions.navigatorPopToTop(uid);
			expect(store.dispatch).toBeCalledWith({
				uid,
			});
		});
	});

	describe('navigatorPush', () => {
		it('should call store.dispatch', () => {
			const route = {};
			const uid = 'test';
			navigatorActions.navigatorPush(route, uid);
			expect(store.dispatch).toBeCalledWith({
				route,
				uid,
			});
		});
	});

	describe('navigatorReplace', () => {
		it('should call store.dispatch', () => {
			const route = {};
			const uid = 'this-is-a-uid';
			navigatorActions.navigatorReplace(route, uid);
			expect(store.dispatch).toBeCalledWith({
				route,
				uid,
			});
		});
	});

	describe('navigatorPopToRoute', () => {
		it('should call store.dispatch', () => {
			const routeName = 'thisRoute';
			const uid = 'nav';
			navigatorActions.navigatorPopToRoute(routeName, uid);
			expect(store.dispatch).toBeCalledWith({
				numberToPop: 2,
				uid,
			});
		});
	});

});
