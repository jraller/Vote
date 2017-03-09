/* jshint esversion:6 */
/* global d3 */

/* Notes

[x] disqualifier
[x] make rounds interactive if needed like for handling ties
[x] add vote value first column checkbox
[x] autodetect as default option for comma or tab

sanity checks
[]	do dupe votes
[]	warn on skipped vote
[x]	report number of votes
[x]	report number of candidates (as disqualify)

show all paths?

[x] percentages?

graph progression? area chart. Do this by storing each round? d3?

 */

let votes,
	voteField = document.getElementById('votes'),
	sanity = document.getElementById('sanity'),
	delimiterDropdown = document.getElementById('delimiter'),
	delimiter,
	positions,
	voteValues = document.getElementById('voteValue'),
	disqualifyList = document.getElementById('disqualifyList'),
	results = document.getElementById('results'),
	runButton = document.getElementById('run'),
	current = [],
	candidates = [],
	candidatesFull = [],
	round = 0,
	history = [];

function nonEmpty(value) {
	return value !== '';
}

function fillCurrent() {
	var index,
		ind,
		res = [],
		lines,
		ballots;

	if (delimiter === 't') {
		delimiter = '\t';
	}

	sanity.innerHTML = '';


	res.push('<p>Sanity Check</p>');


	current = votes.split('\n');
	lines = current.length;
	current = current.filter(nonEmpty);
	ballots = current.length;

	if (lines - ballots > 1) {
		res.push('<p><strong>The number of lines and ballots were different: ' + lines + ':' + ballots + '</strong></p>');
	} else {
		res.push('<p>' + ballots + ' ballots</p>');
	}

	for (index = 0; index < current.length; index++) {
		current[index] = current[index].split(delimiter).filter(nonEmpty);
		for (ind = 0; ind < current[index].length; ind++) {
			current[index][ind] = current[index][ind].trim();
		}
	}

	sanity.innerHTML = res.join('');
}

function pickDelimiter() {
	var tabs = 0,
		commas = 0;

	votes = voteField.value;
	tabs = (votes.match(/\t/g) || []).length;
	commas = (votes.match(/,/g) || []).length;

	if (tabs > 0 && commas === 0) {
		delimiterDropdown.value = 't';
		delimiter = 't';
	}
	if (commas > 0 && tabs === 0) {
		delimiterDropdown.value = ',';
		delimiter = ',';
	}
}

function pickVoteValues() {
	voteValues.checked = !isNaN(Number.parseInt(voteField.value.substring(0, 1), 10));
}

function listDisqualify() {
	var res = [],
		index;

	disqualifyList.innerHTML = '';
	res.push('<p>Disqualify:</p><ul>');

	for (index = 0; index < candidates.length; index++) {
		res.push('<li><label><input type="checkbox" value="' + candidates[index] + '">');
		res.push(candidates[index] + '</label></li>');
	}

	res.push('</ul>');

	disqualifyList.innerHTML = res.join('');
}

function removeDisqualified() {
	var list = disqualifyList.getElementsByTagName('input'),
		index;

	for (index = 0; index < list.length; index++) {
		if (list[index].checked) {
			eliminate(list[index].value);
		}
	}
}

function newVotes() {
	pickDelimiter();
	pickVoteValues();
	fillCurrent();
	countCandidates();
	listDisqualify();
}

function countCandidates() {
	var index,
		ind,
		firstColumn = 0;

	candidates = [];

	if (voteValues.checked) {
		firstColumn = 1;
	} else {
		firstColumn = 0;
	}

	for (index = 0; index < current.length; index++) {
		for (ind = firstColumn; ind < current[index].length; ind++) {
			if (candidates.indexOf(current[index][ind]) === -1) {
				candidates.push(current[index][ind]);
			}
		}
	}
}

function isNot(value) {
	return value !== this.toString();
}


function countXPlace(candidate, place, firstValue) {
	var value = 0,
		index;

	for (index = 0; index < current.length; index++) {
		if (current[index][place] === candidate) {
			if (firstValue) {
				value = value + parseFloat(current[index][0], 10);
			} else {
				value++;
			}
		}
	}

	return value;
}


function eliminate(candidate) {
	var index;

	for (index = 0; index < current.length; index++) {
		current[index] = current[index].filter(isNot, candidate);
	}
}

function add(a, b) {
	return a + b;
}

function chart() {
	var svg = d3.select('svg'),
		margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = svg.attr('width') - margin.left - margin.right,
		height = svg.attr('height') - margin.top - margin.bottom,
		x = d3.scaleLinear().range([0, width]),
		y = d3.scaleLinear().range([height, 0]),
		z = d3.scaleOrdinal(d3.schemeCategory10),
		stack = d3.stack(),
		area = d3.area()
			.x(function(d) { return x(d.data.round); })
			.y0(function(d) { return y(d[0]); })
			.y1(function(d) { return y(d[1]); }),
		g = svg.append('g'),
		layer,
		keys = candidatesFull;

	x.domain(d3.extent(history, function(d) { return d.round; }));
	z.domain(keys);
	stack.keys(keys);

	y.domain(d3.extent([d3.max(d3.values(history[history.length - 1])) , 0]));

	layer = g.selectAll('.layer')
		.data(stack(history))
		.enter().append('g')
			.attr('class', 'layer');

	layer.append('path')
		.attr('class', 'area')
		.style('fill', function(d) { return z(d.key); })
		.attr('d', area);

	layer
	// .filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
		.append('text')
			.attr('x', 6)
			.attr('y', function(d) { return y((d[0][0] + d[0][1]) / 2); })
			.attr('dy', '.35em')
			.style('font', '10px sans-serif')
			.style('text-anchor', 'start')
			.text(function(d) { return d.key; });

	g.append('g')
		.attr('class', 'axis axis--x')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.axisBottom(x).ticks(history.length));

	g.append('g')
		.attr('class', 'axis axis--y')
		.call(d3.axisLeft(y).ticks(10, ''));

}

