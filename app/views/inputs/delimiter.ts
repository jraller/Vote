import $eventHub from '../../modules/eventHub';

import {Delimiters} from '../../scripts/delimiters';

const delimiters = new Delimiters;

export default {
	computed: {
		delimiter:{
			get: function () {
				return this.$store.state.delimiter;
			},
			set: function (newValue) {
			}
		},
		delimiterList() {
			return this.$store.state.delimiterList;
		},
	},
	methods: {
		changeDelimiter: function () {
			this.$store.commit('setDelimiter', this.$refs.delimiter.value);
			$eventHub.$emit('getNewBallots');
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
