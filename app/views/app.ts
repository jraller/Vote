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
	data: function () {
		return {
			showDisqualify: true,
			showSanity: true,
			showResults: true,
			showChart: true,
		}
	}
};
