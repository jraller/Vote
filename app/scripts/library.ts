import State, {ICandidateType, IRoundType} from '../modules/state';

import $eventHub from '../modules/eventHub';

export function nonEmpty(value: string): boolean {
	return value !== '';
}

function isNot(value: string): boolean {
	return value !== this.toString();
}

export function sortCandidateList(candidates: string[], order: string): string[] {
	let result: string[] = [];

	if (order === 'u' || order === 'b') {
		result = candidates;
	} else if (order === 'f') {
		result = candidates.sort();
	} else if (order === 'l') {
		result = candidates.sort((a, b) => {
			const lastA = a.toLowerCase().split(' ').reverse();
			const lastB = b.toLowerCase().split(' ').reverse();
			let	flag = 0;

			if (lastA < lastB) {
				flag = -1;
			} else if (lastA > lastB) {
				flag = 1;
			}

			return flag;
		});
	}
	return result;
}

export function updateCandidateList(state: State) {
	state.candidateList = [];
	// if sort order is ballot set that to start
	if (state.sortOrder === 'b' && state.round.length === 1) {
		state.candidateList = state.ballot.filter(nonEmpty);
	}

	// in subsequent rounds start with ballot, remove eliminated candidates and add unlisted?

	for (const row of state.current) {
		for (let index = (state.voteValues) ? 1 : 0; index < row.length; index++) {
			if (state.candidateList.indexOf(row[index]) === -1 && row[index].trim() !== '') {
				state.candidateList.push(row[index]);
			}
		}
	}

	sortCandidateList(state.candidateList, state.sortOrder);
}

export function eliminate(state: State, candidate: string|string[]): void {
	const eliminations = {};

	// normalize to candidate allowing function to handle
	// a single elimination via string
	// or multiple eliminations via array
	if (typeof candidate === 'string') {
		candidate = [candidate];
	}

	// set up eliminations storage for each candidate being eliminated
	for (const can of candidate) {
		console.log('eliminating', can);
		eliminations[can] = {};
	}

	// handle each ballot
	for (let index = 0; index < state.current.length; index++) {
		const offset = (state.voteValues) ? 1 : 0;
		const consideration: string[] = state.current[index].slice(offset, state.positions);
		// contains the portion of the ballot under consideration
		const replacePosition: number[] = [];
		// contains the positions in the ballot that were under consideration and removed
		for (const can of candidate) {
			if (consideration.indexOf(can) !== -1) {
				// if the candidate was in consideration record where they were
				replacePosition.push(consideration.indexOf(can));
			}
		}
		// remove the eliminated candidates
		for (const can of candidate) {
			state.current[index] = state.current[index].filter(isNot, can);
		}
		// for each replacement -- so only ballots that were changed
		for (const position of replacePosition) {
			// identify when there is not anything at state.current[index][position] and
			// send those votes to state.chartLabelNoCount
			let replacement = state.current[index][position];
			if (typeof replacement === 'undefined' || replacement === '') {
				replacement = state.chartLabelNoCount;
			}
			// increment the number of times we've see x replaced by y
			const value = (state.voteValues) ? parseFloat(state.current[index][0]) : 1;
			if (eliminations[consideration[position]].hasOwnProperty(replacement)) {
				eliminations[consideration[position]][replacement] += value;
			} else {
				eliminations[consideration[position]][replacement] = value;
			}
		}
	}
	// turn eliminations into links in the chart
	for (const from in eliminations) {
		if (eliminations.hasOwnProperty(from)) {

			console.log(from, eliminations[from]);

			for (const goesto in eliminations[from]) {
				if (eliminations[from].hasOwnProperty(goesto)) {
					$eventHub.$emit('addLink', {
						from: {
							name: from,
							round: state.round.length + 1,
						},
						to: {
							name: goesto,
							round: (goesto === state.chartLabelNoCount) ? 0 : state.round.length + 2,
						},
						value: eliminations[from][goesto],
					});

				}
			}
		}
	}
}

export function disqualify(state: State, candidate: string) {
	eliminate(state, candidate);
}

function countXPlace(state: State, candidate: string, place: number): number {

	function countFactory(voteValues: boolean) {
		switch (voteValues) {
			case false:
				return (ballot) => 1;
			case true:
				return (ballot) => parseFloat(ballot[0]);
		}
	}

	let value = 0;
	const count = countFactory(state.voteValues);

	// define the return function to return first column or 1
	// and then use that function?

	for (const ballot of state.current) {
		if (ballot[place] === candidate) {
			value = (value + count(ballot));
		}
	}

	return value;
}

export function runRound(state: State, callNext = finishRound) {
	updateCandidateList(state);

	let proceed = false;
	let lowCount = 0;
	let lowValue = Number.POSITIVE_INFINITY;
	const round: IRoundType = {
		candidates: [],
		roundType: '',
	};

	for (const candidate of state.candidateList) {
		const tally: number[] = [];
		for (let index = 0; index < state.positions; index++) {
			tally.push(countXPlace(state, candidate, index + ((state.voteValues) ? 1 : 0)));
		}
		round.candidates.push({n: candidate, v: tally, l: false});
		const total: number = tally.reduce((a: number, b: number) => a + b);
		if (total < lowValue) {
			lowValue = total;
		}
		if (total > 0 || state.round.length > 0) {
			$eventHub.$emit('addNode', {name: candidate, round: state.round.length + 1});
		}
	}
	if (state.candidateList.length > state.positions) {
		for (const candidate of round.candidates) {
			const total = candidate.v.reduce((a: number, b: number) => a + b);
			if (total === lowValue) {
				candidate.l = true;
				lowCount++;
			}
			if (total > 0) {
				let linkTotal = total;
				if (state.round.length > 0) {
					for (const lastRoundCandidate of state.round[state.round.length - 1].candidates) {
						if (lastRoundCandidate.n === candidate.n) {
							linkTotal = lastRoundCandidate.v.reduce((a: number, b: number) => a + b);
						}
					}
				}
				$eventHub.$emit('addLink', {
					from: {
						name: ((state.round.length > 0) ? candidate.n : state.chartLabelPool),
						round: state.round.length,
					},
					to: {name: candidate.n, round: state.round.length + 1},
					value: linkTotal,
				});
			}
		}
		if (lowCount === 1 || lowValue === 0) {
			for (const candidate of round.candidates) {
				if (candidate.l === true) {
					eliminate(state, candidate.n);
				}
			}
			round.roundType = 'roundSummary';
			proceed = true;
		} else {
			// get user input to handle tie
			round.roundType = 'roundChoice';
		}
	} else {
		// Add final round links for chart as nodes are already there, added above
		for (const candidate of state.round[state.round.length - 1].candidates) {
			// this is duplicating the prior round, but should only include active candidates?
			let current = false;
			for (const active of round.candidates) {
				if (active.n === candidate.n) {
					current = true;
				}
			}
			if (current) {
				const total = candidate.v.reduce((a: number, b: number) => a + b);
				$eventHub.$emit('addLink', {
					from: {
						name: candidate.n,
						round: state.round.length,
					},
					to: {name: candidate.n, round: state.round.length + 1},
					value: total,
				});
			}
		}
		$eventHub.$emit('redraw');
		state.visible.chart = true;
	}
	state.round.push(round);
	if (proceed) {
		callNext(state);
	}
}

export function finishRound(state: State) {
	// TODO build out the rest
	runRound(state);
}

// have a single one of these at the end of the library
// to enable testing of non-exported functions
if (process.env.NODE_ENV !== 'production') {
	exports.isNot = isNot;
	exports.countXPlace = countXPlace;
}
