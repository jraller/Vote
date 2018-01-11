import {mount} from '@vue/test-utils';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai'
import Vue from 'vue';
import Vuex from 'vuex';
import 'babel-polyfill';

chai.use(sinonChai);
Vue.use(Vuex);

const Ballots = require('../app/views/inputs/ballots.vue');
const State = require('../app/modules/state');

const expect = chai.expect;

describe('Ballot Input', () => {

	const wrapper = mount(Ballots);

	it('has the right name', () => {
		expect(wrapper.name()).to.equal('InputControlVotes');
	});
	it('has a description', () => {
		expect(wrapper.text()).to.contain('Votes:');
	});
	it('has style', () => {
		const textarea = wrapper.find('#votes'); // target the styled element
		expect(textarea.hasStyle('white-space', 'pre')).to.be.true;
		expect(textarea.hasStyle('overflow-wrap', 'normal')).to.be.true;
		expect(textarea.hasStyle('overflow-y', 'scroll')).to.be.true;
	});

	describe('Ballots',() => {
		let changeWrapper;

		const eventHub = new Vue();

		const actions = {
			inputChange: sinon.stub()
		};

		const mutations = {
			newBallots: sinon.stub(),
			newCandidates: sinon.stub(),
			setRaw: sinon.stub()
		};

		const state = State;
		state.delimiter = 'auto';

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

		changeWrapper = mount(Ballots, {
			store,
			attachToDocument: true
		});

		it('is a Vue component', () => {
			expect(changeWrapper.isVueComponent).to.be.true;
		});
		it('has the right id', () => {
			expect(changeWrapper.contains('#votes')).to.be.true;
		});
		it('contains a textarea', () => {
			expect(changeWrapper.contains('textarea')).to.be.true;
		});
		it('is starts out empty', () => {
			expect(changeWrapper.vm.rawInput).to.equal('');
		});
		it('triggers newBallots when the input is changed', () => {
			const inputChangeCount = actions.inputChange.callCount;
			const setRawCount = mutations.setRaw.callCount;

			changeWrapper.setData({rawInput: 'fred'});
			changeWrapper.find('textarea').trigger('change');

			expect(changeWrapper.vm.rawInput).to.equal('fred');

			expect(mutations.setRaw).to.have.callCount(inputChangeCount + 1);
			expect(actions.inputChange).to.have.callCount(inputChangeCount + 1);
		});
	});
});
