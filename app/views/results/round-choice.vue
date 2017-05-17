<template>
    <div class="well">
        <p>Pick one to continue:</p>
        <button v-for="choice in choices"
                class="btn btn-default min200"
				v-on:click="eliminate(choice)"
				type="button">remove {{ choice }}</button>
    </div>
</template>

<script lang="ts" src="./round-choice.ts"></script>

<style scoped>
	.min200 {
		margin-right: 5px;
		min-width: 195px;
	}
</style>
