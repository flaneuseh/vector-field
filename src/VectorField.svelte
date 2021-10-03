<script>
  import Ball from './Ball.svelte';
	import * as integration from './Integration.js';
	import * as utils from './utils.js'
	import { range } from 'lodash-es';
	import { multiply } from 'mathjs';

  export let balls = []; // []integration.Ball
  export let x, y, width, height, xScale, yScale, xMax, yMax;
	export let Vx, Vy, Vmax;
	export let dt, integrator, paused;

  let graph, clickArea;
	let vector_field = new integration.VectorField([Vx, Vy], Vmax);
	$: {
		vector_field.set_f([Vx, Vy]);
		vector_field.Vmax = Vmax;
		vector_field = vector_field;
	}

	$: xTicks = range(-xMax, xMax+1);
	$: yTicks = range(-yMax, yMax+1);
	let arrows = [];
	$: {
		arrows = [];
		xTicks.forEach(x => {
			yTicks.forEach(y => {
				try {
					let [vx, vy] = multiply(.1*.5, vector_field.f([x, y]));
					let x1 = x - vx;
					let y1 = y - vy;
					let x2 = x + vx;
					let y2 = y + vy;
					arrows.push([x1, y1, x2, y2]);
				} catch(err){
					console.log(err);
				}
			});
		});
		arrows = arrows;
		console.log(arrows);
	}

  function handleClick(e) {
		let pt = graph.createSVGPoint();

		// pass event coordinates
		pt.x = e.x;
		pt.y = e.y;

		// transform to SVG coordinates
		let graphP = pt.matrixTransform( clickArea.getScreenCTM().inverse() );

		// add new control point.
		addBall(xScale.invert(graphP.x), yScale.invert(graphP.y));
	}
	function addBall(x, y) {
		let ball = new integration.Ball([x, y], integrator, vector_field);
		balls = [...balls, ball];
	}

	let ball_cmps = [];
	$: ball_cmps = ball_cmps.filter(ball => ball);
	const removePoint = (i) => {
		balls = [
			...balls.slice(0, i),
			...balls.slice(i + 1, balls.length),
		];
	}

	function step(dt) {
		try {
			balls.forEach(ball => ball.step(dt));
			balls = balls;
		} catch(err){
			console.log(err);
		}
	}

	let interval;
	$: paused? clearInterval(interval): interval = setInterval(()=>step(dt), 100);
</script>

<svg bind:this={graph} x={x} y={y} width={width} height={height}>
	<defs>
		<marker id="arrow" markerWidth="5" markerHeight="5"
			refX="5" refY="2.5" orient="auto"
		>
      <polyline points="0 0, 5 2.5, 0 5" />
    </marker>
	</defs>
  <rect bind:this={clickArea} x=0 y=0 width={width} height={height} on:click={handleClick}/>
  {#each balls as ball, i}
    <Ball bind:this={ball_cmps[i]}
			x={ball.state[0]} y={ball.state[1]}
			xScale={xScale} yScale={yScale}
			removeFn={()=>removePoint(i)}
			colour={utils.getColourForIntegrator(ball.integrator)}
		/>
  {/each}
	{#each arrows as [x1, y1, x2, y2]}
		<line x1={xScale(x1)} y1={yScale(y1)} x2={xScale(x2)} y2={yScale(y2)}
			marker-end="url(#arrow)"
		/>
	{/each}
</svg>

<style>
  rect {
		opacity: .1;
	}
	line, polyline {
		stroke: lightpink;
		fill: none;
	}
</style>
