
jest.unmock('react-native');
import {
	LayoutAnimation,
	View,
} from 'react-native';
import React from 'react';

jest.mock('../../components/Form', () => 'Form');
jest.mock('../../components/FormInput', () => 'FormInput');
jest.mock('../../components/FormDropDown', () => 'FormDropDown');
jest.mock('../../services/SmartyStreets', () => ({}));
jest.mock('../../lib/styles');
jest.mock('BuildLibrary');
jest.mock('../../lib/eventEmitter', () => ({
	emit: jest.fn(),
	addListener: jest.fn(),
	removeListener: jest.fn(),
}));

import eventEmitter from '../../lib/eventEmitter';
import ScreenOverlay from '../ScreenOverlay';
import renderer from 'react-test-renderer';

const defaultProps = {};

describe('ScreenOverlay', () => {
	it('should render with default props', () => {
		const tree = renderer.create(
			<ScreenOverlay {...defaultProps} />
		);
		expect(tree.toJSON()).toMatchSnapshot();
	});
	it('should render isVisible=true', () => {
		const tree = renderer.create(
			<ScreenOverlay {...defaultProps} />
		);
		tree.getInstance().setState({
			isVisible: true,
		});
		expect(tree.toJSON()).toMatchSnapshot();
	});
	it('should handleBackPress', () => {
		const tree = renderer.create(
			<ScreenOverlay {...defaultProps} />
		);
		const result1 = tree.getInstance().handleBackPress();
		expect(result1).toEqual(false);
		tree.getInstance().setState({
			isVisible: true,
		});
		const result2 = tree.getInstance().handleBackPress();
		expect(result2).toEqual(true);
	});

	it('should render with default configuration', () => {
		const tree = renderer.create(
			<ScreenOverlay {...defaultProps} />
		);
		tree.getInstance().setConfigurationDefault(<View />);
		expect(tree).toMatchSnapshot();
	});

	it('should render with component and animation configurations', () => {
		const configureNextSpy = spyOn(LayoutAnimation, 'configureNext');
		const tree = renderer.create(
			<ScreenOverlay {...defaultProps} />
		);
		tree.getInstance().setConfiguration({
			component: <View />,
			animation: LayoutAnimation.Presets.spring,
		});
		expect(configureNextSpy).toBeCalledWith(LayoutAnimation.Presets.spring);
	});

	it('should call screenOverlayClosed when clicking to hide', () => {
		const tree = renderer.create(
			<ScreenOverlay {...defaultProps} />
		);
		tree.getInstance().clickToHide();
		expect(eventEmitter.emit).toBeCalledWith('screenOverlayClosed');
	});

	it('should call removeListener on unmount', () => {
		const tree = renderer.create(
			<ScreenOverlay {...defaultProps} />
		);
		tree.unmount();
		expect(eventEmitter.removeListener).toBeCalled();
	});
});
