<script>
import { round } from 'mathjs';

	export let x, y, xScale, yScale;
	export let removeFn;
	export let colour;
</script>

<circle cx='{xScale(x)}' cy='{yScale(y)}' r='5'
	on:dblclick={removeFn} style="fill:{colour};"
>
	<title>({round(x, 2)}, {round(y, 2)})</title>
</circle>

<style>
	circle {
		stroke: rgba(0,0,0,0.5);
	}
</style>
