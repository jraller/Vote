module.exports = {
	components: {
		round: require('./round.vue'),
	},
	computed: {
		roundCount() {
			return this.$store.state.round.length;
		},
	},
};
