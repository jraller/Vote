import Vue from 'vue';
import Vuex from 'vuex';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai'
import { expect } from 'chai';
import 'babel-polyfill';

Vue.use(Vuex);
chai.use(sinonChai);

const expect = chai.expect;

import State, {roundTypeEnum} from '../app/modules/state';
import Store, { actions, getters, mutations } from '../app/modules/store';

describe('store', () => {
	describe('actions', () => {
		describe('inputChange', () => {
			it('handles empty input', () => {
				const { inputChange } = actions;
				const context = {
					commit: sinon.stub(),
					getters: {
						raw: '',
					},
				};
				inputChange(context);
				expect(context.commit).to.have.been.calledWith('setDelimiter', 'auto');
			});
			it('handles input', () => {
				const { inputChange } = actions;
				const context = {
					commit: sinon.stub(),
					getters: {
						raw: 'a\tb\ta',
						delimiter: 'auto'
					},
				};
				inputChange(context);
				expect(context.commit).to.have.been.calledWith('pickDelimiter', 'a\tb\ta');
				expect(context.commit).to.have.been.calledWith('newBallots');
				expect(context.commit).to.have.been.calledWith('newCandidates');
			});
		});
		describe('resetClicked', () => {
			it('__', () => {
				const {resetClicked} = actions;
				const context = {
					commit: sinon.stub(),
					getters: {
						raw: '',
					},
					dispatch: sinon.stub()
				};
				resetClicked(context);
				expect(context.commit).to.have.been.calledWith('setVisible');
				expect(context.dispatch).to.have.been.calledWith('inputChange');
			});
		});
		describe('runClicked', () => {
			it('__', () => {
				const {runClicked} = actions;
				const context = {
					commit: sinon.stub(),
				};
				runClicked(context);
				expect(context.commit).to.have.been.calledWith('startRun');
			});
		});
	});
	describe('getters', () => {
		describe('ballot', () => {
			it('gets ballot', () => {
				expect(Store.getters.ballot).to.eql([]);
			});
		});
		describe('ballotCount', () => {
			it('gets ballotCount', () => {
				expect(Store.getters.ballotCount).to.equal(0);
			});
		});
		it('gets delimiter', () => {
			expect(Store.getters.delimiter).to.equal('auto');
		});
		it('gets raw', () => {
			expect(Store.getters.raw).to.equal('');
		});
		it('gets resetButtonDisabled', () => {
			expect(Store.getters.resetButtonDisabled).to.equal(true);
		});
		it('gets runButtonDisabled', () => {
			expect(Store.getters.runButtonDisabled).to.equal(true);
		});
	});
	describe('mutations', () => {
		describe('newBallots', () => {
			it('should handle newBallots with input', () => {
				const state = new State();
				state.raw = 'fred\nfred\nsally';

				const { newBallots } = mutations;

				newBallots(state);
				expect(state.rawLength).to.equal(3);
				expect(state.ballotCount).to.equal(3);
				expect(state.current).to.eql([['fred'], ['fred'], ['sally']]);
			});
			it('should handle newBallots without input', () => {
				const state = new State();
				const raw = '';

				const { newBallots } = mutations;

				newBallots(state, raw);
				expect(state.rawLength).to.equal(0);
				expect(state.ballotCount).to.equal(0);
				expect(state.current).to.eql([]);
			});
		});
		describe('eliminateAndContinue', () => {
			it('should work for a named candidate', () => {
				const state = new State();
				const { eliminateAndContinue } = mutations;
				state.round = [
					{candidates: [
						{n: 'a', v: [2], l: false},
						{n: 'b', v: [1], l: true},
						{n: 'c', v: [1], l: true}
					],
						roundType: roundTypeEnum.roundSummary}
				];

				eliminateAndContinue(state, 'b');

				expect(state);
			});
			it('should work for all', () => {
				const state = new State();
				const { eliminateAndContinue } = mutations;
				state.round = [
					{candidates: [
						{n: 'a', v: [1], l: false},
						{n: 'b', v: [1], l: true},
						{n: 'c', v: [1], l: true}
					],
						roundType: roundTypeEnum.roundSummary}
				];
				eliminateAndContinue(state, 'all');
				expect(state.round[1].candidates).to.eql([]);
			});
		});
		describe('newCandidates', () => {
			it('should', () => {
				const state = new State();
				const {newCandidates} = mutations;

				state.current = [
					['a'],
					['b']
				];

				newCandidates(state);
				expect(state.candidateList).to.eql(['a', 'b']);
			});
		});
		describe('pickDelimiter', () => {
			const state = new State();
			const { pickDelimiter } = mutations;
			it('should be auto prior to being run', () => {
				expect(state.delimiter).to.equal('auto');
			});
			it('should be tab when empty', () => {
				pickDelimiter(state, '');
				expect(state.delimiter).to.equal('tab');
			});
			it('should be able to detect tabs', () => {
				pickDelimiter(state, 'fred\tsally');
				expect(state.delimiter).to.equal('tab');
			});
			it('should be able to detect commas', () => {
				pickDelimiter(state, 'fred,sally');
				expect(state.delimiter).to.equal('comma');
			});
		});
		describe('pickWeightedValues', () => {
			const state = new State();
			const { pickWeightedValues } = mutations;
			it('should not set for text', () => {
				pickWeightedValues(state, 'fred');
				expect(state.voteValues).to.be.false;
			});
			it('should set for numerics', () => {
				pickWeightedValues(state, '1,fred');
				expect(state.voteValues).to.be.true;
			});
		});
		describe('setChartNoCount', () => {
			const state = new State();
			const { setChartNoCount } = mutations;
			it('should assign value', () => {
				expect(state.chartNoCount).to.equal(0);
				setChartNoCount(state, 4);
				expect(state.chartNoCount).to.equal(4);
			});
		});
		describe('setDelimiter', () => {
			const state = new State();
			const { setDelimiter } = mutations;
			it('should assign value', () => {
				expect(state.delimiter).to.equal('auto');
				setDelimiter(state, 'tab');
				expect(state.delimiter).to.equal('tab');
			});
		});
		describe('setRaw', () => {
			const state = new State();
			const { setRaw } = mutations;
			it('should assign value', () => {
				expect(state.raw).to.equal('');
				setRaw(state, 'a\nb');
				expect(state.raw).to.equal('a\nb');
			});
		});
		describe('setResetButtonEnable', () => {
			const state = new State();
			const { setResetButtonEnable } = mutations;
			it('should assign value', () => {
				expect(state.resetButtonEnabled).to.equal(false);
				setResetButtonEnable(state, true);
				expect(state.resetButtonEnabled).to.equal(true);
			});
		});
		describe('setRunButtonEnable', () => {
			const state = new State();
			const { setRunButtonEnable } = mutations;
			it('should assign value', () => {
				expect(state.runButtonEnabled).to.equal(false);
				setRunButtonEnable(state, true);
				expect(state.runButtonEnabled).to.equal(true);
			});
		});
		describe('setVisibleSanity', () => {
			const state = new State();
			const { setVisible } = mutations;
			it('should assign visibility', () => {
				expect(state.visible.sanity).to.be.false;
				setVisible(state, {sanity: true});
				expect(state.visible.sanity).to.be.true;
			});
		});
		describe('setWeightedValues', () => {
			const state = new State();
			const { setWeightedValues } = mutations;
			it('should set vote values', () => {
				expect(state.voteValues).to.eql(false);
				setWeightedValues(state, true);
				expect(state.voteValues).to.eql(true);
			});
		});
		describe('startRun', () => {
			const state = new State();
			const { startRun } = mutations;
			it('should start a run', () => {
				startRun(state);
				// check to see if stub called for library
			});
		});
		describe('updateBallotSort', () => {
			const state = new State();
			const { updateBallotSort } = mutations;
			it('should update the ballot sort', () => {
				state.ballot = [];
				updateBallotSort(state, [
					['alpha zebra'],
					['mellow llama'],
					['yellow bear']
				]);
				expect(state.ballot).to.eql([
					['alpha zebra'],
					['mellow llama'],
					['yellow bear']
				]);
			});
		});
		describe('updateDisqualified', () => {
			const state = new State();
			const { updateDisqualified } = mutations;
			it('should assing visibility', () => {
				expect(state.disqualifiedCandidates).to.eql([]);
				updateDisqualified(state, ['fred']);
				expect(state.disqualifiedCandidates).to.eql(['fred']);
			});
		});
		describe('updatePositions', () => {
			const state = new State();
			const { updatePositions } = mutations;
			it('should assing visibility', () => {
				expect(state.positions).to.equal(1);
				updatePositions(state, 4);
				expect(state.positions).to.equal(4);
			});
		});
		describe('updateSortOrder', () => {
			const state = new State();
			const { updateSortOrder } = mutations;
			it('should assing visibility', () => {
				expect(state.sortOrder).to.equal('u');
				updateSortOrder(state, 'f');
				expect(state.sortOrder).to.equal('f');
			});
		});
		describe('updateVoteValues', () => {
			const state = new State();
			const { updateVoteValues } = mutations;
			it('should assing visibility', () => {
				expect(state.voteValues).to.be.false;
				updateVoteValues(state, true);
				expect(state.voteValues).to.be.true;
			});
		});
	});
});
