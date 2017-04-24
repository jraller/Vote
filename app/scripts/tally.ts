/* jshint esversion:6 */
/* global d3 */



/* Notes

 [x] disqualifier
 [x] make rounds interactive if needed like for handling ties
 [x] add vote value first column checkbox
 [x] autodetect as default option for comma or tab
 [x] refactor eliminate to handle multiple
 [x] refactor needs to keep in mind the number of positions
 [x] add all ballots as source in chart
 [x] add sink for ballots with no remaining choices
 [x] fix tie rendering and logic, perhaps split the run into first and second halves?
 [x] fix transfer of final round when not using vote values - there is an off by one error in elimination
 [ ] allow manual control of vote values checkbox
 [x] fix graph when candidate gets zero votes in a round

 sanity checks
 [x]	do dupe votes
 [x]	warn on skipped vote
 [x]	report number of votes
 [x] report ballot length distribution
 [x]	report number of candidates (as disqualify)
 [x] error if not all numeric in column 1 if vote values checked

 show all paths?

 [x] percentages?

 graph progression? area chart. Do this by storing each round? d3?

 */

import * as d3 from 'd3';
import * as sankey from 'd3-sankey';

let voteField = document.getElementById('votes'), // ui input field for ballot collection
    votes, // raw user input of ballot collection
    sanity = document.getElementById('sanity'), // page region for sanity report
    delimiterDropdown = document.getElementById('delimiter'), // ui element
    delimiter, // ballot choices separator value
    positions, // value for number of candidates to select from field
    voteValues = document.getElementById('voteValue'), // ui checkbox controlling if first column holds vote values
    sortOrder = document.getElementById('sortOrder'),
    disqualifyList = document.getElementById('disqualifyList'), // page region to insert disqualify list
    results = document.getElementById('results'), // the results region
    runButton = document.getElementById('run'), // ui element for initiating calculation
    current = [], // the current state of ballot collection throughout the process
    candidates = [], // current candidates list at any point
    round = 0, // round counter
    eliminations = [], // storage to keep track of eliminated candidates each round
    history = {}, // used to capture information from rounds in order to build chart
    total = []; // per round totals

/**
 * [nonEmpty description]
 * @param  {string} value [description]
 * @return {Boolean}       [description]
 */
function nonEmpty(value) {
    return value !== '';
}

/**
 * [isNot description]
 * @param  {string}  value [description]
 * @return {Boolean}       [description]
 */
function isNot(value) {
    return value !== this.toString();
}

/**
 * [add description]
 * @param {number} a [description]
 * @param {number} b [description]
 */
function add(a, b) {
    return a + b;
}

/**
 * [pickVoteValues description]
 * @return {[type]} [description]
 */
function pickVoteValues() {
    voteValues.checked = !isNaN(Number.parseInt(voteField.value.substring(0, 1), 10));
}

/**
 * [pickDelimiter description]
 * @return {[type]} [description]
 */
function pickDelimiter() {
    votes = voteField.value;
    let tabs = (votes.match(/\t/g) || []).length,
        commas = (votes.match(/,/g) || []).length;

    if (tabs > 0 && commas === 0) {
        delimiterDropdown.value = 't';
        delimiter = 't';
    } else if (commas > 0 && tabs === 0) {
        delimiterDropdown.value = ',';
        delimiter = ',';
    } else {
        delimiter = 't';
    }
}

/**
 * [eliminate description]
 * @param  {string|[string]} candidate [description]
 * @return {object}           [description]
 */
