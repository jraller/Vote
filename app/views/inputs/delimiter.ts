import $eventHub from '../../modules/eventHub';

import {Delimiters} from '../../scripts/delimiters';

const delimiters = new Delimiters;

export default {
	computed: {
		delimiterList() {
			return this.$store.state.delimiterList;
		},
	},
	data: function () {
		return {
			delimiter: 'auto'
		}
	},
	methods: {
		getDescription: (d: string) => {
			return delimiters.getDescription(d);
		},
		getDisabled: (d: string) => {
			return d === 'auto';
		},
	},
	mounted: function () {
		this.$nextTick(function() {
			$eventHub.$on('changeDelimiter', (data) => { // if some other component requests
				this.delimiter = data;
			});
		});
	},
	name: 'inputControlDelimiter',
	watch: {
		delimiter: function () {
			this.$store.commit('setDelimiter', this.delimiter);
			return this.$store.dispatch('inputChange');
		}
	},
};
