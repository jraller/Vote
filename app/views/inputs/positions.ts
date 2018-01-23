import $eventHub from '../../modules/eventHub';

export default {
	data: function () {
		return {
			positions: 1
		}
	},
	name: 'inputControlPositions',
	watch: {
		positions: function () {
			this.$store.commit('updatePositions', this.positions);
			return this.$store.dispatch('inputChange');
		}
	}
}

// when the tool chain supports it this should be written like the following:

// import Vue from 'vue';
// import VueX from 'vuex';
//
// Vue.use(VueX);
//
// import Component from 'vue-class-component';
//
// @Component
// export default class inputControlPositions extends Vue {
// 	positions = 1; // component local data
//
// 	changePositions() { //method
// 		this.$store.commit('updatePositions', this.positions);
// 	}
// }
