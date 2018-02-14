<template>
	<div class="panel panel-default">
		<div class="panel-heading">
			<a role="button"
			   data-toggle="collapse"
			   data-target="#chartDiv"
			   aria-expanded="true"
			   aria-controls="chartDiv">Chart</a>
		</div>
		<div class="panel-body collapse in" id="chartDiv">
			<svg id="chart"
				 class="img-responsive"
				 :width="size.width"
				 :height="size.height"></svg>
		</div>
	</div>
</template>

<script lang="ts" src="./chart.ts"></script>

<style>
	svg {
		max-width: 100%;
		height: auto;
	}

	.node rect {
		/*cursor: move;*/
		fill-opacity: .9;
		shape-rendering: crispEdges;
	}

	.node text {
		font-size: 2.25em;
		pointer-events: none;
		text-shadow: 0 1px 0 #fff;
	}

	.link {
		fill: none;
		stroke: #000;
		stroke-opacity: .2;
	}

	.link:hover {
		stroke-opacity: .5;
	}
</style>
