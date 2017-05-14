import * as Avoriaz from 'avoriaz';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai'
import Vue from 'vue';
import Vuex from 'vuex';
import 'babel-polyfill';

chai.use(sinonChai);
Avoriaz.use(Vuex);

const WeightedValues = require('./../app/views/input-control-weighted-values.vue');

const expect = chai.expect;
const mount = Avoriaz.mount;

describe('Weighted Values', () => {

	let wrapper;

	const eventHub = new Vue();

	const state = {
		voteValues: false,
	};

	const mutations = {
		newCandidates: sinon.stub(),
		updateVoteValues: sinon.stub(),
	};

	before(() => {

		Vue.mixin({
			data: () => {
				return {eventHub}
			}
		});


		const store = new Vuex.Store({
			mutations,
			state
		});

		wrapper = mount(WeightedValues, {
			store,
			attachToDocument: true
		});
	});

	it('is a Vue component', () => {
		expect(wrapper.isVueComponent).to.be.true;
	});
	it('has the right name', () => {
		expect(wrapper.name()).to.equal('inputControlWeightedValues');
	});
	it('triggers proper store items when changed', () => {
		const counta = mutations.updateVoteValues.callCount;
		const countb = mutations.newCandidates.callCount;

		wrapper.vm.changeVoteValues();

		expect(mutations.updateVoteValues.callCount).to.equal(counta + 1);
		expect(mutations.newCandidates.callCount).to.equal(countb + 1);
	});
});
