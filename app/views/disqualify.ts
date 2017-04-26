module.exports = {
    computed: {
        candidates() {
            return this.$store.state.candidateList;
        }
    },
    data: function() {
        return {
            disqualifyCandidates: []
        }
    },
    methods: {
        changeDisqualified: function() {
            this.$store.commit('updateDisqualified', this.disqualifyCandidates);
        }
    }
};
