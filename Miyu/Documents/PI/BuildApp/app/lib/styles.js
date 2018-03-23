import {
	StyleSheet,
} from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import Dimensions from 'Dimensions';
const dimensions = {
	width,
	height,
} = Dimensions.get('window');
const imageDimensions = ((width - 20) / 3) - (20 / 3);
const iOSBottomBarHeight = 48;

const headerStyleSheet = Navigator.NavigationBar.Styles;
const tapSizeSmall = 37;
const tapSizeMedium = 44;

dimensions.borderWidth = 1;
dimensions.borderWidthLarge = 2;
dimensions.iosBottomBarHeight = iOSBottomBarHeight;
dimensions.imageDimensions = imageDimensions;
dimensions.bottomBarHeight = 66;
dimensions.tapSizeSmall = tapSizeSmall;
dimensions.tapSizeMedium = tapSizeMedium;

const colors = {
	// Build.com theme colors
	primary: '#00A499',
	primaryRGB: '0,164,153,1',
	primaryLight: '#CCEEEC',
	primaryDark: '#018F85',
	secondary: '#63666A',
	accent: '#D45D00',
	grey: '#D0D3D4',
	greyLight: '#EBEDEF',
	greyDark: '#B1B2B4',
	grey20: '#333333',
	underlayGrey: 'rgba(0, 0, 0, 0.5)',
	error: '#A94442',
	translucentWhite: 'rgba(255,255,255,0.8)',
	none: 'transparent',
	// all colors below are from before the rebranding colors were defined
	darkBlue: '#235a76',
	white: '#FFFFFF',
	black: '#000000',
	lightGray: '#F2F2F2',
	mediumGray: '#acabab',
	mediumDarkGray: '#7A7A7A',
	iOSDivider: '#c8c7cc',
	facebookBlue: '#2C4388',
	facebookBlueDark: '#001055', // 20% darker than facebookBlue
	eventFeedBackground: '#e1e1e1',
};

const fonts = {
	mainRegular: 'ProximaNova-Regular',
	regularItalics: 'ProximaNova-RegularIt',
	mainBold: 'ProximaNova-Bold',
	archerRegular: 'Archer-Medium',
	archerBold: 'Archer-Bold',
	archerItalics: 'Archer-MediumItalic',
};

const text = {
	center: {
		textAlign: 'center',
	},
	bold: {
		fontWeight: '700',
		fontFamily: fonts.mainBold,
	},
	semiBold: {
		fontWeight: '600',
		fontFamily: fonts.mainBold,
	},
	error: {
		color: colors.error,
		fontFamily: fonts.mainRegular,
	},
	errorText: {
		color: colors.error,
		fontFamily: fonts.mainRegular,
	},
	mediumGray: {
		color: colors.mediumGray,
	},
	mediumDarkGray: {
		fontFamily: fonts.mainRegular,
		color: colors.mediumDarkGray,
	},
	default: {
		fontFamily: fonts.mainRegular,
	},
	italics: {
		fontFamily: fonts.regularItalics,
		fontStyle: 'italic',
	},
};

const adjustOpacity = {
	opacity: 0.5,
};

const measurements = {
	borderRadius: 3,
	gridSpace1: 8,
	gridSpace2: 16,
	gridSpace3: 24,
	gridSpace4: 32,
	gridSpace5: 40,
	gridSpace6: 48,
	gridSpace9: 72,
};

const fontSize = {
	xsmall: 11,
	small: 13,
	regular: 16,
	large: 19,
	larger: 22,
	xlarge: 32,
};

const lineHeight = {
	xsmall: 14,
	small: 21,
	regular: 21,
	large: 28,
	larger: 28,
	xlarge: 28,
};

const NUMBER_OF_TABS = 5;

