module.exports = {
	computed: {
		disableReset: function() {
			return this.$store.state.disableReset;
		},
	},
	methods: {
		resetClicked: function() {
			this.$store.commit('resetClicked');
		},
	},
};
