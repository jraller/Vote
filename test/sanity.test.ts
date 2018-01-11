import {mount} from '@vue/test-utils';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai'
import Vue from 'vue';
import Vuex from 'vuex';
import 'babel-polyfill';

chai.use(sinonChai);
Vue.use(Vuex);

const Sanity = require('../app/views/checks/sanity.vue');

const expect = chai.expect;

import State from '../app/modules/state';

describe('Sanity', () => {

	const mutations = {
		setVisible: sinon.stub(),
	};

	const state = new State();

	const store = new Vuex.Store({
		mutations,
		state
	});

	const wrapper = mount(Sanity, {
		store,
	});

	it('is a Vue component', () => {
		expect(wrapper.isVueInstance()).to.be.true;
	});
	it('has the right name', () => {
		expect(wrapper.name()).to.equal('SanityChecks');
	});
	it('warns about skipped ballots', () => {
		const count = mutations.setVisible.callCount;
		expect(wrapper.vm['skippedBallots']).to.be.false;
		state.rawLength = 4;
		state.ballotCount = 2;
		expect(wrapper.vm['skippedBallots']).to.be.true;
		expect(mutations.setVisible).to.have.been.calledWith(state, {sanity: true});
	});
	it('warns about not enough candidates', () => {
		const count = mutations.setVisible.callCount;
		state.rawLength = 1;
		state.candidateList = ['fred', 'sally'];
		state.disqualifiedCandidates = [];
		state.positions = 2;
		expect(wrapper.vm['notEnoughCandidates']).to.be.false;
		expect(mutations.setVisible).to.have.callCount(count + 1);

		state.disqualifiedCandidates = ['fred'];
		expect(wrapper.vm['notEnoughCandidates']).to.be.true;
		expect(mutations.setVisible).to.have.callCount(count + 2);

		state.candidateList  = ['fred','sally','paul'];
		state.disqualifiedCandidates = ['fred', 'sally'];
		expect(wrapper.vm['notEnoughCandidates']).to.be.true;
		expect(mutations.setVisible).to.have.callCount(count + 3);
	});
	it('warns about no candidates left', () => {
		state.rawLength = 0;
		state.candidateList = [];
		state.disqualifiedCandidates = [];
		state.rawLength = 0;
		expect(wrapper.vm['noCandidatesLeft']).to.be.false;
		state.rawLength = 1;
		state.candidateList = ['fred'];
		state.disqualifiedCandidates = ['fred'];
		expect(wrapper.vm['noCandidatesLeft']).to.be.true;
	});
});
