module.exports = {
	components: {
		roundSummary: require('./round-summary.vue'),
		roundChoice: require('./round-choice.vue'),
	},
	computed: {
		positions() {
			return this.$store.state.positions;
		},
		candidates() {
			console.log('round', this.round);
			console.log('candidates', this.$store.state.round[this.index].candidates);
			return this.$store.state.round[this.index].candidates;
		},
		roundType() {
			return this.$store.state.round[this.index].roundType;
		},
	},
	props: ['round', 'index'],
};
