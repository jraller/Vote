import { expect } from 'chai';
import 'babel-polyfill';

import State from '../app/modules/state';
import { mutations } from '../app/modules/store';

describe('store', () => {
	describe('newBallots', () => {
		it('should handle newBallots with input', () => {
			const state = new State();
			const raw = 'fred\nfred\nsally';

			const { newBallots } = mutations;

			newBallots(state, raw);
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
		it('should work for a named canidate', () => {
			const state = new State();
			const { eliminateAndContinue } = mutations;

			eliminateAndContinue(state, 'fred');

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
				roundType: 'roundSummary'}
			];

			eliminateAndContinue(state, 'all');

			// TODO fix test

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
	describe('runClicked', () => {
		it('should', () => {
			// TODO fix test
		});
	});
});
