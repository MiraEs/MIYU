import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text,
} from 'react-native';
import QuillHeading from './QuillHeading';
import QuillOrderedListItem from './QuillOrderedListItem';
import QuillUnorderedListItem from './QuillUnorderedListItem';
import QuillInline from './QuillInline';
import utils from './utils';

class QuillRenderer extends Component {

	static propTypes = {
		data: PropTypes.array,
		textColor: PropTypes.string,
		linkColor: PropTypes.string,
		textSize: PropTypes.number,
		heading1Size: PropTypes.number,
		heading2Size: PropTypes.number,
		heading3Size: PropTypes.number,
		heading4Size: PropTypes.number,
		heading5Size: PropTypes.number,
		heading6Size: PropTypes.number,
		listIndent: PropTypes.number,
		onLinkPress: PropTypes.func,
	};

	static defaultProps = {
		textColor: 'red',
		linkColor: '#06c06c',
		textSize: 16,
		heading1Size: 26,
		heading2Size: 24,
		heading3Size: 22,
		heading4Size: 20,
		heading5Size: 18,
		heading6Size: 16,
		listIndent: 10,
	};

	isPreviousBlockOrdered = false;
	previousOrderedListNumber = 0;

	normalizeBlots = (blots) => {
		const expanded = utils.expandBlots(blots);
		const blocks = utils.splitIntoBlocks(expanded);
		return blocks;
	};

	getNextOrderedListNumber = () => {
		if (this.isPreviousBlockOrdered && this.previousOrderedListNumber) {
			return this.previousOrderedListNumber;
		}
	}

	updateOrderedListStatus = (attributes) => {
		if (attributes && attributes.list === 'ordered') {
			this.isPreviousBlockOrdered = true;
			this.previousOrderedListNumber = this.previousOrderedListNumber + 1;
		} else {
			this.isPreviousBlockOrdered = false;
			this.previousOrderedListNumber = 0;
		}
	};

	getProps = (attributes = {}) => {
		const {
			linkColor,
			textColor,
			textSize,
			heading1Size,
			heading2Size,
			heading3Size,
			heading4Size,
			heading5Size,
			heading6Size,
			listIndent,
			onLinkPress,
		} = this.props;
		return {
			linkColor,
			textColor,
			textSize,
			heading1Size,
			heading2Size,
			heading3Size,
			heading4Size,
			heading5Size,
			heading6Size,
			listIndent,
			onLinkPress,
			...attributes,
		};
	};

	renderList = (attributes, index, RenderedBlock) => {
		if (attributes.list === 'bullet') {
			return (
				<QuillUnorderedListItem
					key={`unordered-list-${index}`}
					{...this.getProps(attributes)}
				>
					{RenderedBlock}
				</QuillUnorderedListItem>
			);
		} else if (attributes.list === 'ordered') {
			const number = this.getNextOrderedListNumber(attributes);
			return (
				<QuillOrderedListItem
					number={number}
					key={`ordered-list-${index}`}
					{...this.getProps(attributes)}
				>
					{RenderedBlock}
				</QuillOrderedListItem>
			);
		}
	};

	renderBlock = (block, index) => {
		const { attributes } = block[block.length - 1];
		this.updateOrderedListStatus(attributes);
		const RenderedBlock = block.map(inline => {
			return (
				<QuillInline
					key={`inline-${index}-${inline.insert}`}
					{...this.getProps(inline.attributes)}
				>
					{inline.insert.replace(/\n/g, '')}
				</QuillInline>
			);
		});
		if (attributes && attributes.list) {
			return this.renderList(attributes, index, RenderedBlock);
		} else if (attributes && attributes.header) {
			return (
				<QuillHeading
					key={`header-${index}`}
					{...this.getProps(attributes)}
				>
					{RenderedBlock}
				</QuillHeading>
			);
		}
		return <Text key={`generic-${index}`}>{RenderedBlock}</Text>;
	};

	renderBlocks = (blocks) => {
		const RenderedBlocks = blocks.map(this.renderBlock);
		return RenderedBlocks;
	};

	render() {
		const blocks = this.normalizeBlots(this.props.data);
		return <View>{this.renderBlocks(blocks)}</View>;
	}

}

export default QuillRenderer;
