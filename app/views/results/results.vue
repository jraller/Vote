<template>
    <div>
        <h2>Results</h2>
        <round v-for="(round, index) in roundCount" v-bind:key="round" v-bind:round="round" v-bind:index="index"></round>
    </div>
</template>

<script lang="ts" src="./results.ts"></script>
