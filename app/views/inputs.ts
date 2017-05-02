import {mapMutations} from 'vuex';

import {Delimiters} from '../scripts/delimiters';

const delimiters = new Delimiters;

// look into https://github.com/vuejs/vue-class-component
// which seems to want https://github.com/ktsn/vuex-class
// also look at https://github.com/kaorun343/vue-property-decorator

export default {
	computed: {
		delimiter() {
			return this.$store.state.delimiter;
		},
		delimiterList() {
			return this.$store.state.delimiterList;
		},
	},
	data: function () {
		return {
			rawInput: '',
			voteValues: false,
		}
	},
	methods: {
		// ...mapMutations([
		//     'changeDelimiter' // payload for this isn't fully handled?
		// ]),
		changeVotes: function () {
			this.$emit('inputChange', 'votes');
			if (this.rawInput === '') {
				this.$store.commit('setDelimiter', 'auto');
			} else if (this.delimiter === 'auto') {
				this.$store.commit('pickDelimiter', this.rawInput);
			}
			this.$store.commit('newBallots', this.rawInput);
			this.$store.commit('newCandidates');
		},
		changeDelimiter: function() {
			this.$store.commit('setDelimiter', this.$refs.delimiter.value);
			this.$store.commit('newBallots', this.rawInput);
			this.$store.commit('newCandidates');
		},
		changeVoteValues: function() {
			this.$emit('inputChange', 'voteValues');
			this.$store.commit('newBallots', this.rawInput);
			this.$store.commit('newCandidates');
		},
		getDescription: (d) => {
			return delimiters.getDescription(d);
		},
		getDisabled: (d) => {
			return d === 'auto';
		},
	},
	name: 'TallyInputs',
};
