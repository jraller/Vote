import {mapMutations} from 'vuex';

import {Delimiters} from '../scripts/delimiters';

const delimiters = new Delimiters;

module.exports = {
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
			voteValues: false,
			trigger: '',
			rawInput: ''
		}
	},
	methods: {
		// ...mapMutations([
		//     'changeDelimiter' // payload for this isn't fully handled?
		// ]),
		// ...mapMutations({
		//     fred: 'changeFred'
		// }),
		changeVotes: function () {
			this.$emit('inputChange', 'votes');
			if (this.rawInput === '') {
				this.$store.commit('setDelimiter', '-1');
			} else if (this.delimiter === '-1') {
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
		getCode: function(d) {
			return delimiters.getCode(d);
		},
		getDescription: (d) => {
			return delimiters.getDescription(d);
		},
		getDisabled: (d) => {
			return d === 'auto';
		},
	}
};
