module.exports = {
	Client: jest.fn(() => ({ leaveBreadcrumbs: jest.fn() })),
	Configuration: jest.fn(() => ({ })),
};
