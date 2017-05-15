import * as Avoriaz from 'avoriaz';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai'
import Vue from 'vue';
import Vuex from 'vuex';
import 'babel-polyfill';

chai.use(sinonChai);
Vue.use(Vuex);

const Positions = require('../app/views/inputs/positions.vue');

const expect = chai.expect;
const mount = Avoriaz.mount;

describe('Positions', () => {

	const mutations = {
		updatePositions: sinon.stub(),
	};

	const state = {
		positions: 1,
	};

	const store = new Vuex.Store({
		mutations,
		state
	});

	const wrapper = mount(Positions, {
		store,
		attachToDocument: true
	});

	it('is a Vue component', () => {
		expect(wrapper.isVueComponent).to.be.true;
	});
	it('has the right name', () => {
		expect(wrapper.name()).to.equal('inputControlPositions');
	});
	it('notifies the store when changed', () => {
		const count = mutations.updatePositions.callCount;

		wrapper.setData({positions: 2});
		wrapper.find('#positions')[0].simulate('change');

		expect(mutations.updatePositions).to.have.callCount(count + 1);
		expect(mutations.updatePositions).to.have.been.calledWith(state, 2);
	});
});
