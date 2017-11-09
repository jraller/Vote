import {mapGetters} from "vuex";

export default {
	computed: {
		...mapGetters(['positions',]),
		candidateTotal: function () {
			return this.candidate.v.reduce(function(a, b) {
				return a + b;
			});
		},
		candidatePercent: function () {
			return (this.candidateTotal / this.total * 100).toFixed(2) + '%';
		},
		lowVotes: function () {
			return this.candidate.l;
		},
	},
	name: 'candidateRow',
	props: ['candidate', 'round', 'total'],
};
