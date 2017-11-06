module.exports = {
	computed: {
		// TODO review for additional tests?
		skippedBallots() {
			const test = (this.$store.state.rawLength > 1) && (this.$store.state.rawLength - this.$store.state.ballotCount > 0);
			this.triggers.skipped = test;
			this.$store.commit('setVisible', {sanity: this.check()});
			return test;
		},
		noCandidatesLeft() {
			const test = (this.$store.state.rawLength > 0)
				&& ( // TODO fix this logic so that it compares against full candidate list?
					(this.$store.state.candidateList.length === this.$store.state.disqualifiedCandidates.length)
				);
			this.triggers.noneLeft = test;
			this.$store.commit('setVisible', {sanity: this.check()});
			return test;
		},
		notEnoughCandidates() {
			const test = (this.$store.state.rawLength > 0)
				&& (
					(this.$store.state.candidateList.length - this.$store.state.disqualifiedCandidates.length)
					< this.$store.state.positions
				);
			this.triggers.notEnoughLeft = test;
			this.$store.commit('setVisible', {sanity: this.check()});
			return test;
		},
	},
	data: function() {
		return {
			triggers: {
				skipped: false,
				noneLeft: false,
				notEnoughLeft: false,
			},
		}
	},
	methods: {
		check() {
			// instead of iterating an index in triggers, could I iterate computed and consider only certain bits?
			let check = false;
			for (const key in this.triggers) {
				if (this.triggers.hasOwnProperty(key)) {
					check = check || this.triggers[key];
				}
			}
			return check;
		}
	},
	name: 'SanityChecks',
};
