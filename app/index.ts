import 'bootstrap-loader';
import 'jquery';
import Vue from 'vue';
import Vuex from 'vuex';

import {Delimiters} from './scripts/delimiters';
import * as library from './scripts/library';

Vue.use(Vuex);

const delimiters = new Delimiters();

const store = new Vuex.Store({
	getters: { // computed properties for stores
		skippedBallots: (state) => { // exposed as this.$state.store.getters.skippedBallots
			return state.rawLength > 1 && state.rawLength - state.ballotCount > 0;
		},
	},
	mutations: {
		newBallots(state, raw) {
			let temp = raw.toString().trim().split('\n');
			state.rawLength = temp.length;
			temp = temp.filter(library.nonEmpty);
			state.ballotCount = temp.length;

			for (let index = 0; index < temp.length; index++) {
				temp[index] = temp[index].split(String.fromCharCode(delimiters.getCode(state.delimiter)));
				for (let ind = 0; ind < temp[index].length; ind++) {
					temp[index][ind] = temp[index][ind].trim();
				}
			}
			state.current = temp;
		},
		newCandidates(state) {
			state.candidateList = [];
			for (const row of state.current) {
				for (const entry of row) {
					if (state.candidateList.indexOf(entry) === -1) {
						state.candidateList.push(entry);
					}
				}
			}
		},
		pickDelimiter(state, raw) {
			state.delimiter = delimiters.pickDelimiter(raw);
		},
		setDelimiter(state, value) {
			state.delimiter = value;
		},
		updateDisqualified(state, value) {
			state.disqualifiedCandidates = value;
		},
	},
	state: {
		ballotCount: 0,
		candidateList: [],
		current: [],
		delimiter: 'auto',
		delimiterList: delimiters.listDelimiters(),
		disqualifiedCandidates: [],
		rawLength: 0,
	},
});

const vm = new Vue({
	components: {
		app: require('./views/app.vue'),
	},
	el: '#app',
	store,
});

if (module.hot) {
	module.hot.accept();
}
