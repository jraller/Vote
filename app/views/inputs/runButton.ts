module.exports = {
	computed: {
		disableRun: function() {
			return this.$store.state.disableRun;
		},
	},
	methods: {
		runClicked: function() {
			this.$store.commit('runClicked');
		},
	},
};
