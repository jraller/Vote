import {mapGetters} from "vuex";

export default {
	computed: mapGetters({
		disableRun: 'runButtonDisabled',
	}),
	methods: {
		runClicked: function() {
			return this.$store.dispatch('runClicked');
		},
	},
	name: 'runButton'
};
