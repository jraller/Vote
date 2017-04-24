module.exports = {
    components: {
        chart: require('./chart.vue'),
        disqualify: require('./disqualify.vue'),
        inputs: require('./inputs.vue'),
        results: require('./results.vue'),
        sanity: require('./sanity.vue')
    },
    data: function() {
        return {
            message: 'app level message',
            showDisqualify: true,
            showSanity: true,
            showResults: true,
            showChart: true
        }
    }
};
