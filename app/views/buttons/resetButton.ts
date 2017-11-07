import {mapGetters} from "vuex";

export default {
	computed: mapGetters({
		disableReset: 'resetButtonDisabled',
	}),
	methods: {
		resetClicked: function() {
			this.$store.dispatch('resetClicked');
		},
	},
	name: 'resetButton'
};
