import {ICandidateType} from '../../modules/state';

export default {
	components: {
		// candidateRow: require('./candidate-row.vue').default,
		roundSummary: require('./round-summary.vue').default,
		roundChoice: require('./round-choice.vue').default,
	},
	computed: {
		positions() {
			return this.$store.state.positions;
		},
		candidates() {
			return this.$store.state.round[this.index].candidates;
		},
		roundType() {
			return this.$store.state.round[this.index].roundType;
		},
		total() {
			const votes = this.$store.state.round[this.index].candidates
				.reduce((a: ICandidateType[], b: ICandidateType) => [...a, ...b.v], []);
			return votes.reduce((a: number, b: number) => a + b);
		},
		voteValues() {
			return this.$store.state.voteValues;
		},
		headers() {
			const headers:any = [];

			headers.push({
				text: 'Candidate',
				sortable: true,
				value: 'name',
				align: 'left',
				tooltip: 'Candidate Name'
			});

			for (let i = 0; i < this.$store.state.positions; i++) {
				headers.push({
					text: (i + 1),
					sortable: false,
					value: ('p' + i),
					tooltip: ('Choice ' + (i + 1))
				});
			}

			headers.push({
				text: ('Total ' + ((this.$store.state.voteValues) ? 'Points' : 'Votes')),
				sortable: true,
				value: 'total',
				tooltip: 'Total'
			});
			headers.push({
				text: '%',
				sortable: true,
				value: 'percent',
				tooltip: 'Percent Chosen'
			});
			return headers;
		},
		items() {
			const items:any = [];

			for (let can of this.$store.state.round[this.index].candidates) {
				const candidateTotal = can.v.reduce(function (a, b) {
					return a + b;
				});
				const row = {
					name: can.n,
					total: candidateTotal,
					percent: ((candidateTotal / this.total * 100).toFixed(2) + '%'),
					lowVotes: can.l
				};
				for (let i = 0; i < this.$store.state.positions; i++) {
					row[('p' + i)] = can.v[i];
				}
				items.push(row);
			}
			return items;
		}
	},
	props: ['round', 'index'],
};
