<template>
    <div class="form-group">
        <label for="delimiter">Delimiter:</label>
        <select id="delimiter" class="form-control" v-on:change="changeDelimiter" v-model="delimiter" ref="delimiter">
            <option v-for="delim in delimiterList" v-bind:value="delim" :disabled="getDisabled(delim)">{{ getDescription(delim) }}</option>
        </select>
    </div>
</template>

<script lang="ts" src="./delimiter.ts"></script>
