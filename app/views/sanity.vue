<template>
    <div class="sanity">
        <h2>Sanity Checks</h2>
        <p v-show="skippedBallots">The number of ballots and the number of entries are different.</p>
    </div>
</template>

<script lang="ts" src="./sanity.ts"></script>
