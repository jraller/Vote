export class Delimiters {
	public static pickDelimiter(input: string): string {
		let delimiter;

		const tabs = (input.match(/\t/g) || []).length;
		const commas = (input.match(/,/g) || []).length;
		const pipes = (input.match(/\|/g) || []).length;

		if (pipes > 0 /*ignore coverage*/ ) {
			delimiter = 'pipe';
		} else if (tabs > 0 && commas === 0) {
			delimiter = 'tab';
		} else if (commas > 0 && tabs === 0) {
			delimiter = 'comma';
		} else {
			delimiter = 'tab';
		}
		return delimiter;
	}

	private delims = {};

	public constructor() {
		this.delims = {
			auto: {
				code: 0,
				description: 'Auto Select',
				order: 0,
			},
			comma: {
				code: 44,
				description: 'Comma',
				order: 1,
			},
			pipe: {
				code: 124,
				description: 'Pipe: |',
				order: 3,
			},
			tab: {
				code: 9,
				description: 'Tab',
				order: 2,
			},
		};
	}

	public listDelimiters() {
		return Object.keys(this.delims).sort((a, b) => {
			return this.delims[a].order - this.delims[b].order;
		});
	}

	public getCode(d) {
		return this.delims[d].code;
	}

	public getDescription(d) {
		return this.delims[d].description;
	}
}
