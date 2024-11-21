<script context="module">
	import '../global.postcss';
	import { modeCurrent, setModeCurrent, setModeUserPrefers } from '@skeletonlabs/skeleton';
	
	// Set initial dark mode
	modeCurrent.set(false);
	setModeUserPrefers(false);
    setModeCurrent(false);
</script>

<script lang="ts">
	import "iconify-icon";
	import { goto } from '$app/navigation'; // Redirect to the landing page when the app loads
	import { onMount } from 'svelte';
	
	onMount(() => {
		goto('/', {replaceState: true});
		
		// Check session storage to see if splash page has been visited
        // if (!sessionStorage.getItem('visitedSplash')) {
        //     sessionStorage.setItem('visitedSplash', 'true'); // Mark splash as visited
        //     goto('/', {replaceState: true}); // Redirect to splash page
        // } else {
		// 	goto('/splash', {replaceState: true});
		// }
	});
</script>

<slot/>
