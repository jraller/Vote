import {mapGetters} from "vuex";

export default {
	computed: mapGetters({
		disableRun: 'runButtonEnabled',
	}),
	methods: {
		runClicked: function() {
			this.$store.dispatch('runClicked');
		},
	},
	name: 'runButton'
};
