import {Delimiters} from '../../scripts/delimiters';

const delimiters = new Delimiters;

export default {
	computed: {
		delimiter() {
			return this.$store.state.delimiter;
		},
		delimiterList() {
			return this.$store.state.delimiterList;
		},
	},
	methods: {
		changeDelimiter: function () {
			this.$store.commit('setDelimiter', this.$refs.delimiter.value);
			this.eventHub.$emit('getNewBallots');
			this.$store.commit('newCandidates');
		},
		getDescription: (d: string) => {
			return delimiters.getDescription(d);
		},
		getDisabled: (d: string) => {
			return d === 'auto';
		},
	},
	name: 'inputControlDelimiter',
};
