module.exports = {
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
		// candidateTotal() {
		// 	return this.candidate.v.reduce((a, b) => a + b);
		// },
		// candidatePercent() {
		// 	return (this.candidateTotal / this.total * 100).toFixed(2) + '%';
		// },
		// lowVotes() {
		// 	return this.candidate.l;
		// },
		// positions() {
		// 	return this.$store.state.positions;
		// },
	},
	props: ['candidate', 'round', 'total'],
};
