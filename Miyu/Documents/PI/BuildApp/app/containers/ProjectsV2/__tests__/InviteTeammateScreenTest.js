jest.mock('../../../lib/analytics/tracking');
jest.unmock('react-native');
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('react-native-deprecated-custom-components', () => ({
	Navigator: {
		NavigationBar: {
			Styles: {},
		},
	},
}));
jest.mock('Dimensions', () => ({
	get: () => ({}),
}));
jest.mock('../../../components/ErrorText', () => 'ErrorText');
jest.mock('../../../actions/TeamActions', () => ({
	sendProjectInvites: jest.fn(),
}));
jest.mock('../../../components/TappableListItem', () => 'TappableListItem');
jest.mock('../../../lib/analytics/TrackingActions');
jest.mock('../../../components/InviteContactForm', () => 'InviteContactForm');
jest.mock('../../../components/FixedBottomButton', () => 'FixedBottomButton');
jest.mock('../../../lib/Permissions');
jest.mock('react-redux');
jest.mock('redux');
jest.mock('../../../lib/eventEmitter');
jest.mock('../../../lib/styles');
jest.mock('../../../lib/helpers');
jest.mock('@expo/ex-navigation', () => ({
	withNavigation: jest.fn(),
}));
jest.mock('../../../styles/navigationBarStyles', () => ({
	navigationBarDark: {},
}));
jest.mock('../../../actions/AlertActions', () => ({
	showAlert: jest.fn(),
}));

import { InviteTeammateScreen } from '../InviteTeammateScreen';
import React from 'react';

const defaultProps = {
	actions: {
		sendProjectInvites: jest.fn(),
	},
	inviteeError: '',
	navigator: {
		push: jest.fn(),
	},
	projectId: 0,
};

describe('InviteTeammateScreen component', () => {
	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<InviteTeammateScreen {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});
});

describe('InviteTeammateScreen function tests', () => {
	it('should return the screen tracking info', () => {
		const tree = require('react-test-renderer').create(
			<InviteTeammateScreen {...defaultProps} />
		).getInstance().setScreenTrackingInformation();
		expect(tree).toMatchSnapshot();
	});
});
