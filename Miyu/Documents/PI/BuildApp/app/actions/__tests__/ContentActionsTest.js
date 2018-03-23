
const dispatch = jest.fn();
jest.mock('redux-actions');

jest.unmock('../../../app/actions/ContentActions');
import contentActions from '../ContentActions';

jest.mock('../../../app/services/ContentService', () => ({
	getContent: jest.fn(() => Promise.resolve({})),
	getSharedPromos: jest.fn(() => Promise.resolve({})),
	getContentGroup: jest.fn(() => Promise.resolve({})),
	getRoutePage: jest.fn(() => Promise.resolve({})),
}));
import contentService from '../../services/ContentService';

describe('ContentActions', () => {

	afterEach(() => {
		contentService.getContent.mockClear();
		contentService.getSharedPromos.mockClear();
		contentService.getContentGroup.mockClear();
		contentService.getRoutePage.mockClear();
	});

	describe('getContent', () => {
		it('should return a function and call contentService.getContent', () => {
			contentActions.getContent(1, 'test')(dispatch);
			expect(contentService.getContent).toBeCalledWith(1, 'test');
		});
	});

	describe('getSharedPromos', () => {
		it('should return a function and call contentService.getSharedPromos', () => {
			contentActions.getSharedPromos(2)(dispatch);
			expect(contentService.getSharedPromos).toBeCalledWith(2);
		});
	});

	describe('getContentGroup', () => {
		it('should return a function and call contentService.getContentGroup', () => {
			const type = 'test';
			contentActions.getContentGroup(type)(dispatch);
			expect(contentService.getContentGroup).toBeCalledWith(type);
		});
	});

	describe('getRoutePage', () => {
		it('should return a function and call contentService.getRoutePage', () => {
			const route = '/test/route';
			contentActions.getRoutePage(route)(dispatch);
			expect(contentService.getRoutePage).toBeCalledWith(route);
		});

		it('should check if response has error code between 500 and 600', () => {
			contentService.getRoutePage = jest.fn(() => Promise.resolve({
				status: '500',
			}));
			const route = '/test/route';
			return contentActions.getRoutePage(route)(dispatch)
				.then(() => {
					expect(dispatch).toHaveBeenCalledWith(contentActions.loadRoutePageFail({
						error: '500',
						route,
					}));
				});
		});

		it('should dispatch "No content found at route" error', () => {
			contentService.getRoutePage = jest.fn(() => Promise.resolve({
				data: [],
			}));
			const route = '/test/route';
			return contentActions.getRoutePage(route)(dispatch)
				.then(() => {
					expect(dispatch).toHaveBeenCalledWith(contentActions.loadRoutePageFail({
						error: 'No content found at route',
						route,
					}));
				});
		});

		it('should dispatch loadRoutePageSuccess', () => {
			contentService.getRoutePage = jest.fn(() => Promise.resolve({
				data: [{ test: 'test' }],
			}));
			const route = '/test/route';
			return contentActions.getRoutePage(route)(dispatch)
				.then(() => {
					expect(dispatch).toHaveBeenCalledWith(contentActions.loadRoutePageSuccess({
						data: [{ test: 'test' }],
						route,
					}));
				});
		});
	});

});
