import {mapGetters} from "vuex";

export default {
	computed: mapGetters({
		disableReset: 'resetButtonDisabled',
	}),
	methods: {
		resetClicked: function() {
			return this.$store.dispatch('resetClicked');
		},
	},
	name: 'resetButton'
};
