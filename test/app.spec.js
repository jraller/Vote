/* global browser, element, by */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiSmoothie = require('chai-smoothie');

chai.use(chaiAsPromised);
chai.use(chaiSmoothie);
const expect = chai.expect;

describe('e2e first test', function() {

	it('easy', function() {
		expect(1 + 1).to.equal(2);
	});

	it('should enable run', function(done) {
		// this.timeout(10000);
		try {
			browser.waitForAngularEnabled(false);
			browser.get('http://localhost:8000/');
			expect({foo: 'bar'}).to.have.property('foo');

			const runButton = element(by.buttonText('Run'));

			expect(runButton).to.be.displayed;
			expect(runButton).not.to.be.enabled;

			element(by.id('votes')).sendKeys('a\na\na\nb\nb\nc\t');

			expect(runButton).to.be.enabled;
			done();

		} catch (error) {
			done(error);
		}
	});
});
