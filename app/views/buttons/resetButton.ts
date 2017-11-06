module.exports = {
	computed: {
		disableReset: function() {
			return this.$store.state.resetButtonEnabled === false;
		},
	},
	methods: {
		resetClicked: function() {
			this.$store.dispatch('resetClicked');
		},
	},
	name: 'resetButton'
};
