import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	View,
} from 'react-native';
import { Text } from 'build-library';

class HTML extends Component {

	getFormatForBlock(format) {
		if (format === 'em' || format === 'i') {
			return {
				fontStyle: 'italic',
			};
		}
		if (format === 'strong' || format === 'b') {
			return {
				weight: 'bold',
			};
		}
	}

	renderBlock(block, key) {
		if (block && block.htmlTag) {
			switch (block.htmlTag) {
				case 'ul':
					return (
						<Text key={key}>
							{this.parseGroup(block.listItems)}
						</Text>
					);
				case 'li':
					return (
						<Text
							key={key}
							{...this.getFormatForBlock(block.htmlFormatTag)}
						>
							{'\n'}• {block.text}
						</Text>
					);
				case 'em':
				case 'i':
					return (
						<Text
							key={key}
							fontStyle="italic"
						>
							{block.text}
						</Text>
					);
				case 'br':
					return <Text key={key}>{'\n'}</Text>;
				case 'h1':
					return (
						<Text
							size="xlarge"
							weight="bold"
							key={key}
						>
							{block.text}
						</Text>
					);
				case 'h2':
					return (
						<Text
							size="larger"
							weight="bold"
							key={key}
						>
							{block.text}
						</Text>
					);
				case 'h3':
					return (
						<Text
							size="large"
							weight="bold"
							key={key}
						>
							{block.text}
						</Text>
					);
				case 'h4':
					return (
						<Text
							weight="bold"
							key={key}
						>
							{block.text}
						</Text>
					);
				case 'table':
				case 'div':
				case 'p':
					return (
						<Text
							key={key}
							{...this.getFormatForBlock(block.htmlFormatTag)}
						>
							{'\n'}{block.text}
						</Text>
					);
				case 'strong':
				case 'b':
					return (
						<Text
							weight="bold"
							key={key}
						>
							{block.text}
						</Text>
					);
				default:
					return null;
			}
		}
	}

	parseGroup(payload) {
		if (Array.isArray(payload)) {
			return payload.map((block, index) => this.renderBlock(block, index));
		}
	}

	render() {
		return (
			<View>
				{this.parseGroup(this.props.json)}
			</View>
		);
	}

}

HTML.propTypes = {
	json: PropTypes.any,
};

HTML.defaultProps = {};

export default HTML;
