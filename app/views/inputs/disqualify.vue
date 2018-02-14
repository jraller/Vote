<template>
	<v-card color="grey lighten-4">
		<v-card-title>Disqualify List</v-card-title>
		<v-list dense subheader>
			<template v-for="candidate in candidates">
				<v-list-tile>
					<v-list-tile-content>
						<v-checkbox :label="candidate"
									:value="candidate"
									v-model="disqualifyCandidates"
									v-on:change="changeDisqualified"
						></v-checkbox>
					</v-list-tile-content>
				</v-list-tile>
			</template>
		</v-list>
	</v-card>
</template>

<script lang="ts" src="./disqualify.ts"></script>
