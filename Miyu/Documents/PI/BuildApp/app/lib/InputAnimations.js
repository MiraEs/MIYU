// these functions allow inputs wrapped in a ScrollView to scroll into view
// when the keyboard appears/disappears
// example usage (note the ref on the ScrollView):
// <ScrollView
// 	style={componentStyles.formContent}
// 	ref={(ref) => this.scrollView = ref}>
// 	<FormInput
// 		onFocus={inputFocused.bind(this)}
// 		onBlur={inputBlurred.bind(this)}/>
// </ScrollView>

import { findNodeHandle } from 'react-native';
import { isIOS } from './helpers';

export function inputFocused(ref, scrollView = this.scrollView, offset = 67) {
	if (isIOS() && scrollView && ref) {
		setTimeout(() => {
			const scrollResponder = scrollView.getScrollResponder();
			scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
				findNodeHandle(ref),
				offset,
				true,
			);
		}, 50);
	}
}

export function inputBlurred(ref, scrollView = this.scrollView) {
	if (isIOS() && scrollView && ref) {
		setTimeout(() => {
			const scrollResponder = scrollView.getScrollResponder();
			scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
				findNodeHandle(ref),
				100,
				true,
			);
		}, 50);
	}
}
