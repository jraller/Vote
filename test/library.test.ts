import {expect} from 'chai';
import {nonEmpty, isNot, sortCandidateList} from './../app/scripts/library';

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
});
