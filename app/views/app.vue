<template>
    <v-container fluid grid-list-md wrap>
        <v-layout row wrap>
            <v-flex xs12>
				<v-subheader>Input Controls</v-subheader>
            </v-flex>
            <v-flex xs12>
				<v-card color="grey lighten-4">
					<v-form action="" v-on:submit.prevent>
						<v-layout>
							<v-flex sm8 class="ma-3">
								<inputControlVotes></inputControlVotes>
							</v-flex>
							<v-flex sm4 class="ma-3">
								<inputControlDelimiter></inputControlDelimiter>
								<inputControlPositions></inputControlPositions>
								<inputControlSortOrder></inputControlSortOrder>
								<inputControlWeightedValues></inputControlWeightedValues>
							</v-flex>
						</v-layout>
						<v-layout v-show="showDisqualify">
							<v-flex xs12>
								<disqualify></disqualify>
							</v-flex>
						</v-layout>
						<v-layout v-show="showSanity">
							<v-flex xs12>
								<sanity></sanity>
							</v-flex>
						</v-layout>
						<v-layout class="row">
							<v-flex>
								<runButton></runButton>
								<resetButton></resetButton>
							</v-flex>
						</v-layout>
					</v-form>
				</v-card>
			</v-flex>
        </v-layout>
        <v-layout v-show="showResults">
            <v-flex xs12>
                <results></results>
            </v-flex>
        </v-layout>
        <v-layout v-show="showChart">
            <v-flex xs12>
                <chart></chart>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts" src="./app.ts"></script>

<style>
    [v-cloak] {
        display: none;
    }
</style>
