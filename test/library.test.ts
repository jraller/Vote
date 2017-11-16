import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai'
import {roundTypeEnum} from '../app/modules/state'
import {
	nonEmpty,
	sortCandidateList,
	eliminate,
	disqualify,
	updateCandidateList,
	runRound,
	finishRound
} from '../app/scripts/library'; //exported functions

chai.use(sinonChai);
const expect = chai.expect;

import State from '../app/modules/state';

const library = require('./../app/scripts/library'); // non-exported (except by if statement)
const isNot = library.isNot;
const countXPlace = library.countXPlace;

describe('library', () => {
	describe('nonEmpty', () => {
		it('should return true for non-empty strings', () => {
			expect(nonEmpty('a')).to.be.true;
		});
		it('should return false for empty strings', () => {
			expect(nonEmpty('')).to.be.false;
		});
	});
	describe('isNot', () => {
		it('should work as a filter function', () => {
			expect(['a', 'b'].filter(isNot, 'a')).to.eql(['b']);
			expect(['b', 'a', 'b'].filter(isNot, 'a')).to.eql(['b', 'b']);
			expect(['a'].filter(isNot, 'a')).to.eql([]);
			expect(['aa'].filter(isNot, 'a')).to.eql(['aa']);
		});
	});
	describe('sortCandidateList', () => {
		it('should return the input if unsorted is selected', () => {
			expect(sortCandidateList(['b', 'a', 'c'], 'u')).to.eql(['b', 'a', 'c']);
		});
		it('should return sorted values if first name is selected', () => {
			expect(sortCandidateList(['b', 'a', 'c'], 'f')).to.eql(['a', 'b', 'c']);
		});
		it('should return sorted values if last name is selected', () => {
			expect(sortCandidateList(['a b', 'a a', 'a c'], 'l')).to.eql(['a a', 'a b', 'a c']);
		});
	});
	describe('updateCandidateList', () => {
		it('should rebuild a candidate list', () => {
			const state = new State();
			state.candidateList = [];
			state.current = [
				['a', 'b'],
				['b', 'a'],
				['c']
			];
			updateCandidateList(state);
			expect(state.candidateList).to.eql(['a', 'b', 'c']);
		});
		it('should use ballot order', () => {
			const state = new State();
			state.candidateList = [];
			state.current = [
				['a', 'b'],
				['b', 'a'],
				['c']
			];
			state.sortOrder = 'b';
			state.ballot = ['b', '', 'c'];
			state.round.push([]);
			updateCandidateList(state);
			expect(state.candidateList).to.eql(['b', 'c', 'a']);
		});
	});
	describe('eliminate', () => {
		it('should remove targeted candidate', () => {
			const state = new State();
			state.current = [
				['a', 'b'],
				['b', 'a'],
				['c']
			];
			eliminate(state, 'a');
			expect(state.current).to.eql([['b'], ['b'], ['c']]);
		});
		it('should remove targeted candidates', () => {
			const state = new State();
			state.current = [
				['a', 'b'],
				['b', 'a'],
				['c']
			];
			eliminate(state, ['a', 'c']);
			expect(state.current).to.eql([['b'], ['b'], []]);
			// empty third entry is expected due to not shifting away empty ballots
			// this is by design to make it easier to audit initial array
			// against state at any point in the future
		});
		// TODO more tests here
	});
	describe('disqualify', () => {
		it('should remove targeted candidate', () => {
			const state = new State();
			state.current = [
				['a', 'b'],
				['b', 'a'],
				['c']
			];
			disqualify(state, ['a']);
			expect(state.current).to.eql([['b'], ['b'], ['c']]);
		});
	});
	describe('countXPlace', () => {
		it('should count correctly for voteValues equals false', () => {
			const state = new State();
			state.current = [
				['a', 'b'],
				['b', 'a'],
				['c']
			];
			state.voteValues = false;
			expect(countXPlace(state, 'a', 0)).to.equal(1);
			expect(countXPlace(state, 'b', 0)).to.equal(1);
			expect(countXPlace(state, 'c', 0)).to.equal(1);
			expect(countXPlace(state, 'a', 1)).to.equal(1);
			expect(countXPlace(state, 'b', 1)).to.equal(1);
			expect(countXPlace(state, 'c', 1)).to.equal(0);
		});
		it('should count correctly for voteValues equals true', () => {
			const state = new State();
			state.current = [
				['1', 'a', 'b'],
				['2', 'b', 'a'],
				['3', 'c']
			];
			state.voteValues = true;
			expect(countXPlace(state, 'a', 1)).to.equal(1);
			expect(countXPlace(state, 'b', 1)).to.equal(2);
			expect(countXPlace(state, 'c', 1)).to.equal(3);
			expect(countXPlace(state, 'a', 2)).to.equal(2);
			expect(countXPlace(state, 'b', 2)).to.equal(1);
			expect(countXPlace(state, 'c', 2)).to.equal(0);
		});
	});
	describe('runRound', () => {
		it('should not explode for voteValues false', () => {
			const state = new State();
			state.candidateList = ['a', 'b'];
			state.current = [
				['a'],
				['a', 'b']
			];
			state.positions = 1;
			state.round = [];
			state.voteValues = false;
			const finishStub = sinon.stub();

			runRound(state, finishStub);
			expect(state.round[0].candidates[0]).to.eql({n: 'a', v: [2], l: false});
			expect(state.round[0].candidates[1]).to.eql({n: 'b', v: [0], l: true});

			expect(finishStub.called).to.be.true;

			expect(state.round[0].roundType).to.equal(roundTypeEnum.roundSummary);
			expect(state.round.length).to.equal(1);

			finishRound(state);
			expect(state.round.length).to.equal(2);

		});
		it('should not explode for voteValues true', () => {
			const state = new State();
			state.candidateList = ['a', 'b'];
			state.current = [
				['2', 'a'],
				['1', 'a', 'b']
			];
			state.positions = 1;
			state.round = [];
			state.voteValues = true;
			const finishStub = sinon.stub();

			runRound(state, finishStub);
			expect(state.round[0].candidates[0]).to.eql({n: 'a', v: [3], l: false});
			expect(state.round[0].candidates[1]).to.eql({n: 'b', v: [0], l: true});

			expect(finishStub.called).to.be.true;

			expect(state.round[0].roundType).to.equal(roundTypeEnum.roundSummary);
			expect(state.round.length).to.equal(1);

			finishRound(state);
			expect(state.round.length).to.equal(2);

		});
		it('should work for multiple positions', () => {
			const state = new State();
			state.current = [
				['3', 'b', 'a'],
				['2', 'a', 'c'],
				['1', 'a', 'b']
			];
			state.positions = 2;
			state.sortOrder = 'f';
			state.voteValues = true;
			const finishStub = sinon.stub();

			runRound(state, finishStub);
			expect(state.round[0].candidates[0]).to.eql({n: 'a', v: [3, 3], l: false});
			expect(state.round[0].candidates[1]).to.eql({n: 'b', v: [3, 1], l: false});
			expect(state.round[0].candidates[2]).to.eql({n: 'c', v: [0, 2], l: true});

			expect(finishStub.called).to.be.true;

			expect(state.round[0].roundType).to.equal(roundTypeEnum.roundSummary);
			expect(state.round.length).to.equal(1);

			finishRound(state);
			expect(state.round.length).to.equal(2);
		});
	});
});