function eliminate(candidate) {
    let index,
        ind,
        i,
        place = [],
        recipient,
        value,
        firstColumn;

    if (voteValues.checked) {
        firstColumn = 1;
    } else {
        firstColumn = 0;
    }

    // normalize candidate to array
    if (typeof candidate === 'string') {
        candidate = [candidate];
    }

    // set up eliminations storage, for each candidate
    for (index = 0; index < candidate.length; index++) {
        eliminations.push({c: candidate[index], transfers: {}});
    }

    // for each ballot to consider
    for (index = 0; index < current.length; index++) {
        place = [];
        for (ind = firstColumn; ind < Math.min(current[index].length, positions) + firstColumn; ind++) {
            for (i = 0; i < candidate.length; i++) {
                if (current[index][ind] === candidate[i]) {
                    place.push({'c': i, 'p': ind});
                }
            }
        }

        // we now know if candidate was scoring

        // remove each eliminated candidate from original
        for (ind = 0; ind < candidate.length; ind++) {
            current[index] = current[index].filter(isNot, candidate[ind]);
        }

        // where the elimination occurred is important
        // this shows up when multiple positions are considered
        // needs refactor

        // removing single A

        // 1 A B C
        // 1 B C

        // 1 B A C
        // 1 B C

        // removing A B

        // 1 A B C D E
        // 1 C D E

        // 1 C A B D E
        // 1 C D E

        // 1 C A D B E
        // 1 C D E

        // use countXPlace() to check if was in positions
        // if elimination was in positions
        // check to see what positions is after elimination


        for (ind = 0; ind < place.length; ind++) {

            if (voteValues.checked) {
                value = parseFloat(current[index][0]);
                if (positions >= current[index].length) {
                    recipient = 'none';
                } else {
                    recipient = current[index][positions];
                }
            } else {
                value = 1;
                if (positions > current[index].length) {
                    recipient = 'none';
                } else {
                    recipient = current[index][positions - 1];
                }
            }

            eliminations[place[ind].c].transfers[recipient] = eliminations[place[ind].c].transfers[recipient] + value || value;
        }

    }

}

/**
 * [listDisqualify description]
 * @return {[type]} [description]
 */
function listDisqualify() {
    let res = [],
        index;

    disqualifyList.innerHTML = '';
    res.push('<p>Disqualify:</p><ul>');

    for (index = 0; index < candidates.length; index++) {
        res.push('<li><label><input type="checkbox" value="' + candidates[index] + '">');
        res.push(candidates[index] + '</label></li>');
    }

    res.push('</ul>');

    disqualifyList.innerHTML = res.join('');
}

/**
 * [removeDisqualified description]
 * @return {[type]} [description]
 */
function removeDisqualified() {
    let list = disqualifyList.getElementsByTagName('input'),
        index;

    for (index = 0; index < list.length; index++) {
        if (list[index].checked) {
            eliminate(list[index].value);
        }
    }
}

/**
 * [fillCurrent description]
 * @return {[type]} [description]
 */
function fillCurrent() {
    let index,
        ind,
        i,
        res = [],
        lines,
        ballots,
        numeric = true,
        hold,
        dupe = false,
        skipped = false,
        ballotLength = {};

    if (delimiter === 't') {
        delimiter = '\t';
    }

    sanity.innerHTML = '';


    res.push('<p>Sanity Check</p>');


    current = votes.split('\n');
    lines = current.length;
    current = current.filter(nonEmpty);
    ballots = current.length;

    if (lines - ballots > 1) {
        res.push('<p><strong>The number of lines and ballots were different: ' + lines + ':' + ballots + '</strong></p>');
    } else {
        res.push('<p>' + ballots + ' ballots</p>');
    }

    for (index = 0; index < current.length; index++) {
        current[index] = current[index].split(delimiter);
        // check here for skipped
        hold = current[index];
        current[index] = current[index].filter(nonEmpty);
        if (hold.slice(0, current[index].length - 1).indexOf('') !== -1) {
            skipped = true;
        }
        for (ind = 0; ind < current[index].length; ind++) {
            current[index][ind] = current[index][ind].trim();
            if (voteValues.checked && ind === 0 && isNaN(Number.parseFloat(current[index][ind]))) {
                numeric = false;
            }
            for (i = 0; i < ind; i++) {
                if (current[index][ind] === current[index][i]) {
                    dupe = true;
                }
            }
        }
        ballotLength[current[index].length] = ballotLength[current[index].length] + 1 || 1;
    }

    if (voteValues.checked && numeric === false) {
        res.push('<p><b>non numeric first field on at least one ballot when vote values checked.</b></p>');
    }

    if (dupe) {
        res.push('<p><b>At least one ballot found with duplicated choice.</b></p>');
    }

    if (skipped) {
        res.push('<p>Some choices skipped in at least one ballot</p>');
    }

    res.push('<table><thead><tr><th>ballot length</th><th>count</th></tr></thead><tbody>');
    Object.keys(ballotLength).forEach(function (item) {
        res.push('<tr><td>' + item + '</td><td>' + ballotLength[item] + '</td></tr>');
    });
    res.push('</tbody></table><hr/>');


    sanity.innerHTML = res.join('');
}

