<template>
	<tr>
		<td>{{ candidate.n }}</td>
		<td v-for="(p, i) in positions">{{ candidate.v[i] }}</td>
		<td>{{ candidateTotal }}</td>
		<td>{{ candidatePercent }}</td>
	</tr>
</template>

<script type="ts" src="./candidate-row.ts"></script>
