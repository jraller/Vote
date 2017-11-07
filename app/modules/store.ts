import Vue from 'vue';
import VueX from 'vuex';

import $eventHub from './eventHub';

import State from './state';

import {IVisible} from './visible';

import * as library from '../scripts/library';

import {Delimiters} from '../scripts/delimiters';

const delimiters = new Delimiters();

Vue.use(VueX);

export const actions = {
	inputChange(context): void {
		if (context.getters.raw === '') { // if input is empty
			context.commit('setDelimiter', 'auto'); // reset delimiter to auto select
			context.commit('setWeightedValues', false); // if empty unset vote values
		} else if (context.getters.delimiter === 'auto') { // if input has content and delimiter is auto
			context.commit('pickDelimiter', context.getters.raw); // select delimiter
			context.commit('pickWeightedValues', context.getters.raw); // select weighted values as well
		}
		context.commit('newBallots'); // trigger ballot parsing
		context.commit('newCandidates'); // trigger building of candidate list
	},
	resetClicked(context): void {
		context.commit('setVisible', {chart: false, results: false});
		context.round = [];
		context.dispatch('inputChange');
		context.commit('setResetButtonEnable', false);
		context.commit('setRunButtonEnable', context.getters.raw.length > 0);
	},
	runClicked(context): void {
		context.commit('setRunButtonEnable', false);
		context.commit('setResetButtonEnable', true);
		context.commit('setVisible', {results: true});
		context.commit('startRun');
	},
};

export const getters = {
	delimiter: (state) => state.delimiter,
	raw: (state) => state.raw,
	resetButtonDisabled: (state) => state.resetButtonEnabled === false,
	runButtonDisabled: (state) => state.runButtonEnabled === false,
};

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
	setVisible: (state: State, value: IVisible) => {
		for (const item of ['chart', 'disqualifyList', 'results', 'sanity']) {
			if (value.hasOwnProperty(item)) {
				state.visible[item] = value[item];
			}
		}
	},
	setWeightedValues: (state: State, value: boolean) => state.voteValues = value,
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
