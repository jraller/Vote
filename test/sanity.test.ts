import * as Avoriaz from 'avoriaz';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai'
import Vue from 'vue';
import Vuex from 'vuex';
import 'babel-polyfill';

chai.use(sinonChai);
Avoriaz.use(Vuex);

const Sanity = require('!vue-loader!./../app/views/sanity.vue');

const expect = chai.expect;
const mount = Avoriaz.mount;

describe('Sanity', () => {

	let wrapper;

	const eventHub = new Vue();

	const state = {
		rawLength: 0,
		ballotCount: 0,
		candidateList: [],
		disqualifiedCandidates: [],
		positions: 1,
	};

	before(() => {

		Vue.mixin({
			data: () => {
				return {eventHub}
			}
		});

		const store = new Vuex.Store({
			state
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
		expect(wrapper.vm.skippedBallots).to.be.false;
		wrapper.vm.$store.state.rawLength = 4;
		wrapper.vm.$store.state.ballotCount = 2;
		expect(wrapper.vm.skippedBallots).to.be.true;
	});
	it('warns about not enough candidates', () => {
		wrapper.vm.$store.state.rawLength = 1;
		wrapper.vm.$store.state.candidateList = ['fred','sally'];
		wrapper.vm.$store.state.disqualifiedCandidates = [];
		wrapper.vm.$store.state.positions = 2;
		expect(wrapper.vm.notEnoughCandidates).to.be.false;
		wrapper.vm.$store.state.rawLength = 1;
		wrapper.vm.$store.state.candidateList = ['fred','sally'];
		wrapper.vm.$store.state.disqualifiedCandidates = ['fred'];
		wrapper.vm.$store.state.positions = 2;
		expect(wrapper.vm.notEnoughCandidates).to.be.true;
		wrapper.vm.$store.state.candidateList = ['fred','sally','paul'];
		wrapper.vm.$store.state.disqualifiedCandidates = ['fred', 'sally'];
		wrapper.vm.$store.state.positions = 2;
		expect(wrapper.vm.notEnoughCandidates).to.be.true;
	});
	it('warns about no candidates left', () => {
		wrapper.vm.$store.state.candidateList = [];
		wrapper.vm.$store.state.disqualifiedCandidates = [];
		expect(wrapper.vm.noCandidatesLeft).to.be.false;
		wrapper.vm.$store.state.rawLength = 1;
		wrapper.vm.$store.state.candidateList = ['fred'];
		wrapper.vm.$store.state.disqualifiedCandidates = ['fred'];
		expect(wrapper.vm.noCandidatesLeft).to.be.true;
	});
});
