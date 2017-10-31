import $eventHub from '../modules/eventHub';

const {sankey, sankeyLinkHorizontal} = require('d3-sankey');
const {rgb} = require('d3-color');
const {format} = require('d3-format');
const {scaleOrdinal, schemeCategory20} = require('d3-scale');
const {select, selectAll} = require('d3-selection');

let update;

function findNode(history, candidate, round) {
	let result = -1,
		index;

	for (index = 0; index < history.nodes.length; index++) {
		if (history.nodes[index].name === candidate && history.nodes[index].round === round) {
			result = index;
		}
	}
	return result;
}

export default {
	// TODO interface with $eventHub to receive data and clear signal
	beforeDestroy: function () {
		$eventHub.$off('clearChart');
		$eventHub.$off('addNode');
		$eventHub.$off('addLink');
		$eventHub.$off('redraw');
	},
	created: function () {
		$eventHub.$on('clearChart', () => { // if some other component requests
			this.history.links = [];
			this.history.nodes = [
				{
					'name': 'all cast',
					'round': 0
				}
			];
			// all cast -- first always -- initial round are children of this node
		});
		$eventHub.$on('addNode', data => { // this function could detect nodes that need to be queued
			this.history.nodes.push(data);
		});
		$eventHub.$on('addLink', data => { // this function could detect links that need to be queued
			data.source = null;
			data.target = null;
			this.history.links.push(data);
		});
		$eventHub.$on('redraw', () => { // this needs a dequeue functionality before the redraw

			this.history.nodes.push({
				'name': 'choices eliminated',
				'round': 0
			});

			// add the eliminated node
			// resolve links

			for (let index = 0; index < this.history.links.length; index++) {

				this.history.links[index].source = findNode(
					this.history,
					this.history.links[index].from.name,
					this.history.links[index].from.round
				);
				this.history.links[index].target = findNode(
					this.history,
					this.history.links[index].to.name,
					this.history.links[index].to.round
				);
			}

			update();
		});
	},
	// TODO data
	data: function () {
		return {
			history: {
				links: [
				],
				nodes: [
				]
			}
		}
	},
	mounted: function () {

		const formatNumber = format(',.1f');
		const formatVote = function (d) {
			return formatNumber(d) + ' votes';
		};
		const color = scaleOrdinal(schemeCategory20);
		const svg = select('#chart');
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

		const sk = sankey()
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
				.attr('transform', function (d: any) {
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