function countCandidates() {
    let index,
        ind,
        firstColumn = 0;

    candidates = [];

    if (voteValues.checked) {
        firstColumn = 1;
    } else {
        firstColumn = 0;
    }

    for (index = 0; index < current.length; index++) {
        for (ind = firstColumn; ind < current[index].length; ind++) {
            if (candidates.indexOf(current[index][ind]) === -1) {
                candidates.push(current[index][ind]);
            }
        }
    }
    if (sortOrder.value === 'f') {
        candidates.sort();
    }
    if (sortOrder.value === 'l') {
        candidates.sort(function (a, b) {
            let lastA = a.toLowerCase().split(' ').reverse(), // John Van Buren becomes Buren Van John
                lastB = b.toLowerCase().split(' ').reverse(),
                result = 0;

            if (lastA < lastB) {
                result = -1;
            }
            if (lastA > lastB) {
                result = 1;
            }

            return result;
        });
    }
}

function countXPlace(candidate, place, firstValue) {
    let value = 0,
        index;

    for (index = 0; index < current.length; index++) {
        if (current[index][place] === candidate) {
            if (firstValue) {
                value = value + parseFloat(current[index][0]);
            } else {
                value++;
            }
        }
    }
    return value;
}

function findNode(candidate, round) {
    let result = -1,
        index;

    for (index = 0; index < history.nodes.length; index++) {
        if (history.nodes[index].candidate === candidate && history.nodes[index].round === round) {
            result = index;
        }
    }

    return result;
}

function chart() {
    let formatNumber = d3.format(',.1f'),
        format = function (d) {
            return formatNumber(d) + ' votes';
        },
        color = d3.scaleOrdinal(d3.schemeCategory20),
        svg = d3.select('svg'),
        margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = svg.attr('width') - margin.left - margin.right,
        height = svg.attr('height') - margin.top - margin.bottom,
        sankey = d3.sankey()
            .nodeWidth(15)
            .nodePadding(10)
            .size([width, height]),
        path = sankey.link(),
        g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    sankey
        .nodes(history.nodes)
        .links(history.links)
        .layout(32);

    let link = g.append('g').selectAll('.link')
        .data(history.links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', path)
        .style('stroke-width', function (d) {
            return Math.max(1, d.dy);
        })
        .sort(function (a, b) {
            return b.dy - a.dy;
        });

    link.append('title')
        .text(function (d) {
            return d.source.name + ' → ' + d.target.name + '\n' + format(d.value);
        });

    let node = g.append('g')
        .selectAll('.node')
        .data(history.nodes)
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', function (d) {
            return 'translate(' + d.x + ',' + d.y + ')';
        });

    node.append('rect')
        .attr('height', function (d) {
            return d.dy;
        })
        .attr('width', sankey.nodeWidth())
        .style('fill', function (d) {
            return d.color = color(d.name.replace(/ .*/, ''));
        })
        .style('stroke', function (d) {
            return d3.rgb(d.color).darker(2);
        })
        .append('title')
        .text(function (d, i) {
            return d.name + '\n' + format(d.value) + '\n' + i;
        });

    //filter these to not show iv value is zero
    node.append('text')
        .attr('x', -6)
        .attr('y', function (d) {
            return d.dy / 2;
        })
        .attr('dy', '.35em')
        .attr('text-anchor', 'end')
        .attr('transform', null)
        .text(function (d) {
            return d.name;
        })
        .filter(function (d, i) { // only for the first entry align text the other way
            return i === 0; //d.x < width / 2;
        })
        .attr('x', 6 + sankey.nodeWidth())
        .attr('text-anchor', 'start');

}

