module.exports = {
	components: {
		chart: require('./chart.vue'),
		disqualify: require('./disqualify.vue'),
		inputControlVotes: require('./input-control-votes.vue'),
		inputControlDelimiter: require('./input-control-delimiter.vue'),
		inputControlPositions: require('./input-control-positions.vue'),
		inputControlSortOrder: require('./input-control-sort-order.vue'),
		inputControlWeightedValues: require('./input-control-weighted-values.vue'),
		results: require('./results.vue'),
		runButton: require('./runButton.vue'),
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
