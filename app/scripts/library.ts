export function nonEmpty(value: string): boolean {
	return value !== '';
}

export function pickDelimiter(input: string): string {
	let delimiter;

	const tabs = (input.match(/\t/g) || []).length;
	const commas = (input.match(/,/g) || []).length;

	if (tabs > 0 && commas === 0) {
		delimiter = 't';
	} else if (commas > 0 && tabs === 0) {
		delimiter = ',';
	} else {
		delimiter = 't';
	}
	return delimiter;
}
