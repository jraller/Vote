import Vue from 'vue';
import VueX from 'vuex';

import eventHub from './eventHub';

import State from './state';

import * as library from '../scripts/library';

import {Delimiters} from '../scripts/delimiters';

const delimiters = new Delimiters();

Vue.use(VueX);

export const actions = {};

export const getters = {
	// atomic parts of state
	// latest round
};

// what is a DRY way to handle UI state changes in mutations?
// should they be internal to store, or modularized?
// TODO handle chart visibility by detecting end of run conditions, or as part of library runRound

export const mutations = {
	newBallots(state: State, raw: string): void {
		if (raw) {
			let temp: any = raw.toString().trim().split('\n');
			state.rawLength = temp.length;
			temp = temp.filter(library.nonEmpty);
			state.ballotCount = temp.length;

			for (let index = 0; index < temp.length; index++) {
				temp[index] = temp[index]
					.split(String.fromCharCode(delimiters.getCode(state.delimiter)));
				for (let ind = 0; ind < temp[index].length; ind++) {
					temp[index][ind] = temp[index][ind].trim();
				}
			}
			state.current = temp;
		} else {
			state.rawLength = 0;
			state.ballotCount = 0;
			state.current = [];
		}
		state.visible.results = false;
		state.round = [];
		state.disableReset = true;
	},
	eliminateAndContinue(state: State, who: string): void {
		if (who === 'all') {
			const candidates = state.round[state.round.length - 1]
				.candidates
				.filter((c) => c.l)
				.map((c) => c.n);
			for (const candidate of candidates) {
				library.eliminate(state, candidate);
			}
		} else {
			library.eliminate(state, who);
		}
		library.runRound(state);
	},
	newCandidates(state: State): void {
		library.updateCandidateList(state);
		state.candidateListFull = state.candidateList;
		state.visible.disqualifyList = state.candidateList.length > 1;
		state.disableRun = state.candidateList.length === 0;
		state.visible.chart = false;
		state.visible.results = false;
	},
	pickDelimiter(state: State, raw: string): void {
		state.delimiter = Delimiters.pickDelimiter(raw);
	},
	pickWeightedValues(state: State, raw: string): void {
		state.voteValues = !isNaN(parseInt(raw.substring(0, 1), 10));
	},
	resetClicked(state: State): void {
		state.visible.results = false;
		state.round = [];
		eventHub.$emit('getNewBallots');
		state.disableReset = true;
	},
	runClicked(state: State): void {
		state.disableRun = true;
		state.disableReset = false;
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
	setDelimiter: (state: State, value: string) => state.delimiter = value,
	setVisibleSanity: (state: State, value: boolean) => state.visible.sanity = value,
	updateDisqualified: (state: State, value: string[]) => state.disqualifiedCandidates = value,
	updatePositions: (state: State, value: number) => state.positions = value,
	updateSortOrder: (state: State, value: string) => state.sortOrder = value,
	updateVoteValues: (state: State, value: boolean) => state.voteValues = value,
};

export default new VueX.Store({
	actions,
	getters,
	modules: {
		// for dividing the store into modules: https://vuex.vuejs.org/en/modules.html
		// also http://vuetips.com/vuex-module-syntax
	},
	mutations,
	state: new State(),
	strict: process.env.NODE_ENV !== 'production',
});
