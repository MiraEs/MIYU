const BuildNative = {
	Device: {
		isDebug: () => false,
		isTest: () => false,
		isBeta: () => false,
		isRelease: () => false,
		isMobile: () => false,
		is3dModelEnabled: () => false,
		isArKitEnabled: () => false,
	},
	LinkingManager: {
		openPhoneSettings: jest.fn(),
		openBuildAppSettings: jest.fn(() => Promise.resolve()),
	},
};

module.exports = BuildNative;
