import React from 'react';
import PropTypes from 'prop-types';
import ReactNative, {
	ViewPropTypes,
} from 'react-native';

class ScrollView extends React.Component {

	getScrollResponder() {
		if (this.scrollView) {
			return this.scrollView.getScrollResponder();
		}
	}

	getScrollableNode() {
		if (this.scrollView) {
			return this.scrollView.getScrollableNode();
		}
	}

	scrollTo(coordinates) {
		if (this.scrollView) {
			return this.scrollView.scrollTo(coordinates);
		}
	}

	getInnerViewNode() {
		if (this.scrollView) {
			return this.scrollView.getInnerViewNode();
		}
	}

	render() {
		const props = {
			...this.props,
			removeClippedSubviews: this.props.removeClippedSubviews !== undefined ? this.props.removeClippedSubviews : false,
		};
		return (
			<ReactNative.ScrollView
				{...props}
				ref={(scrollView) => {
					if (scrollView) {
						this.scrollView = scrollView;
					}
				}}
			/>
		);
	}

}

ScrollView.propTypes = {
	style: ViewPropTypes.style,
	removeClippedSubviews: PropTypes.bool,
};

ScrollView.defaultProps = {
	scrollsToTop: false,
};

export default ScrollView;
