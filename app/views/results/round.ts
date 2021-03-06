import {ICandidateType} from '../../modules/state';

export default {
	components: {
		candidateRow: require('./candidate-row.vue').default,
		roundSummary: require('./round-summary.vue').default,
		roundChoice: require('./round-choice.vue').default,
	},
	computed: {
		positions() {
			return this.$store.state.positions;
		},
		candidates() {
			return this.$store.state.round[this.index].candidates;
		},
		roundType() {
			return this.$store.state.round[this.index].roundType;
		},
		total() {
			const votes = this.$store.state.round[this.index].candidates
				.reduce((a: ICandidateType[], b: ICandidateType) => [...a, ...b.v], []);
			return votes.reduce((a: number, b: number) => a + b);
		},
		voteValues() {
			return this.$store.state.voteValues;
		}
	},
	props: ['round', 'index'],
};
