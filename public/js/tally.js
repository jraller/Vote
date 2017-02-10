/*

disqualifier
make rounds interactive if needed like for handling ties
add vote value first column checkbox
autodetect as default option for comma or tab

sanity checks
	do dupe votes
	warn on skipped vote
	report number of votes
	report number of candidates (as disqualify)

show all paths?

percentages?

graph progression? area chart

 */



let votes,
	delimiter,
	positions,
	results = document.getElementById('results'),
	runButton = document.getElementById('run'),
	current = [],
	candidates = [],
	round = 0;

function nonEmpty(value) {
	return value !== '';
}

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

function countCandidates() {
	var index,
		ind;

	candidates = [];

	for (index = 0; index < current.length; index++) {
		for (ind = 0; ind < current[index].length; ind++) {
			if (candidates.indexOf(current[index][ind]) === -1) {
				candidates.push(current[index][ind]);
			}
		}
	}
}

function isNot(value) {
	return value !== this.toString();
}


function countXPlace(candidate, place) {
	var value = 0,
		index;

	for (index = 0; index < current.length; index++) {
			if (current[index][place] === candidate) {
				value++;
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

function runRound() {
	var res = [],
		index,
		ind,
		tally,
		total,
		lowtotal = 'unset',
		lowindex;

	countCandidates();

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
	res.push('<th>total</th></thead><tbody>');
	for (index = 0; index < candidates.length; index++) {
		tally = 0;
		total = 0;
		res.push('<tr><td>' + candidates[index] + '</td>');
		for (ind = 0; ind < positions; ind++) {
			tally = countXPlace(candidates[index], ind);
			res.push('<td>' + tally + '</td>');
			total += tally;
		}
		res.push('<td>' + total + '</td></tr>');
		if (lowtotal === 'unset' || total < lowtotal) { // this is poorly written
			lowindex = index;
			lowtotal = total;
		}
	}
	res.push('</tbody></table>');


	if (candidates.length > positions) {
		res.push('<p>Elimniating ' + candidates[lowindex]);
		eliminate(candidates[lowindex]);
	}


	results.innerHTML += res.join('');
	round++;
	countCandidates();

}

function runReport() {
	votes = document.getElementById('votes').value;
	delimiter = document.getElementById('delimiter').value;
	positions = parseInt(document.getElementById('positions').value, 10);
	results.innerHTML='';
	round = 1;
	fillCurrent();
	countCandidates();
	while (candidates.length >= positions && round < 10) {
		runRound();
	}
}

// attach events
if (runButton.addEventListener) {
	runButton.addEventListener('click', runReport, false);
} else if (runButton.attachEvent) {
	runButton.attachEvent('onclick', runReport);
}
