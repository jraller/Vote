import Vue from 'vue';
import VueX from 'vuex';

import $eventHub from './eventHub';

import State from './state';

import * as library from '../scripts/library';

import {Delimiters} from '../scripts/delimiters';

const delimiters = new Delimiters();

Vue.use(VueX);

export const actions = {
	inputChange(context): void {
		if (context.getters.raw === '') { // if input is empty
			context.commit('setDelimiter', 'auto'); // reset delimiter to auto select
		} else if (context.getters.delimiter === 'auto') { // if input has content and delimiter is auto
			context.commit('pickDelimiter', context.getters.raw); // select delimiter
			context.commit('pickWeightedValues', context.getters.raw); // select weighted values as well
		}
		context.commit('newBallots'); // trigger ballot parsing
		context.commit('newCandidates'); // trigger building of candidate list
	},
	resetClicked(context): void {
		context.visible.results = false;
		context.visible.chart = false;
		context.round = [];
		$eventHub.$emit('clearChart');
		$eventHub.$emit('getNewBallots');
		context.disableReset = true;
		context.disableRun = false; // TODO should check to see if there are identified candidates?
	},
	runClicked(context): void {
		// context.disableRun = true;
		context.commit('setRunButtonEnable', false);
		context.disableReset = false;

		// context.visible.results = true;
		// context.commit('setVisible', {results: true}); // TODO see below about this form
		context.commit('setVisibleResults', true);
		context.commit('startRun');
	},
};

export const getters = {
	delimiter: (state) => state.delimiter,
	raw: (state) => state.raw,
};

// what is a DRY way to handle UI state changes in mutations?
// should they be internal to store, or modularized?
// TODO handle chart visibility by detecting end of run conditions, or as part of library runRound

export const mutations = {
	newBallots(state: State): void {
		if (state.raw) {
			let temp: any = state.raw.toString().trim().split('\n');
			const delimiter = String.fromCharCode(delimiters.getCode(state.delimiter));
			state.rawLength = temp.length;
			temp = temp.filter(library.nonEmpty);
			state.ballotCount = temp.length;
			for (let index = 0; index < temp.length; index++) {
				temp[index] = temp[index].split(delimiter);
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
		state.visible.chart = false;
		state.round = [];
		state.resetButtonEnabled = false;
		$eventHub.$emit('clearChart');
	},
	eliminateAndContinue(state: State, who: string): void {
		let candidates: string[] = [];
		if (who === 'all') {
			candidates = state.round[state.round.length - 1]
				.candidates
				.filter((c) => c.l)
				.map((c) => c.n);
			library.eliminate(state, candidates);
		} else {
			candidates = [who];
			library.eliminate(state, candidates);
		}
		library.runRound(state);
	},
	newCandidates(state: State): void {
		library.updateCandidateList(state);
		state.candidateListFull = state.candidateList;
		state.visible.disqualifyList = state.candidateList.length > 1;
		state.runButtonEnabled = state.candidateList.length > 0;
		state.visible.results = false;
		state.visible.chart = false;
		$eventHub.$emit('clearChart');
	},
	pickDelimiter(state: State, raw: string): void {
		state.delimiter = Delimiters.pickDelimiter(raw);
	},
	pickWeightedValues(state: State, raw: string): void {
		state.voteValues = !isNaN(parseInt(raw.substring(0, 1), 10));
	},
	setChartNoCount: (state: State, value: number) => state.chartNoCount = value,
	setDelimiter: (state: State, value: string) => state.delimiter = value,
	setRaw: (state: State, value: string) => state.raw = value,
	setResetButtonEnable: (state: State, value: boolean) => state.resetButtonEnabled = value,
	setRunButtonEnable: (state: State, value: boolean) => state.runButtonEnabled = value,

	setVisible: (state: State, value: object) => {
		// TODO this version might be better than separate ones?
		// TODO change object to a specific type
	},

	setVisibleResults: (state: State, value: boolean) => state.visible.results = value,
	setVisibleSanity: (state: State, value: boolean) => state.visible.sanity = value,

	startRun: (state: State) => {
		library.disqualify(state, state.disqualifiedCandidates);
		library.runRound(state);
	},
	updateBallotSort: (state: State, value: string[]) => state.ballot = value,
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
