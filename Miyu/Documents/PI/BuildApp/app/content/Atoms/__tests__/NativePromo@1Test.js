
jest.mock('../../../../app/services/httpClient', () => 'httpClient');

import { NativePromo } from '../NativePromo@1';
import React from 'react';

describe('NativePromo component', () => {

	const props = {
		contentItemId: 0,
		coupon_code: { text: 'coupon' },
		cta: {},
		description: {},
		group: {},
		media_image: {},
		headline: {},
		promo_detail: {},
		pro_only: { selected: false },
		isPro: false,
	};

	it('should render correctly', () => {
		const tree = require('react-test-renderer').create(
			<NativePromo {...props} />
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should render correctly without a coupon', () => {
		const tree = require('react-test-renderer').create(
			<NativePromo
				{...props}
				coupon_code={null}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should not render a PRO only promo on a regular account', () => {
		const tree = require('react-test-renderer').create(
			<NativePromo
				{...props}
				pro_only={{ selected: true }}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('should properly render a PRO only promo for PRO users', () => {
		const tree = require('react-test-renderer').create(
			<NativePromo
				{...props}
				pro_only={{ selected: true }}
				isPro={true}
			/>
		).toJSON();
		expect(tree).toMatchSnapshot();
	});

});
