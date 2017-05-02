module.exports = {
	components: {
		round: require('./round.vue'),
	},
	computed: {
		roundCount() {
			console.log('round count', this.$store.state.round.length);
			return this.$store.state.round.length;
		},
	},
};
