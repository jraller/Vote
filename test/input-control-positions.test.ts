import * as Avoriaz from 'avoriaz';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai'
import Vue from 'vue';
import 'babel-polyfill';

chai.use(sinonChai);

const Positions = require('../app/views/inputs/positions.vue');

const expect = chai.expect;
const mount = Avoriaz.mount;

describe('Positions', () => {

	const wrapper = mount(Positions, {});

	it('is a Vue component', () => {
		expect(wrapper.isVueComponent).to.be.true;
	});
	it('has the right name', () => {
		expect(wrapper.name()).to.equal('inputControlPositions');
	});
	it('notifies the store when changed', () => {
		expect(wrapper.data().positions).to.equal(1);
		wrapper.setData({positions: 2});
		wrapper.find('#positions')[0].trigger('change');
		expect(wrapper.data().positions).to.equal(2);
	});
});
