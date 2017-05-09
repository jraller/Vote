import avoriaz, {mount} from 'avoriaz';
import * as chai from 'chai';
import sinon from 'sinon';
import * as sinonChai from 'sinon-chai'
import Vuex from 'vuex';

// https://eddyerburgh.gitbooks.io/avoriaz/content/guides/using-with-vuex.html

chai.use(sinonChai);
// avoriaz.use(Vuex);

const Ballots = require('!vue-loader!./../app/views/input-control-votes.vue');

Ballots.created = function(){}

const expect = chai.expect;

describe('Ballot Input', () => {
	const wrapper = mount(Ballots);

	let store;

	// beforeEach(() => {
	// 	store = new Vuex.store({
	// 		state: {}
	// 	});
	// });

	it('has the right name', () => {
		expect(wrapper.name()).to.equal('InputControlVotes');
	});
	it('has a description', () => {
		expect(wrapper.text()).to.contain('Votes:');
	});
	it('has style', () => {
		const textarea = wrapper.find('#votes')[0]; // target the styled element
		expect(textarea.hasStyle('white-space', 'pre')).to.be.true;
		expect(textarea.hasStyle('overflow-wrap', 'normal')).to.be.true;
		expect(textarea.hasStyle('overflow-y', 'scroll')).to.be.true;
	});
	it('triggers on change', () => {
		// const changeVotes = sinon.stub();
		const changeWrapper = mount(Ballots, {
			store
		});

		// changeWrapper.vm.created = function() {};
		// changeWrapper.vm.changeVotes = changeVotes;

		const ballotTextarea = changeWrapper.find('#votes')[0];

		expect(ballotTextarea.value).to.be.undefined;
		ballotTextarea.value= 'fred';
		ballotTextarea.simulate('change');
		expect(ballotTextarea.value).to.equal('fred');

		// expect(changeVotes).to.have.been.called;
	});

});
