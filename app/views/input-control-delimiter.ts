import {Delimiters} from '../scripts/delimiters';

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
			// refresh from votes to current here
			this.$store.commit('newCandidates');
		},
		getDescription: (d) => {
			return delimiters.getDescription(d);
		},
		getDisabled: (d) => {
			return d === 'auto';
		},
	},
	name: 'inputControlDelimiter',
};