function runRound() {
    let res = [],
        index,
        ind,
        count,
        tally = [],
        grandTotal,
        lowTotal = 'unset',
        lowIndex = [],
        lowCount = 0,
        shift = 0,
        mode = 'auto';

    total = [];


    countCandidates();

    if (voteValues.checked) {
        shift = 1;
    } else {
        shift = 0;
    }

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

    res.push('<table><thead><tr><th>Candidate</th>');
    for (index = 1; index <= positions; index++) {
        res.push('<th>' + index + '</th>');
    }
    res.push('<th>total</th><th>%</th></tr></thead><tbody>');

    // loop through and get values
    for (index = 0; index < candidates.length; index++) {
        tally[index] = [];
        total[index] = 0;
        for (ind = shift; ind < positions + shift; ind++) {
            count = countXPlace(candidates[index], ind, voteValues.checked);
            tally[index].push(count);
            total[index] += count;
        }

        if (lowTotal === 'unset' || total[index] < lowTotal) { // this is poorly written
            lowTotal = total[index];
        }
    }

    grandTotal = total.reduce(add, 0);

    // build the table
    for (index = 0; index < candidates.length; index++) {

        if (total[index] === lowTotal) {
            res.push('<tr class="lowVotes">');
            lowIndex.push(index);
            lowCount++;
        } else {
            res.push('<tr>');
        }

        res.push('<td>' + candidates[index] + '</td>');
        for (ind = shift; ind < positions + shift; ind++) {
            res.push('<td>' + tally[index][ind - shift] + '</td>');
        }

        res.push('<td>' + total[index]);
        res.push('</td><td>' + (total[index] * 100 / grandTotal).toFixed(2) + '</td></tr>');
    }
    res.push('</tbody><tfoot><tr><td colspan="' + (positions + 1) + '">Total</td><td>');
    res.push(total.reduce(add, 0));
    res.push('</td><td></td><tr></tfoot></table>');

    // links from "ballots"
    if (round === 1) {
        history.nodes.push({
            'name': 'Ballots', // display name may be different than candidate name
            'candidate': 'ballots',
            'round': 0
        });
        history.nodes.push({
            'name': 'no remaining choices', // display name may be different than candidate name
            'candidate': 'no remaining choices',
            'round': 0
        });
        for (index = 0; index < candidates.length; index++) {
            if (total[index] > 0) {
                history.links.push({
                    'source': {'c': 'ballots', 'r': 0},
                    'target': {'c': candidates[index], 'r': round},
                    'value': total[index]
                });
            }
        }
    }

    // check what mode we should be in

    if (candidates.length > positions) {
        if (lowCount === 1) {
            res.push('<p>Eliminating ' + candidates[lowIndex[0]]);
            eliminate(candidates[lowIndex[0]]);
        } else {
            res.push('<p>Tie detected, Pick whom to eliminate:</p>');
            res.push('<button onclick="eliminate([\'');
            for (index = 0; index < lowCount; index++) {
                res.push(candidates[lowIndex[index]]);
                if (index !== lowCount - 1) {
                    res.push('\',\'');
                }
            }
            res.push('\']);secondHalf();" type="button">all</button> ');
            for (index = 0; index < lowCount; index++) {
                res.push('<button onclick="eliminate(\'' + candidates[lowIndex[index]] + '\');secondHalf();" type="button">' + candidates[lowIndex[index]] + '</button> ');
            }
            mode = 'manual';
        }
    } else {
        mode = 'done';
    }

    if (round > 15) {
        mode = 'done';
    }

    results.innerHTML += res.join('');

    if (mode !== 'manual') {
        secondHalf(mode);
    }

}


