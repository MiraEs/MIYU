
import {
	findNodeHandle,
	UIManager,
} from 'react-native';
import styles from './styles';

export default {

	scrollRefToKeyboard(scrollResponder, ref, options) {
		const defaultOptions = {
			offset: 67,
		};
		const settings = {
			...defaultOptions,
			...options,
		};
		scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
			findNodeHandle(ref),
			settings.offset,
			true,
		);
	},

	scrollChildToCenter(container, child) {

		function getXOffset(child, container) {
			const x = child.x - ((styles.dimensions.width - child.width) / 2);
			// is at the end of the list and will scroll past end
			if ((x + styles.dimensions.width) > container.width && container.width > styles.dimensions.width) {
				return container.width - styles.dimensions.width;
			} else if ((styles.dimensions.width - child.width) > child.x) {
				return 0;
			}
			return x;
		}

		if (child && container && container.getInnerViewNode) {
			UIManager.measure(container.getInnerViewNode(), (x, y, containerWidth) => {
				const containerDimensions = {
					width: containerWidth,
				};
				child.measureLayout(container.getInnerViewNode(), (x, y, width) => {
					const childDimensions = {
						x,
						width,
					};
					container.scrollTo({
						y: 0,
						x: getXOffset(childDimensions, containerDimensions),
						animated: true,
					});
				});
			});
		}
	},
};
