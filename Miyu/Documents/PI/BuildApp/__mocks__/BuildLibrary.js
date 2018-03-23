/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prop-types */
import {
	createElement,
	Component,
} from 'react';
import PropTypes from 'prop-types';

class ListView extends Component {
	static DataSource() {
		return {
			cloneWithRows: (_data) => ({
				_data,
				getRowCount: () => _data.length,
			}),
			cloneWithRowsAndSections: (_data) => ({
				_data,
				getRowCount: () => _data.length,
			}),
		};
	};
	scrollTo = jest.fn();
	render() {
		const { dataSource, renderRow } = this.props;
		return createElement('ListView', this.props, Array.isArray(dataSource._data) ? dataSource._data.map(renderRow) : this.props.children);
	}
}

class Pager extends Component {
	render() {
		return createElement('Pager', this.props, this.props.children);
	}
}

class ScrollView extends Component {
	static propTypes = {
		style: () => {},
	};
	scrollTo = jest.fn();
	render() {
		return createElement('ScrollView', this.props, this.props.children);
	}
}

class Text extends Component {
	static propTypes = {
		style: () => {},
	};
	render() {
		return createElement('Text', this.props, this.props.children);
	}
}

class TouchableOpacity extends Component {
	static propTypes = {
		children: PropTypes.any,
	};
	render() {
		return createElement('TouchableOpacity', this.props, this.props.children);
	}
}

module.exports = {
	ListView,
	Pager,
	ScrollView,
	Text,
	TouchableOpacity,
	Button: 'Button',
	CalendarPicker: 'CalendarPicker',
	IconButton: 'IconButton',
	Image: 'Image',
	ImageButton: 'ImageButton',
	KeyboardAwareView: 'KeyboardAwareView',
	KeyboardSpacer: 'KeyboardSpacer',
	LinkButton: 'LinkButton',
	Modal: 'Modal',
	ParallaxScrollView: 'ParallaxScrollView',
	QuantitySelector: 'QuantitySelector',
	TabbedPager: 'TabbedPager',
	TextInputWithButton: 'TextInputWithButton',
	Screen: 'Screen',
	withScreen: jest.fn(() => {
		return {
			displayName: 'withScreen',
		};
	}),
};