function secondHalf(mode) {
    let index,
        ind,
        notEliminated;

    // add base nodes and self links
    for (index = 0; index < candidates.length; index++) {

        if (total[index] > 0) {
            history.nodes.push({
                'name': candidates[index], // display name may be different than candidate name
                'candidate': candidates[index],
                'round': round
            });
        }

        notEliminated = true;

        for (ind = 0; ind < eliminations.length; ind++) {
            if (candidates[index] === eliminations[ind].c) {
                notEliminated = false;
            }
        }

        if (notEliminated && candidates.length > positions) {
            history.links.push({
                'source': {'c': candidates[index], 'r': round},
                'target': {'c': candidates[index], 'r': round + 1},
                'value': total[index]
            });
        }

    }

    for (index = 0; index < eliminations.length; index++) {

        Object.keys(eliminations[index].transfers).forEach(function (transfer) {

            if (transfer !== 'none') {
                history.links.push({
                    'source': {'c': eliminations[index].c, 'r': round},
                    'target': {'c': transfer, 'r': round + 1},
                    'value': eliminations[index].transfers[transfer]
                });
            } else {
                history.links.push({
                    'source': {'c': eliminations[index].c, 'r': round},
                    'target': {'c': 'no remaining choices', 'r': 0},
                    'value': eliminations[index].transfers[transfer]
                });
            }
        });
    }

    eliminations = [];

    round++;

    countCandidates();

    if (mode === 'done') {

        // resolve links?
        for (index = 0; index < history.links.length; index++) {
            history.links[index].source = findNode(history.links[index].source.c, history.links[index].source.r);
            history.links[index].target = findNode(history.links[index].target.c, history.links[index].target.r);
        }

        console.log('all links:', history.links.length);
        history.links = history.links.filter(function (entry) {
            let check = true;

            check = check && entry.source !== -1;
            check = check && entry.target !== -1;
            check = check && typeof entry.source !== 'undefined';
            check = check && typeof entry.target !== 'undefined';
            return check;
        });
        console.log('good links:', history.links.length);

        console.dir(history);

        chart();
    } else {
        runRound();
    }
} // end second half of runRound

function newVotes() {
    pickDelimiter();
    pickVoteValues();
    fillCurrent();
    countCandidates();
    listDisqualify();
}

function runReport() {
    votes = voteField.value;
    delimiter = delimiterDropdown.value;
    if (delimiter === 'a') {
        delimiter = 't';
    }
    positions = parseInt(document.getElementById('positions').value, 10);
    results.innerHTML = '';
    round = 1;
    fillCurrent();
    removeDisqualified();
    countCandidates();
    history.nodes = [];
    history.links = [];
    eliminations = [];
    d3.select('svg').selectAll('*').remove();
    runRound();
}

// attach events
if (runButton !== null) {
    if (runButton.addEventListener) {
        runButton.addEventListener('click', runReport, false);
    } else if (runButton.attachEvent) {
        runButton.attachEvent('onclick', runReport);
    }
}

if (voteField !== null) {
    if (voteField.addEventListener) {
        voteField.addEventListener('change', newVotes, false);
    } else if (voteField.attachEvent) {
        voteField.attachEvent('onchange', newVotes);
    }
}

if (voteValues !== null) {
    if (voteValues.addEventListener) {
        voteValues.addEventListener('change', newVotes, false);
    } else if (voteValues.attachEvent) {
        voteValues.attachEvent('onchange', newVotes);
    }
}

if (sortOrder !== null) {
    if (sortOrder.addEventListener) {
        sortOrder.addEventListener('change', newVotes, false);
    } else if (voteValues.attachEvent) {
        sortOrder.attachEvent('onchange', newVotes);
    }
}