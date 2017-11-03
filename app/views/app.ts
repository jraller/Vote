export default {
	components: {
		chart: require('./chart/chart.vue'),
		disqualify: require('./inputs/disqualify.vue'),
		inputControlVotes: require('./inputs/ballots.vue'),
		inputControlDelimiter: require('./inputs/delimiter.vue'),
		inputControlPositions: require('./inputs/positions.vue'),
		inputControlSortOrder: require('./inputs/sort-order.vue'),
		inputControlWeightedValues: require('./inputs/weighted-values.vue'),
		results: require('./results/results.vue'),
		runButton: require('./buttons/runButton.vue'),
		resetButton: require('./buttons/resetButton.vue'),
		sanity: require('./checks/sanity.vue')
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

// TODO consider adding button next to run that unlocks inputs, lock (disable) inputs on run?
