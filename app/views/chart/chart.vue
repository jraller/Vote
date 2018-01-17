<template>
    <div class="panel panel-default">
        <div class="panel-heading">Chart</div>
        <div class="panel-body">
            <svg id="chart"
				 class="img-responsive"
				 width="800" height="500"
				 viewBox="0 0 800 500"
				preserveAspectRatio="xMidYMid meet"></svg>
        </div>
    </div>
</template>

<script lang="ts" src="./chart.ts"></script>

<style>
    .node rect {
        /*cursor: move;*/
        fill-opacity: .9;
        shape-rendering: crispEdges; }

    .node text {
        pointer-events: none;
        text-shadow: 0 1px 0 #fff; }

    .link {
        fill: none;
        stroke: #000;
        stroke-opacity: .2; }

    .link:hover {
        stroke-opacity: .5; }
</style>
