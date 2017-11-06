import {mapGetters} from "vuex";

export default {
	computed: mapGetters({
		disableReset: 'resetButtonEnabled',
	}),
	methods: {
		resetClicked: function() {
			this.$store.dispatch('resetClicked');
		},
	},
	name: 'resetButton'
};
