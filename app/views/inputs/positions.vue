<template>
    <div class="form-group">
        <label for="positions">Number of Positions:</label>
        <input id="positions" class="form-control" type="number" inputmode="numeric" min="1" value="1" v-model.number="positions" v-on:change="changePositions">
    </div>
</template>

<script lang="ts" src="./positions.ts"></script>
