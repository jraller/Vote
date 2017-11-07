import { Selector } from 'testcafe';
import VueSelector from 'testcafe-vue-selectors';

fixture `Vote`
	.page `http://localhost:8000`;

const rootVue = VueSelector();
// https://github.com/DevExpress/testcafe-vue-selectors

const runButton = Selector('button')
	.withText('Run');
const resetButton = Selector('button')
	.withText('Reset');
const positions = Selector('#positions');
const resultRows = Selector('tbody')
	.nth(-1)
	.find('tr');

const chart = Selector('#chart');

test('a case', async t => {
	await t
		.typeText('#votes', 'a')
		.pressKey('tab')
		.click(runButton)
		.expect(
			resultRows
				.find('td')
				.nth(0)
				.textContent
		).eql('a') // last tbody row first cell shows a as winner
		.expect(
			resultRows
				.find('td')
				.nth(-2)
				.textContent
		).eql('1') // with two votes as total votes
		.expect(
			chart
				.find('.link')
				.count
		).eql(1) // chart has one link All Cast -> a
		.expect(
			chart
				.find('.node')
				.count
		).eql(2); // joining two nodes All Cast, a
});

test('ab 2 positions case', async t => {
	await t
		.typeText('#votes', 'a\na\nb')
		.pressKey('tab')
		.typeText(positions, '2',{replace: true})
		.click(runButton)
		.expect(
			resultRows
				.nth(0)
				.find('td')
				.nth(0)
				.textContent
		).eql('a') // last tbody first row first cell shows a as winner
		.expect(
			resultRows
				.nth(1)
				.find('td')
				.nth(0)
				.textContent
		).eql('b') // last tbody second row first cell shows b as winner
		.expect(
			resultRows
				.nth(0)
				.find('td')
				.nth(-2)
				.textContent
		).eql('2') // with two votes for a as total votes
		.expect(
			resultRows
				.nth(1)
				.find('td')
				.nth(-2)
				.textContent
		).eql('1') // with one vote for b as total votes
		.expect(
			chart
				.find('.link')
				.count
		).eql(2) // chart has four links All Cast -> a, b
		.expect(
			chart
				.find('.node')
				.count
		).eql(3); // three nodes All Cast, a, b
});

test('a,a,b case', async t => {
	await t
		.typeText('#votes', 'a\na\nb')
		.pressKey('tab')
		.click(runButton)
		.expect(
			resultRows
				.find('td')
				.nth(0)
				.textContent
			).eql('a') // last tbody row first cell shows a as winner
		.expect(
			resultRows
				.find('td')
				.nth(-2)
				.textContent
		).eql('2') // with two votes as total votes
		.expect(
			chart
				.find('.link')
				.count
			).eql(4) // chart has four links
		.expect(
			chart
				.find('.node')
				.count
			).eql(5); // joining five nodes
});

test('a,a,ba case', async t => {
	await t
		.typeText('#votes', 'a\na\nb,a')
		.pressKey('tab')
		.click(runButton)
		.expect(
			resultRows
				.find('td')
				.nth(0)
				.textContent
		).eql('a') // a is winner
		.expect(
			resultRows
				.find('td')
				.nth(-2)
				.textContent
		).eql('3') // with three votes
		.expect(
			chart
				.find('.link')
				.count
		).eql(4) // chart has four links
		.expect(
			chart
				.find('.node')
				.count
		).eql(4); // between four nodes because there is no lost vote node
});
