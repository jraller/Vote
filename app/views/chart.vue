<template>
    <div>
        <h2>Chart</h2>
        <svg id="chart" class="img-responsive" width="800" height="500"></svg>
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
