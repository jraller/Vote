import $eventHub from '../../modules/eventHub';

export default {
	beforeDestroy: function () {
		$eventHub.$off('getNewBallots');
	},
	created: function () {
		// $eventHub.$on('getNewBallots', function (data) { // if some other component requests
		// 	this.$store.commit('newBallots', this.rawInput); // trigger ballot parsing
		// 	this.$store.commit('newCandidates');
		// });
	},
	mounted: function () {
		this.$nextTick(function() {
			$eventHub.$on('getNewBallots', function (data) { // if some other component requests
			});
		});
	},
	data: function () {
		return {
			rawInput: '',
		}
	},
	methods: {
		changeVotes: function () {
			this.$store.commit('setRaw', this.rawInput);
			this.$store.dispatch('inputChange');
		},
	},
	watch: {
		rawInput: function () {
		}
	},
	name: 'InputControlVotes',
};
