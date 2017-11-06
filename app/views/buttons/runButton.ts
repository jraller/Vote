module.exports = {
	computed: {
		disableRun: function() {
			return this.$store.state.runButtonEnabled === false;
		},
	},
	methods: {
		runClicked: function() {
			this.$store.dispatch('runClicked');
		},
	},
	name: 'runButton'
};
