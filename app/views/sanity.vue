<template>
    <div class="sanity">
        <h2>Sanity Checks</h2>
        <p v-show="skippedBallots">The number of ballots and the number of entries are different.</p>
        <p v-show="noCandidatesLeft">There are fewer candidates than positions available.</p>
        <!-- non numeric when vote values selected, prevent count -->
        <!-- duplicate choice on at least one ballot -->
        <!-- stats, or move stats to separate element from sanity checks? -->
    </div>
</template>

<script lang="ts" src="./sanity.ts"></script>
