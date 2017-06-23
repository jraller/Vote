// import {sankey, sankeyLinkHorizontal} from 'd3-sankey';
// import {format} from 'd3-format';
// import {scaleOrdinal, schemeCategory20} from 'd3-scale';
// import {select} from 'd3-selection';

const sankey = require('d3-sankey');
const sankeyLinkHorizontal = sankey.sankeyLinkHorizontal;
const format = require('d3-format');
const scale = require('d3-scale');
const scaleOrdinal = scale.scaleOrdinal;
const schemeCategory20 = scale.schemeCategory20;
const select = require('d3-selection');
const color = require('d3-color');
const rgb = color.rgb;

export default {
	// TODO interface with eventHub to receive data and clear signal
	created: function() {
		this.eventHub.$on('clearChart', data => { // if some other component requests
			// this.$store.commit('newBallots', this.rawInput); // trigger ballot parsing
			// this.$store.commit('newCandidates');
		});
		this.eventHub.$on('addLink', data => {
			// this.$store.commit('newBallots', this.rawInput); // trigger ballot parsing
			// this.$store.commit('newCandidates');
		});
		this.eventHub.$on('addNode', data => {
			// this.$store.commit('newBallots', this.rawInput); // trigger ballot parsing
			// this.$store.commit('newCandidates');
		});
	},
	// TODO data
	data: function () {
		return {
			history: {
				links: [
					{
						'source': 0,
						'target': 1,
						'value': 10
					},
					{
						'source': 0,
						'target': 2,
						'value': 5
					},
					{
						'source': 1,
						'target': 3,
						'value': 10
					},
					{
						'source': 2,
						'target': 3,
						'value': 5
					}
				],
				nodes: [
					{
						'name': 'all cast'
					},
					{
						'name': 'a'
					},
					{
						'name': 'b'
					},
					{
						'name': 'a - winner'
					}
				]
			}
		}
	},
	mounted: function () {

		const formatNumber = format.format(',.1f');
		const formatVote = function(d) {
			return formatNumber(d) + ' votes';
		};
		const color = scaleOrdinal(schemeCategory20);
		const svg = select.select('#chart');
		const margin = {top: 20, right: 20, bottom: 20, left: 20};
		const width = parseInt(svg.attr('width'), 10) - margin.left - margin.right;
		const height = parseInt(svg.attr('height'), 10) - margin.top - margin.bottom;
		const path = sankeyLinkHorizontal();
		const g = svg.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.right})`);
		const sk = sankey.sankey()
			.nodeWidth(15)
			.nodePadding(10)
			.extent([[1, 1], [width, height]])
			.nodes(this.history.nodes)
			.links(this.history.links)
			.iterations(32);

		sk();

		const link = g.append('g')
			.selectAll('.link')
			.data(this.history.links)
			.enter()
			.append('path')
			.attr('class', 'link')
			.attr('d', path)
			.style('stroke-width', function (d) {
				return Math.max(1, d.width);
			})
			.sort(function (a, b) {
				return a.y0 - b.y0;
			});

		link.append('title')
			.text(function (d) {
				return `${d.source['name']} → ${d.target['name']}`;
			});

		const node = g.append('g')
			.selectAll('.node')
			.data(this.history.nodes)
			.enter()
			.append('g')
			.attr('class', 'node')
			.attr('transform', function(d) {
				return 'translate(' + d.x0 + ',' + d.y0 + ')';
			});

		node.append('rect')
			.attr('height', function (d) {
				return d.y1 - d.y0;
			})
			.attr('width', sk.nodeWidth())
			.style('fill', function (d) {
				return d.color = color(d.name.replace(/ .*/, ''));
			})
			.style('stroke', function (d) {
				return rgb(d.color).darker(2);
			})
			.append('title')
			.text(function (d, i) {
				return d.name + '\n' + formatVote(d.value) + '\n' + i;
			});

		node.append('text')
			.attr('x', -6)
			.attr('y', function (d) {
				return (d.y1 - d.y0) / 2;
			})
			.attr('dy', '.35em')
			.attr('text-anchor', 'end')
			.attr('transform', null)
			.text(function (d) {
				return d.name;
			})
			.filter(function (d, i) { // only for the first entry align text the other way
				return i === 0; //d.x < width / 2;
			})
			.attr('x', 6 + sk.nodeWidth())
			.attr('text-anchor', 'start');

	},
	name: 'TallyChart',
};
