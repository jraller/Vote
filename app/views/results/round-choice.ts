module.exports = {
	computed: {
		choices() {
			let response = this.$store.state.round[this.round - 1].candidates;
			response = response.filter((c) => c.l === true)
				.map((c) => c.n);
			if (response.length < this.$store.state.candidateList.length) {
				response = response.concat(['all']);
			}
			return response;
		},
	},
	data: function () {
		return {
			chosen: '',
			disableButtons: false,
		}
	},
	methods: {
		eliminate(who) {
			if (who === 'all') {
				this.chosen = 'Everyone who tied for last'
			} else {
				this.chosen = '"' + who + '"';
			}
			this.$store.commit('eliminateAndContinue', who);
			this.disableButtons = true;
		}
	},
	props: ['round'],
};
