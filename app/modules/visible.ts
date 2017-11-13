// initial visibility state of various elements
// used to control visibility throughout process

export interface IVisible {
	chart?: boolean;
	disqualifyList?: boolean;
	results?: boolean;
	sanity?: boolean;
}

export default class Visible {
	// chart should only be shown when results are final
	public chart: boolean = false;
	// disqualify list shown when there are candidates identified in the votes input
	public disqualifyList: boolean = false;
	// results shown after run button clicked
	// results may not be complete as
	// user input may be required to break a tie
	public results: boolean = false;
	// sanity shown when votes are input
	// and any of the sanity checks is triggered
	// comparing the votes input against
	// all of the other settings
	public sanity: boolean = false;
}
