export default {
	data: function () {
		return {
			sortOrder: 'u',
			ballotOrder: '',
			orders: [
				{order: "u", text: "unsorted"},
				{order: "b", text: "ballot"},
				{order: "f", text: "first name"},
				{order: "l", text: "last name"}
			]
		}
	},
	methods: {
		changeSortOrder() {
			this.$store.commit('updateSortOrder', this.sortOrder);
			return this.$store.dispatch('inputChange');
		}
	},
	name: 'inputSortOrder',
	watch: {
		ballotOrder: function () {
			this.$store.commit('updateBallotSort', this.ballotOrder.split('\n'));
		}
	}
}

// import Vue from 'vue';
//
// import Component from 'vue-class-component';
//
// @Component
// export default class inputControlSortOrder extends Vue {
//     sortOrder = 'u'; // component local data
//
//     changeSortOrder() { //method
//         this.$store.commit('updateSortOrder', this.sortOrder);
//         this.$store.commit('newCandidates');
//     }
// }
