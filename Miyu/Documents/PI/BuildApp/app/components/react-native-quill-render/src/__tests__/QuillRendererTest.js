import React from 'react';
import { create } from 'react-test-renderer';
import 'react-native';
import QuillRenderer from '../QuillRenderer';

jest.mock('../QuillHeading', () => 'QuillHeading');
jest.mock('../QuillInline', () => 'QuillInline');
jest.mock('../QuillOrderedListItem', () => 'QuillOrderedListItem');
jest.mock('../QuillUnorderedListItem', () => 'QuillUnorderedListItem');

const props = {
	onLinkPress: jest.fn(),
	data: [
		{
			'insert': 'Heading 4',
		},
		{
			'attributes': {
				'header': 4,
			},
			'insert': '\n',
		},
		{
			'insert': 'This is a test\n\nAnother Heading',
		},
		{
			'attributes': {
				'header': 4,
			},
			'insert': '\n',
		},
		{
			'insert': 'one',
		},
		{
			'attributes': {
				'list': 'ordered',
			},
			'insert': '\n',
		},
		{
			'insert': 'two',
		},
		{
			'attributes': {
				'list': 'ordered',
			},
			'insert': '\n',
		},
		{
			'insert': 'three',
		},
		{
			'attributes': {
				'list': 'ordered',
			},
			'insert': '\n',
		},
		{
			'insert': 'four ',
		},
		{
			'attributes': {
				'list': 'ordered',
			},
			'insert': '\n',
		},
		{
			'insert': 'seven',
		},
		{
			'attributes': {
				'list': 'ordered',
			},
			'insert': '\n',
		},
		{
			'insert': '\ndsjkldsak .   jdskjdsfjksadfjkds ajflkj;asd . flkasdfjasl j . kdf .   hkajs dflkjasdf jasj dfkj asdlfk ja;lskd jfjlkaj sdf;lk as;ldkfj l;aksjdflkaj sdfjjas hdfjasdf wuefhb qwiuebfuiyabsfuy ausdbyf adcoausy dgfuadsf\n1',
		},
		{
			'attributes': {
				'list': 'bullet',
			},
			'insert': '\n',
		},
		{
			'insert': '2',
		},
		{
			'attributes': {
				'list': 'bullet',
			},
			'insert': '\n',
		},
		{
			'insert': '3',
		},
		{
			'attributes': {
				'list': 'bullet',
			},
			'insert': '\n',
		},
		{
			'insert': '4',
		},
		{
			'attributes': {
				'list': 'bullet',
			},
			'insert': '\n',
		},
		{
			'insert': '5',
		},
		{
			'attributes': {
				'list': 'bullet',
			},
			'insert': '\n',
		},
		{
			'insert': '6',
		},
		{
			'attributes': {
				'list': 'bullet',
			},
			'insert': '\n',
		},
		{
			'insert': '7',
		},
		{
			'attributes': {
				'italic': true,
			},
			'insert': '77',
		},
		{
			'attributes': {
				'list': 'bullet',
			},
			'insert': '\n',
		},
		{
			'insert': '\n',
		},
		{
			'attributes': {
				'link': {
					'248': {
						'linkType': 'brand',
						'data': {
							'_type': 'atom-multiselect@1.0.0',
							'selected': [
								{
									'id': 151,
									'name': 'Moen',
								},
							],
						},
					},
				},
			},
			'insert': 'MOEN!!!!',
		},
		{
			'insert': ' asdfasdfa sdfasdf asdlfkjas dfiaois dfjk asdk ljf asfdjads kflasdfj lkasdj flka jsdfasdf (MEH MEHM EHM EHM E HM EHM EH) a sdfasfd\n',
		},
	],
};

function setup(extraProps = {}) {
	const wrapper = create(
		<QuillRenderer
			{...props}
			{...extraProps}
		/>
	);
	const instance = wrapper.getInstance();
	return {
		wrapper,
		instance,
	};
}

describe('QuillRenderer', () => {
	it('should render', () => {
		const { wrapper } = setup();
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should return undefined for anything other than ordered or bulleted lists', () => {
		const { instance } = setup();
		const result = instance.renderList({});
		expect(result).toEqual(undefined);
	});
	describe('getNextOrderedListNumber', () => {
		it('should return undefined when previous block is not an ordered list', () => {
			const { instance } = setup();
			const result = instance.getNextOrderedListNumber();
			expect(result).toEqual(undefined);
		});
	});
});
