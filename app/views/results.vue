<template>
    <div>
        <h2>Results</h2>
        <round v-for="round in rounds" :key="round.name" :name="round.name"></round>
    </div>
</template>

<script lang="ts" src="./results.ts"></script>
