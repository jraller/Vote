import {expect} from 'chai';
import {mount} from 'avoriaz';

const Delimiter = require('../app/views/inputs/delimiter.vue');

describe('sanity', () => {
	const wrapper = mount(Delimiter);
	it('has the right name', () => {
		expect(wrapper.name()).to.equal('inputControlDelimiter');
	});
	it('can get description', () => {
		expect(wrapper.vm.getDescription('tab')).to.equal('Tab');
	});
});

// https://github.com/jraller/Vote/tree/webpack
