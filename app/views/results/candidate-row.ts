module.exports = {
	computed: {
		candidateTotal() {
			return this.candidate.v.reduce((a, b) => a + b);
		},
		candidatePercent() {
			return  (this.candidateTotal/this.total * 100).toFixed(2) + '%';
		},
		lowVotes() {
			return this.candidate.l;
		},
		positions() {
			return this.$store.state.positions;
		},
	},
	props: ['candidate', 'round', 'total'],
};
