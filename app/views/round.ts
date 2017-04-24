module.exports = {
    components: {
        roundSummary: require('./round-summary.vue'),
        roundChoice: require('./round-choice.vue'),
    },
    data: function() {
        return {
            candidates: [
                'fred',
                'george',
                'sally'
            ],
            roundType: 'roundSummary',
            positions: 4
        }
    },
    props: [
        'name'
    ]
};
