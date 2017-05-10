<template>
	<div class="panel panel-warning">
		<div class="panel-heading">Sanity Checks</div>
		<div class="panel-body">
			<p v-show="skippedBallots">The number of ballots and the number of entries are different.</p>
			<p v-show="noCandidatesLeft">There are no candidates left.</p>
			<p v-show="notEnoughCandidates">There are fewer candidates than positions available.</p>
			<!-- non numeric when vote values selected, prevent count -->
			<!-- duplicate choice on at least one ballot -->
			<!-- stats, or move stats to separate element from sanity checks? -->
		</div>
	</div>
</template>

<script lang="ts" src="./sanity.ts"></script>
