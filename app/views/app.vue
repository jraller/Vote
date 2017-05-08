<template>
    <div class="container">
        <div class="well">
            <div class="row">
                <h2>Input Controls</h2>
            </div>
            <form action="">
                <div class="row">
                    <div class="col-sm-6">
                        <inputControlVotes></inputControlVotes>
                    </div>
                    <div class="col-sm-6">
                        <inputControlDelimiter></inputControlDelimiter>
                        <inputControlPositions></inputControlPositions>
                        <inputControlSortOrder></inputControlSortOrder>
                        <inputControlWeightedValues></inputControlWeightedValues>
                    </div>
                </div>
                <div v-show="showDisqualify" class="row">
                    <div class="col-xs-12">
                        <disqualify></disqualify>
                    </div>
                </div>
                <div v-show="showSanity" class="row">
                    <div class="col-xs-12">
                        <sanity></sanity>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <runButton></runButton>
                    </div>
                </div>
            </form>
        </div>
        <div v-show="showResults" class="row">
            <div class="col-xs-12">
                <results></results>
            </div>
        </div>
        <div v-show="showChart" class="row">
            <div class="col-xs-12">
                <chart></chart>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./app.ts"></script>

<style>
    [v-cloak] {
        display: none;
    }
</style>
