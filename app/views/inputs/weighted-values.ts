import $eventHub from '../../modules/eventHub';

export default {
	data: function () {
		return {
			voteValues: false
		}
	},
	name: 'inputControlWeightedValues',
	mounted: function () {
		this.$nextTick(function() {
			$eventHub.$on('changeVoteValues', (data) => {
				this.voteValues = data;
			});
		});
	},
	watch: {
		voteValues: function() {
			this.$store.commit('updateVoteValues', this.voteValues);
			return this.$store.dispatch('inputChange');
		}
	}
};
