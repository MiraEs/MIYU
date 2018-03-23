/* eslint-disable react/no-multi-comp */
import {
	createElement,
	Component,
} from 'react';
import PropTypes from 'prop-types';
const ReactNative = jest.genMockFromModule('react-native');

ReactNative.StyleSheet = {
	create: function create(styles) {
		return styles;
	},
	flatten: function flatten(...styles) {
		return Object.assign({}, ...styles);
	},
};

ReactNative.PixelRatio = {
	get() {
		return 1;
	},
};

ReactNative.Alert = {
	alert: jest.fn(),
};

ReactNative.StatusBar = {
	setBarStyle: jest.fn(),
	setHidden: jest.fn(),
};

ReactNative.Linking = {
	openURL: jest.fn(),
};

ReactNative.NativeModules = {
	PhotoUploader: {},
	SafariViewManager: {},
	UIManager: {
		measure: jest.fn(),
	},
	MarketingCloud: {
		trackAction: jest.fn(),
		trackState: jest.fn(),
	},
	LocalyticsManager: {
		tagScreen: jest.fn(),
		tagEvent: jest.fn(),
		tagCustomerLoggedOut: jest.fn(),
	},
	Instabug: {
		log: jest.fn(),
	},
	BNDevice: {},
	RNApplePayManager: {
		canMakePayments: jest.fn(() => Promise.resolve(true)),
		canMakePaymentsUsingNetworks: jest.fn(() => Promise.resolve(true)),
		paymentRequest: jest.fn(),
		paymentRequestDidFinish: jest.fn(),
		updateShippingMethods: jest.fn(),
		selectShippingMethod: jest.fn(),
		authorizedPayment: jest.fn(),
	},
};

ReactNative.requireNativeComponent = jest.fn();

ReactNative.NetInfo = {
	isConnected: {
		fetch: jest.fn(() => ({ done: jest.fn() })),
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
	},
};

ReactNative.AppState = {
	addEventListener: jest.fn(),
};

ReactNative.CameraRoll = {
	getPhotos: jest.fn(() => Promise.resolve([])),
};

ReactNative.PushNotificationIOS = {
	setApplicationIconBadgeNumber: jest.fn(),
};

ReactNative.Keyboard = {
	dismiss: jest.fn(),
};

ReactNative.findNodeHandle = jest.fn();

ReactNative.ViewPropTypes = {
	style: jest.fn(),
};

ReactNative.NativeEventEmitter = class NativeEventEmitter {
	addListener = jest.fn(() => ({ remove: jest.fn() }));
};

class FlatList extends Component {
	render() {
		return createElement('FlatList', this.props);
	}
}

class SectionList extends Component {
	render() {
		return createElement('SectionList', this.props);
	}
}

class View extends Component {
	static propTypes = {
		children: PropTypes.any,
		style: () => {},
	};
	render() {
		return createElement('View', this.props, this.props.children);
	}
}

class ScrollView extends Component {
	static propTypes = {
		children: PropTypes.any,
		style: () => {},
	};
	render() {
		return createElement('ScrollView', this.props, this.props.children);
	}
}

class Switch extends Component {
	render() {
		return createElement('Switch');
	}
}

class Text extends Component {
	static propTypes = {
		children: PropTypes.any,
		style: () => {},
	};
	render() {
		return createElement('Text', this.props, this.props.children);
	}
}

