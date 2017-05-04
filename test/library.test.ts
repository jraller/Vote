import {expect} from 'chai';
import * as library from './../app/scripts/library';

describe('library', () => {
	describe('nonEmpty', () => {
		it('should return true for non-empty strings', () => {
			expect(library.nonEmpty('a')).to.be.true;
		});
		it('should return false for empty strings', () => {
			expect(library.nonEmpty('')).to.be.false;
		});
	});
	describe('sortCandidateList', () => {
		it('should return the input if unsorted is selected', () => {
			expect(library.sortCandidateList(['b','a','c'],'u')).to.eql(['b','a','c']);
		});
		it('should return sorted values if first name is selected', () => {
			expect(library.sortCandidateList(['b','a','c'],'f')).to.eql(['a','b','c']);
		});
		it('should return sorted values if last name is selected', () => {
			expect(library.sortCandidateList(['a b','a a','a c'],'l')).to.eql(['a a','a b','a c']);
		});
	});
});
