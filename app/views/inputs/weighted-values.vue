<template>
    <!--<div class="form-group">-->
        <!--<div class="checkbox">-->
            <!--<label for="voteValue">-->
                <!--<input id="voteValue" type="checkbox" v-model="voteValues" v-on:change="changeVoteValues" ref="voteValues">First column is vote values {{ voteValues }}-->
            <!--</label>-->
        <!--</div>-->
    <!--</div>-->
    <v-checkbox
			id="voteValues"
			v-model="voteValues"
			label="First column is vote values"
    ></v-checkbox>
</template>

<script lang="ts" src="./weighted-values.ts"></script>
