import {expect} from 'chai';
import {mount} from 'avoriaz';

const CandidateRow = require('../app/views/results/candidate-row.vue');

describe('Candidate Row', () => {
	const wrapper = mount(CandidateRow);
	it('can get description', () => {
		expect(wrapper).to.be.ok;
	});
});
