<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { ads, clinicstate, petstate, appstate } from '$lib/_stores/auth_store';
	import { Type } from '$lib/_models/pet-model';
	import { appSettings } from '$lib/_stores/settings_store';
	import { user } from '$lib/server/db/schema';
	import { setModeUserPrefers, setModeCurrent } from '@skeletonlabs/skeleton';

    // $: app = $appstate;

    // Loaders
	let _loadingVets = $state(false);
	let _loadingPets = $state(false);

	let dashboardItems: any = $state([]);

	let dogCount = $derived(() => $petstate.pets.reduce((count, pet) => (pet.type === Type.DOG ? count + 1 : count), 0));
	// Using the "@" symbol to activate runes mode for reactivity on object properties
	let catCount = $derived(() => $petstate.pets.reduce(
		(count, cat) => (cat.type === Type.CAT ? count + 1 : count), 0
	));
	let birdCount = $derived(() => $petstate.pets.reduce((count, bird) => (bird.type === Type.BIRD ? count + 1 : count), 0));
	let rabbitCount = $derived(() => $petstate.pets.reduce((count, rabbit) => (rabbit.type === Type.RABBIT ? count + 1 : count), 0));
	let rodentCount = $derived(() => $petstate.pets.reduce((count, rodent) => (rodent.type === Type.RODENT ? count + 1 : count), 0));

	let horseCount = $derived(() => $petstate.pets.reduce((count, horse) => (horse.type === Type.HORSE ? count + 1 : count), 0));

    console.log(`Landing page.`);

    onMount(async () => {

        if(!$appstate.account) {
            await appstate.checkLoggedIn();
        }

        // Personalize App
        setModeUserPrefers($appstate.account?.prefs.lightMode ?? $appSettings.lightMode);
        setModeCurrent($appstate.account?.prefs.lightMode ?? $appSettings.lightMode);
        // setModeCurrent($modeCurrent); 

        // Initialize everything you need here
        await initializeApp();
        
        console.log(`Landing page done. ${$appstate.isSignedIn}`);

        goto('/');
        // if (isSignedIn) {
        //     goto('/');
        // } else {
        //     goto('/login');
        // }
    });
  
    async function initializeApp() {
        // Fetch Pets (after user signed in)
        _loadingPets = true;
        await petstate.fetch();
        _loadingPets = false;
        
        // Fetch Clinics
        _loadingVets = true;
        await clinicstate.fetch();
        _loadingVets = false;

    }

  </script>
  
  <main>
    <h1>Loading...</h1>
  </main>
  