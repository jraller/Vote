import Vue from 'vue';

import Component from 'vue-class-component';

@Component
export default class inputControlWeightedValues extends Vue {
    voteValues = []; // component local data

    get candidates() { //computed
        return this.$store.state.voteValues;
    }

    changeDisqualified() { //method
        this.$store.commit('updateVoteValues', this.voteValues);
    }
}
