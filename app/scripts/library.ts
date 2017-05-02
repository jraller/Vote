export function nonEmpty(value: string): boolean {
	return value !== '';
}

export function sortCandidateList(candidates, order) {
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
