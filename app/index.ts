import 'bootstrap-loader';
import 'jquery';
import Vue from 'vue';
import Vuex from 'vuex';
import * as library from './scripts/library';

Vue.use(Vuex);

const store = new Vuex.Store({
	mutations: {
		changeDelimiter(state, delimiter) {
			state.delimiter = delimiter;
		},
		newBallots(state, raw) {
			let temp = raw.toString().split('\n');
			state.rawLength = temp.length;
			temp = temp.filter(library.nonEmpty);
			state.ballotCount = temp.length;

			for (let i = 0; i < temp.length; i++) {
				temp[i] = temp[i].split(state.delimiter);
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
		updateDisqualified(state, value) {
			state.disqualifiedCandidates = value;
		}
	},
	state: {
		ballotCount: 0,
		candidateList: [],
		current: [],
		delimiter: '',
		disqualifiedCandidates: [],
		rawLength: 0
	}
});

const vm = new Vue({
	components: {
		app: require('./views/app.vue')
	},
	el: '#app',
	store
});

if (module.hot) {
	module.hot.accept();
}
