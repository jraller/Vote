import * as Avoriaz from 'avoriaz';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai'
import Vue from 'vue';
import Vuex from 'vuex';
import 'babel-polyfill';

chai.use(sinonChai);
Avoriaz.use(Vuex);

const Sanity = require('./../app/views/sanity.vue');

import State from '../app/modules/state';

const expect = chai.expect;
const mount = Avoriaz.mount;

describe('Sanity', () => {

	let wrapper;

	const eventHub = new Vue();

	const state = new State();

	const mutations = {
		setVisibleSanity: sinon.stub(),
	};

	const store = new Vuex.Store({
		mutations,
		state
	});

	before(() => {

		Vue.mixin({
			data: () => {
				return {eventHub}
			}
		});

		wrapper = mount(Sanity, {
			store,
			attachToDocument: true
		});
	});

	it('is a Vue component', () => {
		expect(wrapper.isVueComponent).to.be.true;
	});
	it('has the right name', () => {
		expect(wrapper.name()).to.equal('SanityChecks');
	});
	it('warns about skipped ballots', () => {
		const count = mutations.setVisibleSanity.callCount;
		// per https://github.com/eddyerburgh/avoriaz/issues/15
		expect(wrapper.vm.skippedBallots).to.be.false;
		state.rawLength = 4;
		state.ballotCount = 2;
		expect(wrapper.vm.skippedBallots).to.be.true;
		expect(mutations.setVisibleSanity).to.have.callCount(count + 1);
		expect(mutations.setVisibleSanity).to.have.been.calledWith(state, true);
	});
	it('warns about not enough candidates', () => {
		const count = mutations.setVisibleSanity.callCount;
		state.rawLength = 1;
		state.candidateList = ['fred', 'sally'];
		state.disqualifiedCandidates = [];
		state.positions = 2;
		expect(wrapper.vm.notEnoughCandidates).to.be.false;
		expect(mutations.setVisibleSanity).to.have.callCount(count + 1);

		state.disqualifiedCandidates = ['fred'];
		expect(wrapper.vm.notEnoughCandidates).to.be.true;
		expect(mutations.setVisibleSanity).to.have.callCount(count + 2);

		state.candidateList  = ['fred','sally','paul'];
		state.disqualifiedCandidates = ['fred', 'sally'];
		expect(wrapper.vm.notEnoughCandidates).to.be.true;
		expect(mutations.setVisibleSanity).to.have.callCount(count + 3);
	});
	it('warns about no candidates left', () => {
		state.rawLength = 0;
		state.candidateList = [];
		state.disqualifiedCandidates = [];
		state.rawLength = 0;
		expect(wrapper.vm.noCandidatesLeft).to.be.false;
		state.rawLength = 1;
		state.candidateList = ['fred'];
		state.disqualifiedCandidates = ['fred'];
		expect(wrapper.vm.noCandidatesLeft).to.be.true;
	});
});
