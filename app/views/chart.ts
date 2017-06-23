// import {sankey, sankeyLinkHorizontal} from 'd3-sankey';
// import {format} from 'd3-format';
// import {scaleOrdinal, schemeCategory20} from 'd3-scale';
// import {select} from 'd3-selection';

import {interval} from "d3-timer";
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
			console.log('clearChart');
			this.history.links = [];
			this.history.nodes = [];
		});
		this.eventHub.$on('addLink', data => {
			console.log('addLink', data);
			this.history.links.push(data);
		});
		this.eventHub.$on('addNode', data => {
			console.log('addNode', data);
			this.history.nodes.push(data);
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
						'value': 3
					},
					{
						'source': 2,
						'target': 4,
						'value': 2
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
					},
					{
						'name': 'choices eliminated'
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
		const linkGroup = g.append('g')
			.attr('id', 'linkGroup');
		const nodeGroup = g.append('g')
			.attr('id', 'nodeGroup');

		const sk = sankey.sankey()
			.nodeWidth(15)
			.nodePadding(10)
			.extent([[1, 1], [width, height]])
			.iterations(32);

		function update(data) {
			sk.nodes(data.nodes)
				.links(data.links);
			sk();

			const link = linkGroup.selectAll('.link')
				.data(data.links);

			link.enter()
				.append('path')
				.attr('class', 'link')
				.attr('d', path)
				.style('stroke-width', function (d) {
					return Math.max(1, d.width);
				})
				.sort(function (a, b) {
					return a.y0 - b.y0;
				})
				.append('title')
				.text(function (d) {
					return `${d.source['name']} → ${d.target['name']}`;
				});

			link.exit().remove();

			const node = nodeGroup.selectAll('.node')
				.data(data.nodes);

			const cnode = node.enter()
				.append('g')
				.attr('class', 'node')
				.attr('transform', function(d) {
					return 'translate(' + d.x0 + ',' + d.y0 + ')';
				});

			cnode.append('rect')
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

			cnode.append('text')
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

			node.exit().remove();
		}

		update(this.history);

		interval(() => {
			update(this.history)
		}, 5000);

	},
	updated: function () {
		// console.log('data update?');
	},
	name: 'TallyChart',
};
