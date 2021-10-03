<script>
	import * as integration from './Integration.js';
	import * as utils from './utils.js';
	import Icon from 'svelte-fa';
  import { faPlay, faPause, faCircle } from '@fortawesome/free-solid-svg-icons';
	export let integrator = integration.explicit_euler, dt=.1;
	export let Vx = '0', Vy = '0', Vmax=10;
	export let paused = true;

	function togglePaused() {
		paused = !paused;
	}

	const options = [
		{
			label: "Explicit Euler",
			integrator: integration.explicit_euler,
		},
		{
			label: "Midpoint",
			integrator: integration.midpoint,
		},
		{
			label: "RK-4",
			integrator: integration.rk4,
		},
		{
			label: "Implicit Euler",
			integrator: integration.implicit_euler,
		},
	]
</script>

<h2>Vector Field</h2>
<label for="Vx">X Velocity:</label>
<input type="text" id="Vx" name="Vx" bind:value={Vx}>
<label for="Vy">Y Velocity:</label>
<input type="text" id="Vy" name="Vy" bind:value={Vy}>
<label for="Vmax">Max Velocity:</label>
<input type="number" id="Vmax" name="Vmax" bind:value={Vmax}>
<label for="dt">Timestep:</label>
<input type="number" id="dt" name="dt" bind:value={dt}>
<div on:click={togglePaused}>{paused? 'Play' : 'Pause'} <Icon icon={paused? faPlay : faPause}/></div>


<h2>New Ball Integrator</h2>
{#each options as option}
	<label>
		<input type=radio bind:group={integrator} name="integrator" value={option.integrator}>
		{option.label} <Icon icon={faCircle} style="color:{utils.getColourForIntegrator(option.integrator)};"/>
	</label>
{/each}

<p>Click anywhere to add a ball that uses the selected integrator.</p>
<p>Hover over a ball to see its coordinates, and double click to delete.</p>

<style>
	div {
		cursor:pointer;
	}
</style>