const elements = {
	badgeIconPosition: {
		top: 5,
		right: ((dimensions.width / NUMBER_OF_TABS) - 27) / 2 - 6,
	},
	navigationBarTitle: {
		...text.bold,
		fontSize: fontSize.regular,
	},
	navigationBarTitleDark: {
		color: colors.white,
	},
	navigationBarTitleLight: {
		color: colors.secondary,
	},
	strikeOutText: {
		textDecorationLine: 'line-through',
		...text.mediumGray,
	},
	titleTextRegular: {
		...text.bold,
		fontSize: fontSize.regular,
	},
	titleTextSmall: {
		...text.bold,
		fontSize: fontSize.small,
	},
	titleTextLarge: {
		fontSize: fontSize.large,
		...text.bold,
		color: colors.secondary,
		lineHeight: lineHeight.large,
	},
	lightText: {
		fontSize: fontSize.regular,
		color: colors.grey,
		...text.default,
		lineHeight: lineHeight.regular,
	},
	boldText: {
		...text.bold,
		fontSize: fontSize.regular,
		color: colors.secondary,
		lineHeight: lineHeight.regular,
	},
	text: {
		fontSize: fontSize.regular,
		...text.default,
		color: colors.secondary,
		lineHeight: lineHeight.regular,
	},
	smallText: {
		fontSize: fontSize.small,
		...text.default,
		color: colors.secondary,
		lineHeight: lineHeight.small,
	},
	largeText: {
		fontSize: fontSize.large,
		...text.default,
		color: colors.secondary,
		lineHeight: lineHeight.large,
	},
	textItalicsSmall: {
		...text.italics,
		color: colors.secondary,
		fontSize: fontSize.small,
		lineHeight: fontSize.lineHeightRegular,
	},
	centeredFlexRow: {
		flexShrink: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	centeredFlexColumn: {
		flexDirection: 'column',
		alignItems: 'center',
	},
	leftFlexRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	rightFlextRow: {
		flexDirection: 'row',
		alignItems: 'flex-end',
	},
	tabBar: {
		borderTopWidth: dimensions.borderWidth,
		borderColor: colors.mediumDarkGray,
		paddingVertical: measurements.gridSpace1,
	},
	fetchErrorView: {
		backgroundColor: colors.primaryLight,
		borderBottomWidth: dimensions.borderWidth,
		borderBottomColor: colors.grey,
	},
	fetchErrorText: {
		fontSize: 11,
		margin: measurements.gridSpace1,
		textAlign: 'center',
		color: colors.secondary,
	},
	screen: {
		flex: 1,
		backgroundColor: colors.white,
	},
	screenGreyLight: {
		backgroundColor: colors.greyLight,
		flex: 1,
	},
	flex: {
		flexGrow: 1,
	},
	flex1: {
		flex: 1,
	},
	noFlex: {
		flex: 0,
	},
	flexRow: {
		flexDirection: 'row',
	},
	screenWithHeader: {
		flex: 1,
		backgroundColor: colors.white,
	},
	screenWithHeaderGreyLight: {
		flex: 1,
		backgroundColor: colors.greyLight,
	},
	header: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
	},
	screenWithFixedBottomButton: {
		paddingBottom: tapSizeMedium,
	},
	formInput: {
		width: width - 20,
		height: tapSizeMedium,
		paddingHorizontal: measurements.gridSpace2,
		fontSize: 16,
		justifyContent: 'center',
		backgroundColor: colors.white,
		fontFamily: fonts.mainRegular,
	},
	inputGroup: {
		backgroundColor: colors.white,
		borderWidth: dimensions.borderWidth,
		borderColor: colors.grey,
		shadowColor: colors.grey,
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.6,
	},
	inputGroupItem: {
		fontFamily: fonts.mainRegular,
		paddingHorizontal: measurements.gridSpace2,
		height: tapSizeMedium,
		fontSize: 16,
		backgroundColor: colors.white,
		color: colors.secondary,
	},
	inputGroupDivider: {
		borderBottomWidth: dimensions.borderWidth,
		borderBottomColor: colors.iOSDivider,
	},
	row: {
		backgroundColor: colors.white,
		padding: measurements.gridSpace2,
		borderBottomWidth: dimensions.borderWidth,
		borderBottomColor: colors.iOSDivider,
		flexDirection: 'row',
		alignItems: 'center',
	},
	evenItemRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	center: {
		textAlign: 'center',
	},
	centerAll: {
		textAlign: 'center',
		alignSelf: 'center',
	},
	centerItem: {
		alignItems: 'center',
	},
	tabBarItem: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 30,
		paddingHorizontal: 10,
	},
	link: {
		color: colors.primary,
		fontFamily: fonts.mainRegular,
	},
	centering: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	listHeader: {
		margin: measurements.gridSpace1,
		marginTop: measurements.gridSpace2,
		letterSpacing: 1,
	},
	mainFont: {
		fontFamily: fonts.mainRegular,
	},
	padding1: {
		padding: measurements.gridSpace1,
	},
	paddingHorizontal: {
		paddingHorizontal: measurements.gridSpace1,
	},
	paddingTop: {
		paddingTop: measurements.gridSpace1,
	},
	paddingBottom: {
		paddingBottom: measurements.gridSpace1,
	},
	paddingLeft: {
		paddingLeft: measurements.gridSpace1,
	},
};

