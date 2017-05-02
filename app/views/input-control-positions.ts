import Vue from 'vue';

import Component from 'vue-class-component';

@Component
export default class inputControlPositions extends Vue {
    disqualifyCandidates = []; // component local data

    get candidates() { //computed
        return this.$store.state.candidateList;
    }

    changeDisqualified() { //method
        this.$store.commit('updateDisqualified', this.disqualifyCandidates);
    }
}
