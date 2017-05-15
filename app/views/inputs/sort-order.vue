<template>
    <div class="form-group">
        <label for="sortOrder">Sort order:</label>
        <select id="sortOrder" class="form-control" v-model="sortOrder" v-on:change="changeSortOrder">
            <option value="u">unsorted</option>
            <option value="f">first name</option>
            <option value="l">last name</option>
        </select>
    </div>
</template>

<script lang="ts" src="./sort-order.ts"></script>