const buttons = {
	small: {
		height: tapSizeSmall,
	},
	regular: {
		height: tapSizeMedium,
	},
	large: {
		height: 70,
	},
};

const images = {
	list: {
		height: 42,
		width: 42,
	},
};

const photoGrid = {
	row: {
		flexDirection: 'row',
		paddingTop: measurements.gridSpace1,
		paddingLeft: measurements.gridSpace1,
		flexWrap: 'wrap',
	},
	thumbnailContainer: {
		height: imageDimensions,
		width: imageDimensions,
		marginBottom: measurements.gridSpace1,
		marginLeft: measurements.gridSpace1,
	},
	thumbnails: {
		height: imageDimensions,
		width: imageDimensions,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: measurements.gridSpace1,
	},
	cameraIcon: {
		height: 55,
		color: colors.primary,
	},
};

const feedEvents = {
	background: {
		backgroundColor: colors.greyLight,
	},
	section: {
		marginRight: measurements.gridSpace1,
		marginLeft: measurements.gridSpace1,
		marginBottom: measurements.gridSpace1,
		backgroundColor: colors.white,
		shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
	},
	bottomLink: {
		color: colors.primary,
		marginTop: measurements.gridSpace1,
	},
	padding: {
		padding: measurements.gridSpace2,
	},
	heading: {
		flex: 1,
		flexDirection: 'row',
	},
	headingText: {
		alignSelf: 'center',
		paddingLeft: measurements.gridSpace1,
		flex: 1,
	},
	eventDetails: {
		fontWeight: 'normal',
		fontSize: 13,
		color: colors.mediumDarkGray,
		fontFamily: fonts.mainRegular,
	},
	headerTimeStamp: {
		color: colors.mediumDarkGray,
		fontSize: 13,
		fontFamily: fonts.mainRegular,
	},
	creator: {
		fontWeight: '700',
		color: '#353535',
		flex: 1,
		fontFamily: fonts.mainBold,
	},
	boldGray: {
		fontFamily: fonts.mainBold,
		fontWeight: '700',
		color: '#909090',
	},
	icon: {
		width: 40,
		height: 40,
	},
	postText: {
		color: '#000',
		fontSize: 18,
		marginHorizontal: measurements.gridSpace2,
		marginBottom: measurements.gridSpace2,
		fontFamily: fonts.mainRegular,
	},
};
exports.headerStyleSheet = headerStyleSheet;
exports.adjustOpacity = adjustOpacity;
exports.colors = colors;
exports.elements = StyleSheet.create(elements);
exports.feedEvents = StyleSheet.create(feedEvents);
exports.measurements = measurements;
exports.images = images;
exports.photoGrid = StyleSheet.create(photoGrid);
exports.text = StyleSheet.create(text);
exports.fonts = fonts;
exports.fontSize = fontSize;
exports.lineHeight = lineHeight;
exports.dimensions = dimensions;
exports.buttons = buttons;
