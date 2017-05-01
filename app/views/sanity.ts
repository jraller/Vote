import { mapGetters } from 'vuex';

module.exports = {
    computed: {
        // diff () {
        //     return this.$store.getters.skippedBallots;
        // },
        ...mapGetters([
            'skippedBallots'
        ])
    },
    name: 'SanityChecks',
};
