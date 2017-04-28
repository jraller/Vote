<template>
    <form action="">
        <div class="col-sm-6">
            <div class="form-group">
                <label for="votes">Votes:</label>
                <br />
                <textarea id="votes" v-on:change="changeVotes" v-model="rawInput" class="form-control" rows="10"></textarea>
            </div>
        </div>
        <div class="col-sm-6">
            <div class="form-group">
                <label for="delimiter">Delimiter:</label>
                <select id="delimiter" class="form-control" v-on:change="changeDelimiter" v-model="delimiter" ref="delimiter">
                    <option value="-1" selected disabled>Auto</option>
                    <option value="9">tab</option>
                    <option value="44">comma</option>
                    <option value="124">pipe</option>
                </select>
            </div>
            <div class="form-group">
                <label for="positions">Number of Positions:</label>
                <input id="positions" class="form-control" type="number" inputmode="numeric" min="1" value="1">
            </div>
            <div class="form-group">
                <label for="sortOrder">Sort order:</label>
                <select id="sortOrder" class="form-control">
                    <option value="u" selected>unsorted</option>
                    <option value="f">first name</option>
                    <option value="l">last name</option>
                </select>
            </div>
            <div class="checkbox">
                <label for="voteValue">
                    <input id="voteValue" type="checkbox" v-model="voteValues" v-on:change="changeVoteValues">First column is vote values {{ voteValues }}
                </label>
            </div>
        </div>
    </form>
</template>

<script lang="ts" src="./inputs.ts"></script>

<style>
    #votes {
        white-space: pre;
        overflow-wrap: normal;
        overflow-y: scroll;
    }
</style>
