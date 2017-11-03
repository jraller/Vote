import { Delimiters } from '../scripts/delimiters';
import Visible from './visible';

// TODO change some strings to enums?

export interface ICandidateType {
	n: string; // name of candidate
	v: number[]; // array of counted votes or vote values per position
	l: boolean; // flag for low vote count or value in round, may be tie
}

export interface IRoundType {
	candidates: ICandidateType[];
	roundType: string; // this might be enum?
}

export default class State {
	public ballot: string[] = []; // holds all of the votes
	public ballotCount: number = 0; // counts how many entries there are in ballot
	public candidateList: string[] = []; // extracted list of candidates from ballot
	public candidateListFull: string[] = []; // version of list without disqualified candidates
	public chartLabelPool: string = 'All Cast'; // TODO advanced setting, expose later?
	public chartLabelNoCount: string = 'Choices Eliminated'; // TODO advanced setting, expose later?
	public current: string[][] = []; // the parsed current state of ballots at any point
	public delimiter: string = 'auto'; // delimiter setting, initally auto to improve UI
	public delimiterList = new Delimiters().listDelimiters();
	public disableReset: boolean = true; // UI control for button
	public disableRun: boolean = true; // UI control for button
	public disqualifiedCandidates: string[] = []; // see candidateList and candidateListFull
	public positions: number = 1; // number of winners to select
	public rawLength: number = 0; // length of text in ballot
	public round: IRoundType[] = []; // the collected round history
	public sortOrder: string = 'u'; // sort candidates by. Initial value of unsorted
	public visible = new Visible(); // the set of visibility flags
	public voteValues: boolean = false; // is the first entry in each row in ballot a weighting value
}

// {candidates: [
// 	{n: 'fred', v: [3, 2]},
// 	{n: 'sally', v: [2, 2]},
// 	{n: 'john', v: [1, 1]},
// ], IRoundType: 'roundSummary'},
// {candidates: [
// 	{n: 'fred', v: [4, 2]},
// 	{n: 'sally', v: [3, 2]},
// ], IRoundType: 'roundChoice'},
