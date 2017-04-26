module.exports = {
    data: function (){
        return {
            delimiter: 'a',
            voteValues: false,
            trigger: '',
            rawInput: ''
        }
    },
    methods: {
        changeVotes: function() {
            this.$emit('inputChange', 'votes');
            this.$store.commit('newBallots', this.rawInput);
            this.$store.commit('newCandidates');
        },
        changeDelimiter: function() {
            this.$store.commit('changeDelimiter', this.delimiter);
        },
        changeVoteValues: function() {
            this.$emit('inputChange', 'voteValues');
        }
    }
};
