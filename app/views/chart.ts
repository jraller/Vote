import * as sankey from 'd3-sankey';

import * as color from 'd3-color';
import * as format from 'd3-format';
import * as scale from 'd3-scale';
import * as select from 'd3-selection';

const sankeyLinkHorizontal = sankey.sankeyLinkHorizontal;
const scaleOrdinal = scale.scaleOrdinal;
const schemeCategory20 = scale.schemeCategory20;
const rgb = color.rgb;

let update;

export default {
	// TODO interface with eventHub to receive data and clear signal
	created: function() {
		this.eventHub.$on('clearChart', () => { // if some other component requests
			this.history.links = [];
			this.history.nodes = [];
		});
		this.eventHub.$on('addLink', data => { // this function could detect links that need to be queued
			this.history.links.push(data);
		});
		this.eventHub.$on('addNode', data => { // this function could detect nodes that need to be queued
			this.history.nodes.push(data);
		});
		this.eventHub.$on('redraw', () => { // this needs a dequeue functionality before the redraw
			update();
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


		update = () => {

			sk(this.history);

			const link = linkGroup.selectAll('.link')
				.data(this.history.links);

			link.exit().remove();

			const linkEnter = link.enter()
				.append('path')
				.attr('class', 'link');

			linkEnter.append('title');

			link.merge(linkEnter)
				.attr('d', path)
				.style('stroke-width', function (d: any) {
					return Math.max(1, d.width);
				})
				.select('title')
				.text((d: any) => `${d.source['name']} → ${d.target['name']}`);

			// nodes

			const node = nodeGroup.selectAll('.node')
				.data(this.history.nodes);

			node.exit().remove();

			const nodeEnter = node.enter()
				.append('g')
				.attr('class', 'node');

			nodeEnter.append('rect')
				.append('title');
			nodeEnter.append('text');

			node.merge(nodeEnter)
				.attr('transform', function(d: any) {
					return 'translate(' + d.x0 + ',' + d.y0 + ')';
				});

			node.merge(nodeEnter)
				.select('rect')
				.attr('height', function (d: any) {
					return d.y1 - d.y0;
				})
				.attr('width', sk.nodeWidth())
				.style('fill', function (d: any) {
					return d.color = color(d.name.replace(/ .*/, ''));
				})
				.style('stroke', function (d: any): any {
					return rgb(d.color).darker(2);
				})
				.select('title')
				.text(function (d: any, i) {
					return d.name + '\n' + formatVote(d.value) + '\n' + i;
				});

			node.merge(nodeEnter)
				.select('text')
				.attr('x', -6)
				.attr('y', function (d: any) {
					return (d.y1 - d.y0) / 2;
				})
				.attr('dy', '.35em')
				.attr('text-anchor', 'end')
				.attr('transform', null)
				.text(function (d: any) {
					return d.name;
				})
				.filter(function (d, i) { // only for the first entry align text the other way
					return i === 0; //d.x < width / 2;
				})
				.attr('x', 6 + sk.nodeWidth())
				.attr('text-anchor', 'start');

		};

		update();

	},
	updated: function () {
		// console.log('data update?');
	},
	name: 'TallyChart',
};
