<script lang="ts">
	import { goto } from '$app/navigation';
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';
	import { Type } from '$lib/_models/pet-model';
	import { appstate, clinicstate, petstate } from '$lib/_stores/auth_store';
	import { appSettings } from '$lib/_stores/settings_store';
	import { setModeUserPrefers, setModeCurrent, modeCurrent } from '@skeletonlabs/skeleton';
    import { onMount } from 'svelte';
	import { fade, fly, scale, slide } from 'svelte/transition';


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


    // Simulated loading screen
    onMount(async () => {
        console.log('Splash screen...');

        if(!$appstate.account) {
            await appstate.checkLoggedIn();
        }

        modeCurrent.set($appSettings.lightMode ? true : false);

        // Personalize App
        setModeUserPrefers($appstate.account?.prefs.lightMode ?? $appSettings.lightMode);
        setModeCurrent($appstate.account?.prefs.lightMode ?? $appSettings.lightMode);
        // setModeCurrent($modeCurrent); 

        // Initialize everything you need here
        await initializeApp();
        
        console.log(`Landing page done. ${$appstate.isSignedIn}`);

        goto('/', {replaceState: true});
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


<div class="w-full h-full flex flex-col items-center justify-between ">
    <span>
        &nbsp;
    </span>

    <div class="flex flex-col items-center">
        <div><img src="/images/FurrPrints.webp" alt="Furr Buddies" class="w-20"></div>
        <!--div><img src="/favicon.png" alt="Furr Buddies" class="w-20"></div-->
        <h3 in:scale={{ duration: 800, start:0.6 }} class="text-3xl mt-8 p-0">{ $appSettings.app.name }</h3>
        <small class="m-0 p-0">v { $appSettings.app.version }</small>
        <span><LoadingClock /></span>
    </div>

    <div>
        <span class="font-normal"><a href="https://appwrite.io" target="appwrite">Appwrite</a> | <a href="https://kit.svelte.dev" target="sveltekit">SvelteKit</a> | <a href="https://skeleton.dev" target="skeletonui">SkeletonUI</a> | <a href="https://simmons.studio" target="simmons">Simmons</a></span>
    </div>
    
</div>

<style>
    * {
        color: white
    }
    a {
        color: #a3c6d3
    }
    a:hover {
        text-decoration: underline;
    }
</style>