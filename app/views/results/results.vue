<template>
    <div class="panel panel-default">
        <div class="panel-heading">
			<a role="button"
			   data-toggle="collapse"
			   data-target="#resultsDiv"
			   aria-expanded="true"
			   aria-controls="resultsDiv">Results</a>
		</div>
		<div class="panel-body collapse in" id="resultsDiv">
	        <round v-for="(round, index) in roundCount" v-bind:key="round" v-bind:round="round" v-bind:index="index"></round>
		</div>
    </div>
</template>

<script lang="ts" src="./results.ts"></script>
