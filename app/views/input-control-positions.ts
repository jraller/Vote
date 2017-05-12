export default {
	data: function () {
		return {
			positions: 1
		}
	},
	methods: {
		changePositions: function() {
			this.$store.commit('updatePositions', this.positions);
		}
	},
	name: 'inputControlPositions',
}

// when the tool chain supports it this should be written like the following:

// import Vue from 'vue';
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
