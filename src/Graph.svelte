<script>
	import { onMount } from 'svelte';
	import { scaleLinear } from 'd3-scale';
	import { range, floor, concat } from 'lodash-es';
	import VectorField from './VectorField.svelte';
	import Controls from './Controls.svelte';
	import * as integration from './Integration.js';

	let svg;
	let width = 500;
	let height = 500;
	let xTicks = [];
	let yTicks = [];
	let integrator = integration.explicit_euler;
	let dt = .1, paused=true;
	let Vx = '0', Vy = '0', Vmax=10;

	const padding = { top: 50, right: 50, bottom: 50, left: 50 };
	$: graphWidth = width - (padding.left + padding.right);
	$: graphHeight = height - (padding.top + padding.bottom);

	$: xLsY = width < height;
	$: yLsX = height < width;

	// If y>x then the width is a percentage.
	// If x>y then the height is a percentage.
  // If x==y then they are both 100% of the whole.
	$: xRatio = xLsY? width/height : 1;
	$: yRatio = yLsX? height/width : 1;

	$: xMax = floor(10*xRatio);
	$: yMax = floor(10*yRatio);
	$: xTicks = concat(range(-xMax, xMax+.25, .25), xMax)
	$: yTicks = concat(range(-yMax, yMax+.25, .25), yMax)

	$: tickXScale = scaleLinear()
		.domain([-xMax, xMax])
		.range([padding.left, width - padding.right]);

	$: tickYScale = scaleLinear()
		.domain([-yMax, yMax])
		.range([height - padding.bottom, padding.top]);

	$: xScale = scaleLinear()
		.domain([-xMax, xMax])
		.range([0, graphWidth]);

	$: yScale = scaleLinear()
		.domain([-yMax, yMax])
		.range([graphHeight, 0]);

	onMount(resize);

	function resize() {
		({ width, height } = svg.getBoundingClientRect());
	}
</script>

<svelte:window on:resize='{resize}'/>

<div><Controls
	bind:integrator={integrator}
	bind:Vx={Vx} bind:Vy={Vy} bind:Vmax={Vmax} bind:dt={dt}
	bind:paused={paused}
/></div>

<svg bind:this={svg}>
	<!-- y axis -->
	<g class='axis y-axis'>
		{#each yTicks as tick}
			<g class='tick tick-{tick}' transform='translate(0, {tickYScale(tick)})'>
				{#if tick == 0}
					<line x1='{padding.left}' x2='{tickXScale(xMax)}'
					style='stroke-dasharray: none; stroke: black;'/>
				{:else}
					<line x1='{padding.left}' x2='{tickXScale(xMax)}'/>
				{/if}
				{#if tick%1==0}
					<text x='{padding.left - 8}' y='+4'>{tick}</text>
				{/if}
			</g>
		{/each}
	</g>

	<!-- x axis -->
	<g class='axis x-axis'>
		{#each xTicks as tick}
			<g class='tick' transform='translate({tickXScale(tick)},0)'>
				{#if tick == 0}
					<line y1='{tickYScale(-yMax)}' y2='{tickYScale(yMax)}'
					style='stroke-dasharray: none; stroke: black;'/>
				{:else}
					<line y1='{tickYScale(-yMax)}' y2='{tickYScale(yMax)}' />
				{/if}
				{#if tick%1==0}
					<text y='{height - padding.bottom + 16}'>{tick}</text>
				{/if}
			</g>
		{/each}
	</g>

	<VectorField
		x={padding.left} y={padding.bottom} width={graphWidth} height={graphHeight}
		xScale={xScale} yScale={yScale} xMax={xMax} yMax={yMax}
		integrator={integrator}
		dt={dt} paused={paused}
		Vx={Vx} Vy={Vy} Vmax={Vmax}
	/>
</svg>

<style>
	svg {
		width: 75%;
		height: 100%;
		float: right;
	}

	.tick line {
		stroke: #ddd;
		stroke-dasharray: 2;
	}

	text {
		font-size: 12px;
		fill: #999;
	}

	.x-axis text {
		text-anchor: middle;
	}

	.y-axis text {
		text-anchor: end;
	}

	div {
		width: 23%;
		padding-top: 2%;
		padding-left: 2%;
		float: left;
	}

</style>
