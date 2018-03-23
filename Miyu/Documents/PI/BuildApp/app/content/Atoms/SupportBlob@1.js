import React, {
	Component,
	PropTypes,
} from 'react';
import { View } from 'react-native';
import TappableListItem from '../../components/TappableListItem';
import { withNavigation } from '@expo/ex-navigation';

class SupportBlob extends Component {

	handleFAQHeadingPress = () => {
		this.props.navigator.push('faqDetail', {
			...this.props,
		});
	};

	render() {
		const { renderAsFAQ, heading } = this.props;
		if (renderAsFAQ) {
			return (
				<TappableListItem
					body={heading.text}
					onPress={this.handleFAQHeadingPress}
				/>
			);
		}
		return (
			<View />
		);
	}

}

SupportBlob.propTypes = {
	renderAsFAQ: PropTypes.bool,
	heading: PropTypes.shape({
		text: PropTypes.string,
	}),
	navigator: PropTypes.shape({
		push: PropTypes.func,
	}),
};

SupportBlob.defaultProps = {};

export default withNavigation(SupportBlob);

