import {mount} from '@vue/test-utils';
import {expect} from 'chai';
import 'babel-polyfill';

const Delimiter = require('../app/views/inputs/delimiter.vue');

describe('delimiter', () => {
	const wrapper = mount(Delimiter);
	it('has the right name', () => {
		expect(wrapper.name()).to.equal('inputControlDelimiter');
	});
	it('can get description', () => {
		expect(wrapper.vm['getDescription']('tab')).to.equal('Tab');
	});
});
