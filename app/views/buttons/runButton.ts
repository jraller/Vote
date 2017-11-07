import {mapGetters} from "vuex";

export default {
	computed: mapGetters({
		disableRun: 'runButtonDisabled',
	}),
	methods: {
		runClicked: function() {
			this.$store.dispatch('runClicked');
		},
	},
	name: 'runButton'
};
