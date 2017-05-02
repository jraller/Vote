export default {
	data: function () {
		return {
			rawInput: '',
		}
	},
	methods: {
		changeVotes: function () {
			if (this.rawInput === '') {
				this.$store.commit('setDelimiter', 'auto');
			} else if (this.$store.state.delimiter === 'auto') {
				this.$store.commit('pickDelimiter', this.rawInput);
				this.$store.commit('pickWeightedValues', this.rawInput);
			}
			this.$store.commit('newBallots', this.rawInput);
			this.$store.commit('newCandidates');
		},
	},
	name: 'InputControlVotes',
};
