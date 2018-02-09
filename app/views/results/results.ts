export default {
	components: {
		round: require('./round.vue').default,
	},
	computed: {
		roundCount() {
			return this.$store.state.round.length;
		},
	},
};
