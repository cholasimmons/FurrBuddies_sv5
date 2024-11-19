<script context="module">
	import { modeCurrent } from '@skeletonlabs/skeleton';
	
	modeCurrent.set(false);
</script>

<script lang="ts">
	import '../global.postcss';
	import { goto } from '$app/navigation'; // Redirect to the landing page when the app loads
	import { onMount } from 'svelte';
	
	onMount(() => {
		goto('/splash', {replaceState: true});
		
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