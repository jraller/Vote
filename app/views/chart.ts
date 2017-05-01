import * as d3 from 'd3';
import {sankey} from 'd3-sankey';

export default {
    mounted: function() {

        const history = {
            links: [
                {
                    'source': 0,
                    'target': 2,
                    'value': 10
                },
                {
                    'source': 1,
                    'target': 2,
                    'value': 5
                }
            ],
            nodes: [
                {
                    'name': 'a'
                },
                {
                    'name': 'b'
                },
                {
                    'name': 'c'
                }
            ]
        };

        const formatNumber = d3.format(',.1f');
        const color = d3.scaleOrdinal(d3.schemeCategory20);
        const svg = d3.select('#chart');
        const margin = {top: 20, right: 20, bottom: 20, left: 20};
        const width = parseInt(svg.attr('width'), 10) - margin.left - margin.right;
        const height = parseInt(svg.attr('height'), 10) - margin.top - margin.bottom;
        const sk = sankey()
            .nodeWidth(15)
            .nodePadding(10)
            .size([width, height]);
        const path = sk.link();
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.right})`);
        sk.nodes(history.nodes)
            .links(history.links)
            .layout(32);

        const link = g.append('g')
            .selectAll('.link')
            .data(history.links)
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', path)
            .style('stroke-width', function(d){
                return Math.max(1, d['dy']);
            })
            .sort(function (a, b) {
                return a['dy'] - b['dy'];
            });

        link.append('title')
            .text(function(d) {
                return `${d.source['name']} → ${d.target['name']}`;
            });
    },
    name: 'TallyChart',
};
