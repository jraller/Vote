<template>
    <!--<div class="form-group">-->
        <!--<label for="votes">Votes:</label>-->
        <!--<br />-->
        <!--<textarea id="votes" v-model="rawInput" v-on:change="changeVotes" class="form-control" rows="10"></textarea>-->
    <!--</div>-->
    <v-text-field
			id="votes"
			v-model="rawInput"
			v-on:change="changeVotes"
			label="Votes:"
			textarea
	></v-text-field>
</template>

<script lang="ts" src="./ballots.ts"></script>

<style>
    #votes {
        white-space: pre;
        overflow-wrap: normal;
        overflow-y: scroll;
    }
</style>
