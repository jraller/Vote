export default {
	components: {
		chart: require('./chart/chart.vue').default,
		disqualify: require('./inputs/disqualify.vue').default,
		inputControlVotes: require('./inputs/ballots.vue').default,
		inputControlDelimiter: require('./inputs/delimiter.vue').default,
		inputControlPositions: require('./inputs/positions.vue').default,
		inputControlSortOrder: require('./inputs/sort-order.vue').default,
		inputControlWeightedValues: require('./inputs/weighted-values.vue').default,
		results: require('./results/results.vue').default,
		runButton: require('./buttons/runButton.vue').default,
		resetButton: require('./buttons/resetButton.vue').default,
		sanity: require('./checks/sanity.vue').default
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
	name: 'STVRunner',
};
