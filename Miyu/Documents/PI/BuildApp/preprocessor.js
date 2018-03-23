const babelJest = require('babel-jest');

module.exports = {
	process(src, filename) {
		if (filename.match(/\.png/)) {
			return '';
		}
		return babelJest.process(src, filename);
	},
};
