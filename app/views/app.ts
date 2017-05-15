module.exports = {
	components: {
		chart: require('./chart.vue'),
		disqualify: require('./disqualify.vue'),
		inputControlVotes: require('./inputs/ballots.vue'),
		inputControlDelimiter: require('./inputs/delimiter.vue'),
		inputControlPositions: require('./inputs/positions.vue'),
		inputControlSortOrder: require('./inputs/sort-order.vue'),
		inputControlWeightedValues: require('./inputs/weighted-values.vue'),
		results: require('./results/results.vue'),
		runButton: require('./inputs/runButton.vue'),
		sanity: require('./sanity.vue')
	},
	computed: {
		showChart() {
			return this.$store.state.visible.chart;
		},
		showDisqualify() {
			return this.$store.state.visible.disqualifyList;
		},
		showResults() {
			return this.$store.state.visible.results;
		},
		showSanity() {
			return this.$store.state.visible.sanity;
		},
	},
};