function runRound() {
	var res = [],
		index,
		ind,
		count,
		tally = [],
		total = [],
		grandTotal,
		lowtotal = 'unset',
		lowindex = [],
		lowcount = 0,
		shift = 0,
		mode = 'auto',
		entry = {};

	removeDisqualified();

	countCandidates();

	if (voteValues.checked) {
		shift = 1;
	} else {
		shift = 0;
	}

	// tally votes

	res.push('<h2>Round ' + round + '</h2>');

	res.push('<p>Candidates in this round are: ');
	for (index = 0; index < candidates.length; index++) {
		res.push(candidates[index]);
		if (index !== candidates.length - 1) {
			res.push(', ');
		}
	}
	res.push('</p>');

	res.push('<table><thead><th>Candidate</th>');
	for (index = 1; index <= positions; index++) {
		res.push('<th>' + index + '</th>');
	}
	res.push('<th>total</th><th>%</th></thead><tbody>');

	// loop through and get values
	for (index = 0; index < candidates.length; index++) {
		tally[index] = [];
		total[index] = 0;
		for (ind = 0 + shift; ind < positions + shift; ind++) {
			count = countXPlace(candidates[index], ind, voteValues.checked);
			tally[index].push(count);
			total[index] += count;
		}

		if (lowtotal === 'unset' || total[index] < lowtotal) { // this is poorly written
			lowtotal = total[index];
		}
	}

	grandTotal = total.reduce(add, 0);

	// build the table
	for (index = 0; index < candidates.length; index++) {
		res.push('<tr><td>' + candidates[index] + '</td>');
		for (ind = 0 + shift; ind < positions + shift; ind++) {
			res.push('<td>' + tally[index][ind - shift] + '</td>');
		}

		res.push('<td>');

		if (total[index] === lowtotal) {
			lowindex.push(index);
			lowcount++;
			res.push('<b>');
		}
		res.push(total[index]);
		if (total[index] === lowtotal) {
			res.push('</b>');
		}
		res.push('</td><td>' + (total[index] * 100 / grandTotal).toFixed(2) + '</td></tr>');
	}
	res.push('</tbody></table>');

	// check what mode we should be in

	if (candidates.length > positions) {
		if (lowcount === 1) {
			res.push('<p>Eliminating ' + candidates[lowindex[0]]);
			eliminate(candidates[lowindex[0]]);
		} else {
			res.push('<p>Tie detected, Pick whom to eliminate:</p>');
			res.push('<button onclick="');
			for (index = 0; index < lowcount; index++) {
				res.push('eliminate(\'' + candidates[lowindex[index]] + '\');');
			}
			res.push('runRound();" type="button">all</button> ');
			for (index = 0; index < lowcount; index++) {
				res.push('<button onclick="eliminate(\'' + candidates[lowindex[index]] + '\');runRound();" type="button">' + candidates[lowindex[index]] + '</button> ');
			}
			mode = 'manual';
		}
	} else {
		mode = 'done';
	}

	if (round > 15) {
		mode = 'done';
	}

	entry.round = round;

	for (index = 0; index < candidatesFull.length; index++) {
		entry[candidatesFull[index]] = 0;
	}

	for (index = 0; index < candidates.length; index++) {
		entry[candidates[index]] = total[index];
	}

	// capture history
	history.push(entry);

	results.innerHTML += res.join('');
	round++;
	countCandidates();

	if (mode === 'auto') {
		runRound();
	}

	if (mode === 'done') {
		chart();
	}

} // end runRound

function runReport() {
	votes = voteField.value;
	delimiter = delimiterDropdown.value;
	positions = parseInt(document.getElementById('positions').value, 10);
	results.innerHTML='';
	round = 1;
	fillCurrent();
	candidatesFull = candidates;
	countCandidates();
	history = [];
	runRound();
}

// attach events
if (runButton.addEventListener) {
	runButton.addEventListener('click', runReport, false);
} else if (runButton.attachEvent) {
	runButton.attachEvent('onclick', runReport);
}

if (voteField.addEventListener) {
	voteField.addEventListener('change', newVotes, false);
} else if (voteField.attachEvent) {
	voteField.attachEvent('onchange', newVotes);
}

if (voteValues.addEventListener) {
	voteValues.addEventListener('change', newVotes, false);
} else if (voteValues.attachEvent) {
	voteValues.attachEvent('onchange', newVotes);
}
