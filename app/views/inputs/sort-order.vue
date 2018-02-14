<template>
    <!--<div class="form-group">-->
        <!--<label for="sortOrder">Sort order:</label>-->
        <!--<select id="sortOrder" class="form-control" v-model="sortOrder" v-on:change="changeSortOrder">-->
            <!--<option value="u">unsorted</option>-->
			<!--<option value="b">ballot</option>-->
            <!--<option value="f">first name</option>-->
            <!--<option value="l">last name</option>-->
        <!--</select>-->
		<!--<div v-show="sortOrder==='b'">-->
			<!--<label for="sortBallot">Ballot:</label>-->
			<!--<br/>-->
			<!--<textarea id="sortBallot" class="form-control" v-model="ballotOrder"  v-on:change="changeSortOrder"></textarea>-->
		<!--</div>-->
    <!--</div>-->
	<div>
		<v-select
				id="sortOrder"
				v-bind:items="orders"
				v-model="sortOrder"
				v-on:change="changeSortOrder"
				item-text="text"
				item-value="order"
				label="Sort order"
				single-line
		></v-select>
		<div v-show="sortOrder==='b'">
			<label for="sortBallot">Ballot:</label>
			<br/>
			<textarea id="sortBallot" class="form-control" v-model="ballotOrder"  v-on:change="changeSortOrder"></textarea>
		</div>
	</div>
</template>

<script lang="ts" src="./sort-order.ts"></script>
