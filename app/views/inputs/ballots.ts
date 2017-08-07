export default {
	created: function () {
		this.eventHub.$on('getNewBallots', function (data) { // if some other component requests
			this.$store.commit('newBallots', this.rawInput); // trigger ballot parsing
			this.$store.commit('newCandidates');
		});
	},
	data: function () {
		return {
			rawInput: '',
		}
	},
	methods: {
		changeVotes: function () {
			if (this.rawInput === '') { // if input is empty
				this.$store.commit('setDelimiter', 'auto'); // reset delimiter to auto select
			} else if (this.$store.state.delimiter === 'auto') { // if input has content and delimiter is auto
				this.$store.commit('pickDelimiter', this.rawInput); // select delimiter
				this.$store.commit('pickWeightedValues', this.rawInput); // select weighted values as well
			}
			this.$store.commit('newBallots', this.rawInput); // trigger ballot parsing
			this.$store.commit('newCandidates'); // trigger building of candidate list
		},
	},
	name: 'InputControlVotes',
};