class TextInput extends Component {
	static propTypes = {
		children: PropTypes.any,
	};
	render() {
		return createElement('TextInput', this.props, this.props.children);
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

class TouchableWithoutFeedback extends Component {
	static propTypes = {
		children: PropTypes.any,
	};
	render() {
		return createElement('TouchableWithoutFeedback', this.props, this.props.children);
	}
}

class ToolbarAndroid extends Component {
	static propTypes = {
		children: PropTypes.any,
	};
	render() {
		return createElement('ToolbarAndroid', this.props, this.props.children);
	}
}

class Image extends Component {
	static propTypes = {
		children: PropTypes.any,
		style: () => {},
	};
	render() {
		return createElement('Image', this.props, this.props.children);
	}
}

class Icon extends Component {
	static propTypes = {
		children: PropTypes.any,
	};
	render() {
		return createElement('Icon', this.props, this.props.children);
	}
}

class ActivityIndicator extends Component {
	static propTypes = {
		children: PropTypes.any,
	};
	render() {
		return createElement('ActivityIndicator', this.props, this.props.children);
	}
}

ReactNative.Platform = {
	OS: 'ios',
	select: jest.fn((options) => options.ios),
};

ReactNative.InteractionManager = {
	runAfterInteractions: jest.fn(),
};

ReactNative.ActionSheetIOS = {
	showActionSheetWithOptions: jest.fn(),
};

class ListView extends Component {
	DataSource() {
		return {
			cloneWithRows: jest.fn(),
			cloneWithRowsAndSections: jest.fn(),
		};
	}
}

class AppRegistry {
	registerComponent() {}
}

class TouchableHighlight extends Component {
	static propTypes = {
		children: PropTypes.any,
	};
	render() {
		return createElement('TouchableHighlight', this.props, this.props.children);
	}
}
class BackHandler extends Component {
	static addEventListener() {}
	static exitApp() {}
	static removeEventListener() {}
}

class TouchableNativeFeedback extends Component {
	static Ripple() {
	}
}

class Navigator extends Component {
	render() {
	}
}

class RefreshControl extends Component {
	render() {
		return createElement('RefreshControl', this.props);
	}
}

class LayoutAnimation extends Component {
	static configureNext() {
	};

	static Presets() {
		return {
			easeInEaseOut: jest.fn(),
		};
	};
}

class Dimensions {
	static get() {
		return 0;
	}
}

class Animated extends Component {

	static Value() {
		return {
			getLayout: () => {},
			interpolate: () => {},
			setOffset: () => {},
			setValue: () => {},
		};
	}

	static ValueXY() {
		return {
			getLayout: () => {},
			interpolate: () => {},
			setOffset: () => {},
			setValue: () => {},
		};
	}

	static event() {}
}

class AnimatedView extends Component {
	render() {
		return createElement('AnimatedView');
	}
}

class AnimatedImage extends Component {

}

class AnimatedText extends Component {

}

Animated.View = AnimatedView;

Animated.Image = AnimatedImage;

Animated.Text = AnimatedText;

class PanResponder {
	static create() {
		return {panHandlers: {}};
	}
}

global.__fbBatchedBridgeConfig = {
	remoteModuleConfig: [],
	localModulesConfig: [],
};

ReactNative.View = View;
ReactNative.ScrollView = ScrollView;
ReactNative.FlatList = FlatList;
ReactNative.ListView = ListView;
ReactNative.Text = Text;
ReactNative.TextInput = TextInput;
ReactNative.TouchableOpacity = TouchableOpacity;
ReactNative.TouchableHighlight = TouchableHighlight;
ReactNative.TouchableWithoutFeedback = TouchableWithoutFeedback;
ReactNative.ToolbarAndroid = ToolbarAndroid;
ReactNative.Image = Image;
ReactNative.AppRegistry = AppRegistry;
ReactNative.Icon = Icon;
ReactNative.ActivityIndicator = ActivityIndicator;
ReactNative.BackHandler = BackHandler;
ReactNative.TouchableNativeFeedback = TouchableNativeFeedback;
ReactNative.Navigator = Navigator;
ReactNative.RefreshControl = RefreshControl;
ReactNative.LayoutAnimation = LayoutAnimation;
ReactNative.Dimensions = Dimensions;
ReactNative.Animated = Animated;
ReactNative.PanResponder = PanResponder;
ReactNative.SectionList = SectionList;
ReactNative.Switch = Switch;

module.exports = ReactNative;
