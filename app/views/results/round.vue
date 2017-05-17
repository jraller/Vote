<template>
    <div>
        <h3>Round {{ round }}</h3>
        <table class="table table-bordered table-hover">
            <thead>
                <tr>
                    <th>Candidate</th>
                    <th v-for="i in positions">{{ i }}</th>
                    <th>total <span v-if="voteValues">points</span><span v-else>votes</span></th>
                    <th>%</th>
                </tr>
            </thead>
            <tbody>
				<candidateRow v-for="candidate in candidates" v-bind:key="candidate" v-bind:candidate="candidate" v-bind:round="round" v-bind:total="total"></candidateRow>

                <!--<tr v-for="candidate in candidates">-->
                    <!--<td>{{ candidate.n }}</td>-->
                    <!--<td v-for="(p, i) in positions">{{ candidate.v[i] }}</td>-->
                    <!--<td>{{ candidateTotal() }}</td> &lt;!&ndash; candidate.v.reduce(function(a, b) {return a + b;}) &ndash;&gt;-->
                    <!--<td>{{ candidatePercent() }}</td>-->
                <!--</tr>-->
            </tbody>
            <tfoot>
                <tr>
                    <td :colspan="positions + 1"></td>
                    <td>{{ total }}</td>
                    <td></td>
                </tr>
            </tfoot>
        </table>
        <component :is="roundType" v-bind:key="round" v-bind:round="round"></component>
    </div>
</template>

<script lang="ts" src="./round.ts"></script>

<style>
    td:not(:first-child), th:not(:first-child) {
        text-align: right; }

    tr.lowVotes td {
        font-weight: bold; }
</style>
