<template>
    <div class="well" v-if="!disableButtons">
        <p>Pick one to continue:</p>
        <button v-for="choice in choices"
                class="btn btn-default min200"
				v-on:click="eliminate(choice)"
				:disabled="disableButtons"
				type="button">remove {{ choice }}</button>
    </div>
	<div v-else class="alert alert-warning" role="alert">
		{{ chosen }} was manually selected for removal.
	</div>
</template>

<script lang="ts" src="./round-choice.ts"></script>

<style scoped>
	.min200 {
		margin-right: 5px;
		min-width: 195px;
	}
</style>
