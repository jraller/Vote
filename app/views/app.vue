<template>
    <div class="container">
        <h1>Vote Processor</h1>
        <div class="panel panel-default">
            <div class="panel-heading">
                Input Controls
            </div>
            <div class="panel-body">
                <form action="" v-on:submit.prevent>
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
                            <resetButton></resetButton>
                        </div>
                    </div>
                </form>
            </div>
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
