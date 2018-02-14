<template>
    <v-layout>
        <v-flex xs12>
			<v-toolbar color="cyan" dark dense>
				<v-toolbar-title>Round {{ round }}</v-toolbar-title>
			</v-toolbar>
			<v-card>
				<v-container fluid grid-list-md>
					<v-layout row wrap>
						<v-data-table
								:headers="headers"
								:items="items"
								hide-actions
								class="elevation-1"
						>
							<template slot="items" slot-scope="props">
								<tr :class="{ 'red lighten-4': props.item.lowVotes }">
									<td>{{ props.item.name }}</td>

									<td v-for="pos in parseInt(positions, 10)" class="text-xs-right">{{ props.item['p' + (pos - 1)] }}</td>

									<td class="text-xs-right">{{ props.item.total }}</td>
									<td class="text-xs-right">{{ props.item.percent }}</td>
								</tr>
							</template>
							<template slot="footer">
								<td :colspan="positions + 1"></td>
								<td>{{ total }}</td>
								<td></td>
							</template>
							<template slot="headerCell" slot-scope="props">
								<v-tooltip bottom>
									<span slot="activator">
									  {{ props.header.text }}
									</span>
									<span>
									  {{ props.header.tooltip }}
									</span>
								</v-tooltip>
							</template>
						</v-data-table>
						<component :is="roundType" v-bind:key="round" v-bind:round="round"></component>
					</v-layout>
				</v-container>
			</v-card>
		</v-flex>
    </v-layout>
</template>

<script lang="ts" src="./round.ts"></script>

<style>
    td:not(:first-child), th:not(:first-child) {
        text-align: right; }

    tr.lowVotes td {
        font-weight: bold; }
</style>
