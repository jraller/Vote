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
			return this.$store.dispatch('inputChange');
		},
	},
	name: 'InputControlVotes',
};
