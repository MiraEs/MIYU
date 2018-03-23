module.exports = {
	isAvailable: jest.fn(() => {
		return new Promise((resolve) => {
			resolve();
		});
	}),
};
