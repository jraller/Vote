<template>
    <!--<div class="form-group">-->
        <!--<label for="positions">Number of Positions:</label>-->
        <!--<input id="positions" class="form-control" type="number" inputmode="numeric" min="1" value="1" v-model.number="positions">-->
    <!--</div>-->
    <v-text-field
			id="positions"
			type="number"
			inputmode="numeric"
			min="1"
			value="1"
			v-model.numeric="positions"
			label="Number of Positions"
	></v-text-field>
</template>

<script lang="ts" src="./positions.ts"></script>
