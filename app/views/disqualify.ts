import Vue from 'vue';

import Component from 'vue-class-component';

import { // this may not be needed?
    State,
    Getter,
    Action,
    Mutation,
    namespace
} from 'vuex-class';

@Component
export default class DisqualifyCandidatesList extends Vue {
    disqualifyCandidates = []; // component local data

    get candidates() { //computed
        return this.$store.state.candidateList;
    }

    changeDisqualified() { //method
        this.$store.commit('updateDisqualified', this.disqualifyCandidates);
    }
}
