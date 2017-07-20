import {expect} from 'chai';
import {mount} from 'avoriaz'; // looks like avoriaz will be replaced byt vue-test-utils when that hits release
import Vue from 'vue';
import Vuex from 'vuex';
import 'babel-polyfill';

import store from '../app/modules/store';

Vue.use(Vuex);

const App = require('../app/views/app.vue');

describe('App', () => {
	const wrapper = mount(App, {store, attachToDocument: true});
	it('renders the correct output', () => {
		expect(wrapper.isVueComponent).to.be.true;
		expect(wrapper.is('div')).to.be.true;
		expect(wrapper.find('.panel').length).to.be.greaterThan(0);
		expect(wrapper.is('.container')).to.be.true;
	});
});
