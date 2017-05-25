import { Delimiters } from '../scripts/delimiters';
import Visible from './visible';

interface ICandidateType {
	n: string; // name of candidate
	v: number[]; // array of counted votes or vote values
	l: boolean; // flag for low vote count or value in round, may be tie
}

interface IRoundType {
	candidates: ICandidateType[];
	roundType: string;
}

export default class State {
	public ballotCount: number = 0;
	public candidateList: string[] = [];
	public candidateListFull: string[] = [];
	public current: string[][]|string[] = [];
	public delimiter: string = 'auto';
	public delimiterList = new Delimiters().listDelimiters();
	public disableRun: boolean = true;
	public disqualifiedCandidates: string[] = [];
	public positions: number = 1;
	public rawLength: number = 0;
	public round: IRoundType[] = [];
	public sortOrder: string = 'u';
	public visible = new Visible();
	public voteValues: boolean = false;
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
