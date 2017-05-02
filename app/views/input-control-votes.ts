export default {
    data: function () {
        return {
            rawInput: '',
        }
    },
    methods: {
        changeVotes: function () {
            this.$emit('inputChange', 'votes');
            if (this.rawInput === '') {
                this.$store.commit('setDelimiter', 'auto');
            } else if (this.delimiter === 'auto') {
                this.$store.commit('pickDelimiter', this.rawInput);
            }
            this.$store.commit('newBallots', this.rawInput);
            this.$store.commit('newCandidates');
        },
    },
    name: 'InputControlVotes',
};
