import Vue from 'vue';
import VueX from 'vuex';

import eventHub from './eventHub';

import {Delimiters} from './../scripts/delimiters';
import * as library from './../scripts/library';

Vue.use(VueX);

const delimiters = new Delimiters();

export default new VueX.Store({
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
			library.updateCandidateList(state);
			state.candidateListFull = state.candidateList;
			state.visible.disqualifyList = state.candidateList.length > 1;
			state.disableRun = state.candidateList.length === 0;
			state.visible.chart = false;
			state.visible.results = false;
		},
		pickDelimiter(state, raw) {
			state.delimiter = delimiters.pickDelimiter(raw);
		},
		pickWeightedValues(state, raw) {
			state.voteValues = !isNaN(parseInt(raw.substring(0, 1), 10));
		},
		runClicked(state) {
			// state.round = [];
			state.visible.results = true;
			// TODO remove disqualified candidates before first round
			for (const candidate of state.disqualifiedCandidates) {
				library.disqualify(state, candidate);
			}
			// TODO reset chart history by sending message through eventHub

			eventHub.$emit('chartReset');

			// TODO run the first round, let that round run additional rounds, or get user input
			library.runRound(state);
		},
		setDelimiter(state, value) {
			state.delimiter = value;
		},
		setVisibleSanity(state, value) {
			state.visible.sanity = value;
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
		candidateListFull: [],
		current: [],
		delimiter: 'auto',
		delimiterList: delimiters.listDelimiters(),
		disableRun: true,
		disqualifiedCandidates: [],
		positions: 1,
		rawLength: 0,
		round: [
			// {candidates: [
			// 	{n: 'fred', v: [3, 2]},
			// 	{n: 'sally', v: [2, 2]},
			// 	{n: 'john', v: [1, 1]},
			// ], roundType: 'roundSummary'},
			// {candidates: [
			// 	{n: 'fred', v: [4, 2]},
			// 	{n: 'sally', v: [3, 2]},
			// ], roundType: 'roundChoice'},
		],
		sortOrder: 'u',
		visible: {
			chart: false,
			disqualifyList: false,
			results: false,
			sanity: false,
		},
		voteValues: false,
	},
});
