module.exports = {
	computed: {
		eliminated() {
			return this.$store.state
				.round[this.round - 1].candidates.filter((c) => c.l === true)
				.map((c) => c.n)
				.join(', ');
		},
	},
	props: ['round'],
};
