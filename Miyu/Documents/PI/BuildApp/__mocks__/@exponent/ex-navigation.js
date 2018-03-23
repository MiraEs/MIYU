// this file runs before everything else to set up some global mocks for jest

jest.mock('@expo/ex-navigation', () => ({
	createNavigationEnabledStore: () => { return jest.fn(); },
	createRouter: jest.fn((routes) => routes()),
	NavigationStyles: {
		SlideVertical: {
			sceneAnimations: jest.fn(),
		},
	},
	NavigationActions: {
		popToTop: jest.fn(),
	},
	NavigationContext: jest.fn(),
	NavigationProvider: 'NavigationProvider',
	withNavigation: jest.fn(),
}));
jest.mock('../../app/services/httpClient');
jest.mock('BuildNative');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('BuildLibrary');
jest.mock('../../app/lib/styles');
jest.unmock('react-native');
