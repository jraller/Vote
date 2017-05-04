import {expect} from 'chai';
import {mount} from 'avoriaz';

const Delimiter = require('!vue-loader!./../app/views/input-control-delimiter.vue');

describe('sanity', () => {
	it('has the right name', () => {
		const wrapper = mount(Delimiter);
		expect(wrapper.name()).to.equal('inputControlDelimiter');
	});
});
