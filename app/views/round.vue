<template>
    <div>
        <h3>Round {{ round }}</h3>
        <table class="table table-bordered table-hover">
            <thead>
                <tr>
                    <th>Candidate</th>
                    <th v-for="i in positions">{{ i }}</th>
                    <th>total</th>
                    <th>%</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="candidate in candidates">
                    <td>{{ candidate }}</td>
                    <td v-for="i in positions">{{ i }}</td>
                    <td>t</td>
                    <td>p</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td :colspan="positions + 1"></td>
                    <td>T</td>
                    <td></td>
                </tr>
            </tfoot>
        </table>
        <component :is="roundType"></component>
    </div>
</template>

<script lang="ts" src="./round.ts"></script>

<style>
    td:not(:first-child), th:not(:first-child) {
        text-align: right; }

    tr.lowVotes td {
        font-weight: bold; }
</style>
