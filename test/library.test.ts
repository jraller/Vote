import {expect} from 'chai';
import {nonEmpty, sortCandidateList, eliminate, disqualify, updateCandidateList} from './../app/scripts/library'; //exported functions

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
			expect(['a','b'].filter(isNot, 'a')).to.eql(['b']);
			expect(['b', 'a', 'b'].filter(isNot, 'a')).to.eql(['b', 'b']);
			expect(['a'].filter(isNot, 'a')).to.eql([]);
			expect(['aa'].filter(isNot, 'a')).to.eql(['aa']);
		});
	});
	describe('sortCandidateList', () => {
		it('should return the input if unsorted is selected', () => {
			expect(sortCandidateList(['b','a','c'],'u')).to.eql(['b','a','c']);
		});
		it('should return sorted values if first name is selected', () => {
			expect(sortCandidateList(['b','a','c'],'f')).to.eql(['a','b','c']);
		});
		it('should return sorted values if last name is selected', () => {
			expect(sortCandidateList(['a b','a a','a c'],'l')).to.eql(['a a','a b','a c']);
		});
	});
	describe('eliminate', () => {
		it('should remove targeted candidate', () => {
			const state = {
				current: [
					['a', 'b'],
					['b', 'a'],
					['c']
				]
			};
			eliminate(state, 'a');
			expect(state.current).to.eql([['b'], ['b'], ['c']]);
		});
	});
	describe('disqualify', () => {
		it('should remove targeted candidate', () => {
			const state = {
				current: [
					['a', 'b'],
					['b', 'a'],
					['c']
				]
			};
			disqualify(state, 'a');
			expect(state.current).to.eql([['b'], ['b'], ['c']]);
		});
	});
	describe('updateCandidateList', () => {
		it('should rebuild a candidate list', () => {
			const state = {
				candidateList : [],
				current: [
					['a', 'b'],
					['b', 'a'],
					['c']
				]
			};
			updateCandidateList(state);
			expect(state.candidateList).to.eql(['a', 'b', 'c']);
		});
	});
	describe('countXPlace', () => {
		it('should count correctly for voteValues equals false', () => {
			const state = {
				current: [
					['a', 'b'],
					['b', 'a'],
					['c']
				],
				voteValues: false
			};
			expect(countXPlace(state, 'a', 0)).to.equal(1);
			expect(countXPlace(state, 'b', 0)).to.equal(1);
			expect(countXPlace(state, 'c', 0)).to.equal(1);
			expect(countXPlace(state, 'a', 1)).to.equal(1);
			expect(countXPlace(state, 'b', 1)).to.equal(1);
			expect(countXPlace(state, 'c', 1)).to.equal(0);
		});
		it('should count correctly for voteValues equals true', () => {
			const state = {
				current: [
					[1, 'a', 'b'],
					[2, 'b', 'a'],
					[3, 'c']
				],
				voteValues: true
			};
			expect(countXPlace(state, 'a', 1)).to.equal(1);
			expect(countXPlace(state, 'b', 1)).to.equal(2);
			expect(countXPlace(state, 'c', 1)).to.equal(3);
			expect(countXPlace(state, 'a', 2)).to.equal(2);
			expect(countXPlace(state, 'b', 2)).to.equal(1);
			expect(countXPlace(state, 'c', 2)).to.equal(0);
		});
	});
});
