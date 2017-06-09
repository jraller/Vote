export default {
	computed: {
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
		positions: function () {
			return this.$store.state.positions;
		},
	},
	name: 'candidateRow',
	props: ['candidate', 'round', 'total'],
};
