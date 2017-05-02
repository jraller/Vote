<template>
    <div class="form-group">
        <div class="checkbox">
            <label for="voteValue">
                <input id="voteValue" type="checkbox" v-model="voteValues">First column is vote values {{ voteValues }}
            </label>
        </div>
    </div>
</template>

<script lang="ts" src="./input-control-weighted-values.ts"></script>
