module.exports = {
	computed: {
		choices() {
			return this.$store.state
				.round[this.round - 1].candidates.filter((c) => c.l === true)
				.map((c) => c.n)
				.concat(['all']);
		},
	},
	methods: {
		eliminate(who) {
			this.$store.commit('eliminateAndContinue', who);
		}
	},
	props: ['round'],
};
