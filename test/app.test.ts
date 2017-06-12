import {expect} from 'chai';
import {mount} from 'avoriaz';
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

		// console.log(document.body.outerHTML.split('\n')[7]);

		// console.log('[', wrapper.text(), ']');
		// console.log(wrapper.html());

		expect(wrapper.is('div')).to.be.true;
		expect(wrapper.find('.panel').length).to.be.greaterThan(0);
		expect(wrapper.is('.container')).to.be.true;
	});
	// it('reports correct results', () => {
	// 	const votes = wrapper.find('#votes')[0];
	// 	votes.element.value = 'a\na\na\nb\nb\nc';
	// 	votes.trigger('change');
	//
	// 	console.log(wrapper.find('.panel-heading').length);
	// 	console.log(wrapper.find('.panel-heading')[0].hasStyle('display', ''));
	// 	console.log(wrapper.find('.panel-heading')[0].text());
	// 	console.log(wrapper.find('.panel-heading')[1].hasStyle('display', ''));
	// 	console.log(wrapper.find('.panel-heading')[1].text());
	// 	console.log(wrapper.find('.panel-heading')[2].hasStyle('display', ''));
	// 	console.log(wrapper.find('.panel-heading')[2].text());
	//
	// 	console.log(wrapper.find('button')[0].element.disabled);
	// 	console.log(wrapper.find('button')[1].element.disabled);
	//
	// 	wrapper.find('button')[0].trigger('click');
	//
	// 	const results = wrapper.find('tbody');
	//
	// 	console.log(results.length);
	//
	// 	expect(results[0].find('tr')[0].find('td')[0]).to.equal('a');
	// });
});
