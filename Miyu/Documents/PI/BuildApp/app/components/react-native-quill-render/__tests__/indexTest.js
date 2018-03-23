import index from '../index';

describe('index', () => {
	it('should export QuillRenderer', () => {
		expect(typeof index).toEqual('function');
	});
});
