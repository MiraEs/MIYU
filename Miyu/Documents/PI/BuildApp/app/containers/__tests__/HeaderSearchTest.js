
jest.mock('../../../app/services/httpClient', () => ({}));
jest.mock('../../../app/store/configStore', () => ({}));
jest.mock('../../../app/lib/analytics/tracking');
jest.mock('redux', () => ({
	bindActionCreators: jest.fn(),
}));
jest.mock('BuildNative');
jest.mock('BuildLibrary');
jest.mock('../../../app/components/Form', () => 'Form');
jest.mock('../../../app/components/FormInput', () => 'FormInput');
jest.mock('../../../app/content/Atoms/AtomText@1', () => 'AtomText');
jest.mock('../../../app/components/TappableListItem', () => 'TappableListItem');
jest.mock('../../../app/components/TypeAhead', () => 'TypeAhead');
jest.mock('../../../app/router', () => ({}));
jest.mock('../../../app/lib/styles');
jest.mock('UIManager', () => ({
	configureNextLayoutAnimation: jest.fn(),
}));
jest.mock('Dimensions', () => ({
	get: jest.fn(),
}));
jest.mock('PixelRatio', () => ({
	get: jest.fn(),
	roundToNearestPixel: jest.fn(),
}));
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.unmock('react-native');
import 'react-native';
import React from 'react';
import { HeaderSearch } from '../HeaderSearch';

const defaultProps = {
	actions: {
		typeAhead: jest.fn(),
		trackState: jest.fn(),
	},
};

const renderHeaderSearchWithProps = function(props = defaultProps) {
	const ShallowRenderer = require('react-test-renderer/shallow');
	const renderer = new ShallowRenderer();
	renderer.render(<HeaderSearch {...props} />);
	return renderer;
};

describe('Header Search component', () => {

	// Doing this resolves this error:
	//
	// Invariant Violation: ReactCompositeComponent:
	// injectEnvironment() can only be called once."
	//
	// This error is caused by trying to import react-test-renderer and enzyme at
	// the top of this test file
	//
	// Supposedly this is a bug in React and is resolved in React 15.4.0
	// https://github.com/facebook/jest/issues/1353#issuecomment-260968365
	beforeEach(() => jest.resetModules());

	it('should render a TouchableHighlight', () => {
		const tree = require('react-test-renderer').create(
			<HeaderSearch {...defaultProps} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should show search button if hidden and allow full collapse', () => {
		const tree = require('react-test-renderer').create(
			<HeaderSearch
				{...defaultProps}
				startHidden={true}
				allowFullCollapse={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should populate searchBoxText when passing in searchKeyword prop', () => {
		const tree = require('react-test-renderer').create(
			<HeaderSearch
				{...defaultProps}
				searchKeyword="test"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should populate searchBoxText when passing in searchKeyword prop', () => {
		const tree = require('react-test-renderer').create(
			<HeaderSearch
				{...defaultProps}
				searchKeyword="test"
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should change the searchbox text when updateInput is called', () => {
		const result = renderHeaderSearchWithProps();
		const instance = result._instance;
		expect(instance.state.searchBoxText).toEqual('');
		instance.updateInput('test');
		expect(instance.state.searchBoxText).toEqual('test');
	});

	it('should show the input bar on click if hidden', () => {
		const result = renderHeaderSearchWithProps({
			startHidden: true,
			allowFullCollapse: true,
		});
		const instance = result._instance;
		expect(instance.state.hidden).toEqual(true);
		instance.showSearch();
		expect(instance.state.hidden).toEqual(false);
	});

	it('shows the input bar when clicking if hidden and hides on submit', () => {
		const result = renderHeaderSearchWithProps({
			startHidden: true,
			allowFullCollapse: true,
		});
		const instance = result._instance;
		instance.showSearch();
		expect(instance.state.hidden).toEqual(false);
		instance.handleSubmit();
		expect(instance.state.hidden).toEqual(true);
	});

});
