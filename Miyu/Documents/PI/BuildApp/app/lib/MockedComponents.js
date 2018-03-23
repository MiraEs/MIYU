/*
* sometimes you just need a dummy component to hold a place until
* the real component is rendered.
*
* Not intended for tests.
*/

import helpers from './helpers';

export class MockScrollView {
	scrollTo = helpers.noop;
}
