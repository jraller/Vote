export default {
	data: function () {
		return {
			disqualifyCandidates: []
		}
	},
	computed: {
		candidates() {
			return this.$store.state.candidateListFull;
		}
	},
	methods: {
		changeDisqualified() {
			this.$store.commit('updateDisqualified', this.disqualifyCandidates);
			return this.$store.dispatch('inputChange');
		}
	}
}


// import Vue from 'vue';
//
// import Component from 'vue-class-component';
//
// import { // this may not be needed?
// 	State,
// 	Getter,
// 	Action,
// 	Mutation,
// 	namespace
// } from 'vuex-class';
//
// @Component
// export default class DisqualifyCandidatesList extends Vue {
// 	disqualifyCandidates: string[] = []; // component local data
//
// 	get candidates() { //computed
// 		return this.$store.state.candidateListFull;
// 	}
//
// 	changeDisqualified() { //method
// 		this.$store.commit('updateDisqualified', this.disqualifyCandidates);
// 		// this.$store.commit('newCandidates');
// 	}
// }
