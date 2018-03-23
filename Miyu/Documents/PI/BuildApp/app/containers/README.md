# Containers / Screens

To add a navigation bar to your component define a static `route.navigationBar` property on the screen level component.

```js
ScreenLevelComponent.route = {
	navigationBar: {
		title: 'Page Title',
		renderRight() {
			return (
				<NavigationBarComponent />
			);
		},
	},
};
```

To adjust the transition animation for when you push this screen onto the route stack you can adjust it via NavigationStyles.

```js
import { NavigationStyles } from '@exponent/ex-navigation';
...
ScreenLevelComponent.route = {
	styles: {
		...NavigationStyles.SlideVertical,
		gestures: null, // this line stops modals from being closed by swiping down
	},
	navigationBar: {
		...
	},
};
```

To see all the options for navigation bar configuration please refer to the [ex-navigation docs](https://github.com/exponent/ex-navigation/blob/master/README.md).
