import {mount} from 'vue-test-utils';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai'
import Vue from 'vue';
import Vuex from 'vuex';
import 'babel-polyfill';

chai.use(sinonChai);
Vue.use(Vuex);

const WeightedValues = require('../app/views/inputs/weighted-values.vue');

const expect = chai.expect;

describe('Weighted Values', () => {

	let wrapper;

	const eventHub = new Vue();

	const state = {
		voteValues: false,
	};

	const actions = {
		inputChange: sinon.stub(),
	}

	const mutations = {
		updateVoteValues: sinon.stub(),
	};

	before(() => {

		Vue.mixin({
			data: () => {
				return {eventHub}
			}
		});


		const store = new Vuex.Store({
			actions,
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
		const countb = actions.inputChange.callCount;

		wrapper.vm.changeVoteValues();

		expect(mutations.updateVoteValues.callCount).to.equal(counta + 1);
		expect(actions.inputChange.callCount).to.equal(countb + 1);
	});
});
