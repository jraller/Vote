import * as library from './../app/index';
import {expect} from 'chai';

describe('index', () => {
	describe('nonEmpty', () => {
		it('should return true for non-empty strings', () => {
			expect(2 + 2).to.equal(4);
		});
	});
});


// https://vuejs.org/v2/guide/unit-testing.html

// pick between
// https://github.com/eddyerburgh/avoriaz
// and
// https://github.com/callumacrae/vue-test
// or wait for them to merge?
// https://eddyerburgh.gitbooks.io/avoriaz/content/
