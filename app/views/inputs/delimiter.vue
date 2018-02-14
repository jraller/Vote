<template>
    <!--<div class="form-group">-->
        <!--<label for="delimiter">Delimiter:</label>-->
        <!--<select id="delimiter" class="form-control" v-model="delimiter" ref="delimiter">-->
            <!--<option v-for="delim in delimiterList" v-bind:value="delim" :disabled="getDisabled(delim)">{{ getDescription(delim) }}</option>-->
        <!--</select>-->
    <!--</div>-->
	<v-select
			id="delimiter"
			v-model="delimiter"
			v-bind:items="delimiterList"
			label="Delimiter"
	></v-select>
</template>

<script lang="ts" src="./delimiter.ts"></script>
