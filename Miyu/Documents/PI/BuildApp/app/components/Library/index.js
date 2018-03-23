/**
 * @providesModule BuildLibrary
 */

const BuildLibrary = {
	get Image() { return require('./Image/Image').default; },
	get Text() { return require('./Text/Text').default; },
	get Button() { return require('./Button/Button').default; },
	get CalendarPicker() { return require('./Calendar/CalendarPicker').default; },
	get InputAccessoryView() { return require('./Form/InputAccessoryView').default; },
	get KeyboardSpacer() { return require('./View/KeyboardSpacer').default; },
	get LinkButton() { return require('./Button/LinkButton').default; },
	get ListView() { return require('./Scrollable/ListView').default; },
	get ScrollView() { return require('./Scrollable/ScrollView').default; },
	get ImageButton() { return require('./Button/ImageButton').default; },
	get IconButton() { return require('./Button/IconButton').default; },
	get GridView() { return require('./GridView/GridView').default; },
	get Screen() { return require('./Screen/Screen').default; },
	get withScreen() { return require('./Screen/withScreen').default; },
	get KeyboardAwareView() { return require('./View/KeyboardAwareView').default; },
	get TouchableOpacity() { return require('./Touchable/TouchableOpacity').default; },
	get QuantitySelector() { return require('./QuantitySelector/QuantitySelector').default; },
	get TextInputWithButton() { return require('./Text/TextInputWithButton').default; },
	get ParallaxScrollView() { return require('./Scrollable/ParallaxScrollView').default; },
	get Pager() { return require('./Pager/Pager').default; },
	get TabbedPager() { return require('./Pager/TabbedPager').default; },
};

module.exports = BuildLibrary;
