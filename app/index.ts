/// <reference types="node" />

import Vue from 'vue';
import VueX from 'vuex';

import {Delimiters} from './scripts/delimiters';
import * as library from './scripts/library';

Vue.config.silent = false;
Vue.config.devtools = process.env.NODE_ENV === 'development';
Vue.config.performance = false;

Vue.use(VueX);

// https://forum.vuejs.org/t/vuex-best-practices-for-complex-objects/10143/2 for design of state object

const delimiters = new Delimiters();

const store = new VueX.Store({
	getters: { // computed properties for stores
		noCandidatesLeft: (state) => {
			return (state.rawLength > 0) && (state.candidateList.length - state.disqualifiedCandidates.length < state.positions);
		},
		skippedBallots: (state) => { // exposed as this.$state.store.getters.skippedBallots
			return (state.rawLength > 1) && (state.rawLength - state.ballotCount > 0);
		},
	},
	modules: {
		// for dividing the store into modules: https://vuex.vuejs.org/en/modules.html
		// also http://vuetips.com/vuex-module-syntax
	},
	mutations: {
		newBallots(state, raw) {
			if (raw) {
				let temp = raw.toString().trim().split('\n');
				state.rawLength = temp.length;
				temp = temp.filter(library.nonEmpty);
				state.ballotCount = temp.length;

				for (let index = 0; index < temp.length; index++) {
					temp[index] = temp[index]
						.split(String.fromCharCode(delimiters.getCode(state.delimiter)));
					for (let ind = 0; ind < temp[index].length; ind++) {
						temp[index][ind] = temp[index][ind].trim();
					}
					// temp = temp.filter(
					// 	(candidate) => state.disqualifiedCandidates.indexOf(candidate) === -1,
					// );
				}
				state.current = temp;
			} else {
				state.rawLength = 0;
				state.ballotCount = 0;
				state.current = [];
			}
		},
		newCandidates(state) {
			state.candidateList = [];
			for (const row of state.current) {
				for (let index = (state.voteValues) ? 1 : 0; index < row.length; index++) {
					if (state.candidateList.indexOf(row[index]) === -1) {
						state.candidateList.push(row[index]);
					}
				}
			}
			library.sortCandidateList(state.candidateList, state.sortOrder);
		},
		pickDelimiter(state, raw) {
			state.delimiter = delimiters.pickDelimiter(raw);
		},
		pickWeightedValues(state, raw) {
			state.voteValues = !isNaN(parseInt(raw.substring(0, 1), 10));
		},
		setDelimiter(state, value) {
			state.delimiter = value;
		},
		updateDisqualified(state, value) {
			state.disqualifiedCandidates = value;
		},
		updatePositions(state, value) {
			state.positions = value;
		},
		updateSortOrder(state, value) {
			state.sortOrder = value;
		},
		updateVoteValues(state, value) {
			state.voteValues = value;
		},
	},
	state: {
		ballotCount: 0,
		candidateList: [],
		current: [],
		delimiter: 'auto',
		delimiterList: delimiters.listDelimiters(),
		disqualifiedCandidates: [],
		positions: 1,
		rawLength: 0,
		round: [
			{candidates: ['fred', 'sally', 'john'], roundType: 'roundSummary'},
			{candidates: ['fred', 'sally'], roundType: 'roundSummary'},
		],
		sortOrder: 'u',
		voteValues: false,
	},
});

const eventHub = new Vue();

Vue.mixin({
	data: () => {
		return {eventHub};
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
