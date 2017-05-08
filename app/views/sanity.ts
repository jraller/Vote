import {mapGetters} from 'vuex';

module.exports = {
	computed: {
		...mapGetters([
			'skippedBallots',
			'noCandidatesLeft'
		])
	},
	name: 'SanityChecks',
};
