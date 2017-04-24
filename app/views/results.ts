module.exports = {
    components: {
        round: require('./round.vue'),
    },
    data: function() {
        return {
            rounds: [
                {
                    name: '1'
                },
                {
                    name: '2'
                }
            ]
        }
    }
};
