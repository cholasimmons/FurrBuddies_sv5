<script context="module">
	import '../global.postcss';

	import { goto } from '$app/navigation'; // Redirect to the landing page when the app loads

	console.log('Redirect to landing page...');
	
	export const load = ({ }) => { // You can also check the session if needed
		goto('/(plain)/splash', {replaceState: true});
	}; 
</script>

<slot/>