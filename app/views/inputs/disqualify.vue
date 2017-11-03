<template>
	<div class="panel panel-default">
		<div class="panel-heading">Disqualify List</div>
		<div class="panel-body">
			<ul>
				<li v-for="candidate in candidates">
					<div class="checkbox">
						<label>
							<input type="checkbox" :value="candidate" v-model="disqualifyCandidates"
								   v-on:change="changeDisqualified">{{ candidate }}
						</label>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts" src="./disqualify.ts"></script>
