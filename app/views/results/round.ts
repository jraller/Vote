module.exports = {
	components: {
		candidateRow: require('./candidate-row.vue'),
		roundSummary: require('./round-summary.vue'),
		roundChoice: require('./round-choice.vue'),
	},
	computed: {
		positions() {
			return this.$store.state.positions;
		},
		candidates() {
			return this.$store.state.round[this.index].candidates;
		},
		roundType() {
			return this.$store.state.round[this.index].roundType;
		},
		total() {
			const votes = this.$store.state.round[this.index].candidates
				.reduce((a, b) => [...a, ...b.v], []);
			return votes.reduce((a, b) => a + b);
		},
		voteValues() {
			return this.$store.state.voteValues;
		}
	},
	props: ['round', 'index'],
};
