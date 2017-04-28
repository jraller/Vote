import { mapMutations } from 'vuex';

module.exports = {
    computed: {
      delimiter() {
          return this.$store.state.delimiter;
      }
    },
    data: function (){
        return {
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
            if (this.rawInput === '') {
                this.$store.commit('setDelimiter', 'a');
            } else if (this.delimiter === 'a') {
                this.$store.commit('pickDelimiter', this.rawInput);
            }
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
