import { mapMutations } from 'vuex';

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
        // ...mapMutations([
        //     'changeDelimiter' // payload for this isn't fully handled?
        // ]),
        // ...mapMutations({
        //     fred: 'changeFred'
        // }),
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
