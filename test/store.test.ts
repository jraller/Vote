import { expect } from 'chai';
import 'babel-polyfill';

import State, {roundTypeEnum} from '../app/modules/state';
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
		const state = new State();
		const { runClicked } = mutations;
		state.round = [
			{candidates: [
				{n: 'a', v: [2], l: false},
				{n: 'b', v: [1], l: true}
			],
				roundType: roundTypeEnum.roundSummary}
		];
		it('should make results visible', () => {
			runClicked(state);
			expect(state.visible.results).to.be.true;
		});
		it('should make results visible', () => {
			state.disqualifiedCandidates = ['fred'];
			state.current = [['fred', 'sally']];
			runClicked(state);
			expect(state.current).to.eql([['sally']]);
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
	describe('setVisibleSanity', () => {
		const state = new State();
		const { setVisibleSanity } = mutations;
		it('should assing visibility', () => {
			expect(state.visible.sanity).to.be.false;
			setVisibleSanity(state, true);
			expect(state.visible.sanity).to.be.true;
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
