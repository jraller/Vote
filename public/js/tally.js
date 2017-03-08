/*

[x] disqualifier
[x] make rounds interactive if needed like for handling ties
[x] add vote value first column checkbox
[x] autodetect as default option for comma or tab

sanity checks
	do dupe votes
	warn on skipped vote
	report number of votes
	report number of candidates (as disqualify)

show all paths?

[x] percentages?

graph progression? area chart. Do this by storing each round? d3?

 */



let votes,
	voteField = document.getElementById('votes'),
	delimiter, // document.getElementById('delimiter')
	positions,
	voteValues = document.getElementById('voteValue'),
	disqualifyList = document.getElementById('disqualifyList'),
	results = document.getElementById('results'),
	runButton = document.getElementById('run'),
	current = [],
	candidates = [],
	round = 0;

function fillCurrent() {
	var index,
		ind;

	if (delimiter === 't') {
		delimiter = '\t';
	}

	current = votes.split('\n').filter(nonEmpty);

	for (index = 0; index < current.length; index++) {
		current[index] = current[index].split(delimiter).filter(nonEmpty);
		for (ind = 0; ind < current[index].length; ind++) {
			current[index][ind] = current[index][ind].trim();
		}
	}
}

function pickDelimiter() {
	var tabs = 0,
		commas = 0;

	votes = voteField.value;
	tabs = (votes.match(/\t/g) || []).length;
	commas = (votes.match(/,/g) || []).length;

	if (tabs > 0 && commas === 0) {
		document.getElementById('delimiter').value = 't';
		delimiter = 't';
	}
	if (commas > 0 && tabs === 0) {
		document.getElementById('delimiter').value = ',';
		delimiter = ',';
	}
}

function listDisqualify() {
	var res = [],
		index;

	disqualifyList.innerHTML = '';
	fillCurrent();
	countCandidates();
	res.push('<p>Disqualify:</p><ul>');

	for (index = 0; index < candidates.length; index++) {
		res.push('<li><label><input type="checkbox" value="' + candidates[index] + '">' + candidates[index] + '</label></li>');
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
	listDisqualify();
}

function nonEmpty(value) {
	return value !== '';
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
		mode = 'auto';

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


	results.innerHTML += res.join('');
	round++;
	countCandidates();

	if (mode === 'auto') {
		runRound();
	}

} // end runRound

function runReport() {
	votes = voteField.value;
	delimiter = document.getElementById('delimiter').value;
	positions = parseInt(document.getElementById('positions').value, 10);
	results.innerHTML='';
	round = 1;
	fillCurrent();
	countCandidates();
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
