'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { Text } from 'BuildLibrary';
import { escapeRegex } from '../lib/helpers';


class TextHighlighter extends Component {

	constructor(props) {
		super(props);
		this.renderTextHighlighter = this.renderTextHighlighter.bind(this);
	}

	renderTextHighlighter() {
		const { fullText, textToMatch } = this.props;
		const split = fullText.split(new RegExp(escapeRegex(textToMatch), 'i'));
		let matchedSplits = [];
		let stringIndex = 0;
		split.forEach((fragment, index) => {
			if (fragment === '' && stringIndex === 0) {
				matchedSplits.push({
					isHighlighted: true,
					fragment: fullText.substr(stringIndex, textToMatch.length),
				});
				stringIndex = stringIndex + textToMatch.length;
			} else if (index !== split.length - 1) {
				matchedSplits = matchedSplits.concat([{
					isHighlighted: false,
					fragment,
				}, {
					isHighlighted: true,
					fragment: fullText.substr(stringIndex + fragment.length, textToMatch.length),
				}]);
				stringIndex = stringIndex + fragment.length + textToMatch.length;
			} else if (fragment !== '') {
				matchedSplits.push({
					isHighlighted: false,
					fragment,
				});
			}
		});
		return matchedSplits.map((text, index) => {
			if (text.isHighlighted) {
				return (
				<Text
					key={index}
					weight="bold"
				>
					{text.fragment}
				 </Text>);
			} else {
				return <Text key={index}>{text.fragment}</Text>;
			}
		});
	}

	render() {
		const { fullText, textToMatch } = this.props;
		const matchIndex = fullText.toLowerCase().indexOf(textToMatch.toLowerCase());
		if (matchIndex === -1) {
			return <Text>{fullText}</Text>;
		} else {
			return <Text>{this.renderTextHighlighter()}</Text>;
		}
	}

}

TextHighlighter.propTypes = {
	fullText: PropTypes.string.isRequired,
	textToMatch: PropTypes.string.isRequired,
	style: PropTypes.object,
};

TextHighlighter.defaultProps = {
	fullText: '',
	textToMatch: '',
	style: {
		text: {},
		highlight: {},
		normal: {},
	},
};

export default TextHighlighter;
