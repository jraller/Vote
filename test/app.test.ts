import {expect} from 'chai';
import {mount} from 'avoriaz';
import Vue from 'vue';
import Vuex from 'vuex';
import 'babel-polyfill';

import State from '../app/modules/state';

Vue.use(Vuex);

const App = require('../app/views/app.vue');

describe('App', () => {
	const state = new State;

	const store = new Vuex.Store({
		state
	});

	const wrapper = mount(App, {store, attachToDocument: true});
	it('renders the correct output', () => {
		expect(wrapper.isVueComponent).to.be.true;

		// console.log(document.body.outerHTML.split('\n')[7]);

		// console.log('[', wrapper.text(), ']');
		// console.log(wrapper.html());

		expect(wrapper.is('div')).to.be.true;
		expect(wrapper.find('.panel').length).to.be.greaterThan(0);
		expect(wrapper.is('.container')).to.be.true;
	});
});
