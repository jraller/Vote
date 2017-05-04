import {Delimiters} from './../app/scripts/delimiters';
import {expect} from 'chai';

describe('delimiters', () => {
	const delimiter = new Delimiters();
	describe('listDelimiters', () => {
		it('should list tab among the delimiters', () => {
			expect(delimiter.listDelimiters()).to.contain('tab');
		});
	});
	describe('getCode', () => {
		it('should return 9 for tab', () => {
			expect(delimiter.getCode('tab')).to.equal(9);
		});
	});
	describe('getDescription', () => {
		it('should return Tab for tab', () => {
			expect(delimiter.getDescription('tab')).to.equal('Tab');
		});
	});
	describe('pickDelimiter', () => {
		it('should select the right delimiter for a comma separated input', () => {
			expect(delimiter.pickDelimiter('fred,sally\nsally')).to.equal('comma');
		});
		it('should select the right delimiter for a tab separated input', () => {
			expect(delimiter.pickDelimiter('fred\tsally\nsally')).to.equal('tab');
		});
		it('should default to tab', () => {
			expect(delimiter.pickDelimiter('fred\nsally\nsally')).to.equal('tab');
		});
	});
});
