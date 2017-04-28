export function nonEmpty(value: string): boolean {
	return value !== '';
}

export function pickDelimiter(input: string): string {
	let delimiter;

	const tabs = (input.match(/\t/g) || []).length;
	const commas = (input.match(/,/g) || []).length;
	const pipes = (input.match(/\|/g) || []).length;

	if (pipes > 0) {
		delimiter = '124';
	} else if (tabs > 0 && commas === 0) {
		delimiter = '9';
	} else if (commas > 0 && tabs === 0) {
		delimiter = '44';
	} else {
		delimiter = '9';
	}
	return delimiter;
}
