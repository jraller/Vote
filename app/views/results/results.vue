<template>
    <div class="panel panel-default">
        <div class="panel-heading">
			Results
		</div>
		<div class="panel-body">
	        <round v-for="(round, index) in roundCount" v-bind:key="round" v-bind:round="round" v-bind:index="index"></round>
		</div>
    </div>
</template>

<script lang="ts" src="./results.ts"></script>
