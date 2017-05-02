import Vue from 'vue';

import Component from 'vue-class-component';

@Component
export default class inputControlPositions extends Vue {
	positions = 1; // component local data

	changePositions() { //method
		this.$store.commit('updatePositions', this.positions);
	}
}
