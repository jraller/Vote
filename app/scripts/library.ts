import State from '../modules/state';

export function nonEmpty(value: string): boolean {
	return value !== '';
}

function isNot(value: string): boolean {
	return value !== this.toString();
}

export function sortCandidateList(candidates: string[], order: string): string[] {
	let result = [];

	if (order === 'u') {
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

export function eliminate(state: State, candidate: string|string[]): void {
	const eliminations = [];

	// normalize to candidate allowing function to handle
	// a single elimination via string
	// or multiple eliminations via array
	if (typeof candidate === 'string') {
		candidate = [candidate];
	}

	for (const can of candidate) {
		eliminations.push({c: can, transfers: {}});
	}

	for (let index = 0; index < state.current.length; index++) {
		for (const can of candidate) {
			state.current[index] = state.current[index].filter(isNot, can);
		}
	}

	// state.eventHub.$emit('eliminated', eliminations);
}

export function disqualify(state: State, candidate) {
	console.log('disqualify', candidate);
	eliminate(state, candidate);
}

export function updateCandidateList(state: State) {
	state.candidateList = [];
	for (const row of state.current) {
		for (let index = (state.voteValues) ? 1 : 0; index < row.length; index++) {
			if (state.candidateList.indexOf(row[index]) === -1) {
				state.candidateList.push(row[index]);
			}
		}
	}
	sortCandidateList(state.candidateList, state.sortOrder);
}

function countXPlace(state: State, candidate: string, place: number): number {

	function countFactory(voteValues) {
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

export function runRound(state, callNext = finishRound) {
	updateCandidateList(state);

	let proceed = false;
	let lowCount = 0;
	let lowValue = Number.POSITIVE_INFINITY;
	const round = {
		candidates: [],
		roundType: '',
	};

	for (const candidate of state.candidateList) {
		const tally = [];
		for (let index = 0; index < state.positions; index++) {
			tally.push(countXPlace(state, candidate, index + ((state.voteValues) ? 1 : 0)));
		}
		round.candidates.push({n: candidate, v: tally, l: false});
		const total = tally.reduce((a, b) => a + b);
		if (total < lowValue) {
			lowValue = total;
		}
	}
	if (state.candidateList.length > state.positions) {
		for (const candidate of round.candidates) {
			if (candidate.v.reduce((a, b) => a + b) === lowValue) {
				candidate.l = true;
				lowCount++;
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
	}
	state.round.push(round);
	if (proceed) {
		callNext(state);
	}
}

export function finishRound(state) {
	// TODO build out the rest
	runRound(state);
}

// have a single one of these at the end of the library
// to enable testing of non-exported functions
if (process.env.NODE_ENV !== 'production') {
	exports.isNot = isNot;
	exports.countXPlace = countXPlace;
}
