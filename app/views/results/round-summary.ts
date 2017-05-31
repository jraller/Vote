import {ICandidateType} from '../../modules/state';

module.exports = {
	computed: {
		eliminated() {
			return this.$store.state
				.round[this.round - 1].candidates.filter((c: ICandidateType) => c.l === true)
				.map((c: ICandidateType) => c.n)
				.join(', ');
		},
	},
	props: ['round'],
};
