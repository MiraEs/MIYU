import utils from '../utils';

const blot1 = {
	insert: 'test',
};

const blot2 = {
	insert: 'this is\na\n\ntest',
};

const blots = [blot1, blot2];

describe('utils', () => {
	describe('contains', () => {
		it('should return true if string contains', () => {
			const result = utils.contains(blot1.insert, 'te');
			expect(result).toEqual(true);
		});
		it('should return false if string does not contain', () => {
			const result = utils.contains(blot1.insert, 'to');
			expect(result).toEqual(false);
		});
	});
	describe('expandBlots', () => {
		it('should flatten out blots with multiple new line characters', () => {
			const result = utils.expandBlots(blots);
			expect(result).toMatchSnapshot();
		});
	});
	describe('splitIntoBlocks', () => {
		it('should split bolts into blocks', () => {
			const expandedBlots = [{
				'insert': 'test',
			}, {
				'insert': 'this is\n',
			}, {
				'insert': 'a\n',
			}, {
				'insert': '\n',
			}];
			const result = utils.splitIntoBlocks(expandedBlots);
			expect(result).toMatchSnapshot();
		});
		it('should handle', () => {
			const expandedBlots = [{
				'insert': 'test',
			}, {
				'insert': 'this is\n',
			}, {
				'insert': 'a\n',
			}, {
				'insert': '\n',
			}, {
				'insert': 'test',
			}];
			const result = utils.splitIntoBlocks(expandedBlots);
			expect(result).toMatchSnapshot();
		});
	});
});
