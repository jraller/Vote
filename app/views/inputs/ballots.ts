import $eventHub from '../../modules/eventHub';

export default {
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
	name: 'InputControlVotes',
};
