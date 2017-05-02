<template>
    <div class="form-group">
        <label for="votes">Votes:</label>
        <br />
        <textarea id="votes" v-on:change="changeVotes" v-model="rawInput" class="form-control" rows="10"></textarea>
    </div>
</template>

<script lang="ts" src="./input-control-votes.ts"></script>

<style>
    #votes {
        white-space: pre;
        overflow-wrap: normal;
        overflow-y: scroll;
    }
</style>
