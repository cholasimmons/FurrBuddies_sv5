<script lang="ts">
	import Carousel from 'svelte-carousel';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { ads, clinicstate, petstate, appstate } from '$lib/_stores/auth_store.js';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { Type } from '$lib/_models/pet-model.js';
	import BuddyCard from '$lib/_components/BuddyCard.svelte';
	import { getFirstName } from '$lib/_utilities/split-names';
	import { appSettings } from '$lib/_stores/settings_store.js';
	import { cubicInOut } from 'svelte/easing';
	import { getModalStore, LightSwitch, type ModalSettings } from '@skeletonlabs/skeleton';

	let { data } = $props();

	// Loaders
	let _loadingVets = $state<boolean>(false);
	let _loadingPets = $state<boolean>(false);

	// Activation Email Loader
	let _sending = $state<boolean>(false);
	let _sent = $state<boolean>(false);

	let dashboardItems = $state<any>([]);

	let posts = $state<any>([]);

	let dogCount = $derived(() => $petstate.pets.reduce((count, pet) => (pet.type === Type.DOG ? count + 1 : count), 0));
	// Using the "@" symbol to activate runes mode for reactivity on object properties
	let catCount = $petstate.pets.reduce(
		(count, cat) => (cat.type === Type.CAT ? count + 1 : count), 0
	);
	let birdCount = $derived(() => $petstate.pets.reduce((count, bird) => (bird.type === Type.BIRD ? count + 1 : count), 0));
	let rabbitCount = $derived(() => $petstate.pets.reduce((count, rabbit) => (rabbit.type === Type.RABBIT ? count + 1 : count), 0));
	let rodentCount = $derived(() => $petstate.pets.reduce((count, rodent) => (rodent.type === Type.RODENT ? count + 1 : count), 0));

	let horseCount = $derived(() => $petstate.pets.reduce((count, horse) => (horse.type === Type.HORSE ? count + 1 : count), 0));

	const modalStore = getModalStore();

	onMount(async ()=>{
		try {
			// No need to fetch user if already signed in, the layout handled that already
			// if(!$appstate.account) {
			// 	await appstate.checkLoggedIn();
			// }
			

			if($appstate.account?.prefs.showCarousel === true){
				ads.fetch(); // we don't have to wait on this
			}

			// If our Pet appstate is empty, make a fresh fetch
			if($petstate.pets.length < 1){
				_loadingPets = true;
				await petstate.fetch();
				_loadingPets = false;
			}
			
			// If our Clinics store is empty, make a fresh fetch
			if($clinicstate.length < 1){
				_loadingVets = true;
				await clinicstate.fetch();
				_loadingVets = false;
			}

			posts = [
				{title: 'Title One', comment: 'Lorem Ipsum...' },
				{title: 'Title Three', comment: 'Lorem Ipsum...' },
				{title: 'Title Two', comment: 'Lorem Ipsum...' },
			];
			
			dashboardItems = [
				{name: 'Dog', value: dogCount, icon: 'mdi:dog', title: 'Dog\'s'},
				{name: 'Cat', value: catCount, icon: 'mdi:cat', title: 'Cat\'s'},
				{name: 'Bird', value: birdCount, icon: 'mdi:bird', title: 'Bird\'s'},
				{name: 'Rabbit', value: rabbitCount, icon: 'mdi:rabbit', title: 'Rabbit\'s'},
				{name: 'Rodent', value: rodentCount, icon: 'mdi:rodent', title: 'Rodent\'s'},
				{name: 'Horse', value: horseCount, icon: 'mdi:horse', title: 'Horse\'s'},
				{name: 'Doctor', value: $clinicstate.length, icon: 'mdi:doctor', title: 'Veterinarian\'s'}
		/*		
				{name: 'Injection', value: 95434, icon: 'mdi:injection'},
				{name: 'Medicine', value: 127890, icon: 'mdi:pill'}
		*/
			];
		} catch (error) {
			console.warn('Error . ', error);
			_loadingPets = false;
			_loadingVets = false;
		}
	});

	function openLoginModal() {
		const modal: ModalSettings = {
			type: 'component',
			component: 'loginModal',
			// type: 'prompt',
			// // Data
			// title: 'Login',
			// body: 'Provide your first name in the field below.',
			// // Populates the input value and attributes
			// value: 'Skeleton',
			// valueAttr: { type: 'text', minlength: 3, maxlength: 10, required: true },
			// // Returns the updated response value
			response: (r: string) => console.log('response:', r),
		};
		modalStore.trigger(modal);
	}


/*
	let petCount:number;

	// Count types of owned animals for dashboard
	function countAnimalTypes(type: string): number {
		petCount = 0;

		// check pet appstate
		if($petstate.pets.length < 1) return petCount;

		// iterate through number of different animal types
		$petstate.pets.forEach(pet => 
			pet.type === type ? petCount += 1 : null
		)
		return petCount;
	}
*/


	// console.warn($petstate.pets.reduce((count, pet) => (pet.type === Type.DOG ? count + 1 : count), 0));

	// Resend email with verification link
    async function resendActivationEmail() {
        _sending = true;
        await appstate.sendVerificationEmail();
        _sent = true;
        _sending = false;
    }

</script>

<!-- HTML head -->
<svelte:head>
	<title>{$appSettings.app.name}</title>
	<meta name="description" content="{$appSettings.app.name} Home" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">

	<!-- Carousel slideshow -->	

	{#if browser && $ads.length>0 && $appSettings.showCarousel }
		<!-- Carousel containing information/ads from the server -->
		<div in:fade={{ duration:200, delay:100 }} class="max-w-xl mx-auto max-h-[14rem] rounded-2xl overflow-hidden">
		<Carousel autoplay autoplayDuration={4400} pauseOnFocus={false} dots={false} arrows={false} swiping={true}>
			{#each $ads as { image, title, details, link }}
				<a href={link}  target="_blank">
					<div class="w-full h-[14rem] relative">
						<img src={image} alt='' class="w-full h-[14rem] object-cover object-center">
						{#if title}
							<div class="absolute bottom-0 py-2 px-6 bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 bg-opacity-90 min-w-1/3 rounded-tr-xl">
								<h2 class="m-0 font-medium">{title}</h2>
								<p class="m-0 text-sm">{details}</p>
							</div>
						{/if}
					</div>
				</a>
			{/each}
		</Carousel>
		</div>
	{:else if $appSettings.showLandingImage}
		<!-- If no carousel items, display default static landing image -->
		<div class=" mx-auto w-full max-h-[16rem] rounded-2xl overflow-hidden">
			<img src={ $appSettings.landingImage } alt="Welcome" class="w-full h-[16rem] sm:h-[18rem] object-cover object-center">
		</div>
	{/if}

	{#if false}
	<section class="grid grid-cols-3  gap-3">
		<!-- Display posts -->
		{#each posts as post, index}
			<div in:fade={{ duration:300, delay: 100*(index+1) }}
				class="rounded-xl border-2 border-surface-200 p-4 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 h-min">
				<h4 class="text-xl">{ post.title }</h4>
				<p>{ post.comment }</p>
			</div>
		{/each}
	</section>
	{/if}

	<!-- "Dashboard" -->
	<section class="px-{data.padding}">
		

		<!-- If no signed in User -->

		{#if !$appstate.account || !$appstate.account.emailVerification}
			<div in:fade={{ duration:300 }} out:fade={{ duration: 150 }} class="my-8 w-full flex flex-col items-center justify-center">
				<h3 class="w-full title text-center">{ !$appstate.account ? 'A' : 'Your' } new account awaits you { !$appstate.account?.emailVerification ? getFirstName($appstate.account?.name??'') : '' }</h3>
				{#if $appstate.account?.emailVerification === false}

					<section class="my-6 p-6 bg-surface-800 dark:bg-surface-200 bg-opacity-10 dark:bg-opacity-10 rounded-lg">
						<div class="flex flex-col items-center">
							<small class="font-light opacity-70">Your account is not verified, check your email for the activation link.</small>
							<button in:fade={{duration:1000, delay: 4000, easing: cubicInOut}} class="text-500 btn gap-2 hover:bg-white hover:bg-opacity-20" onclick={resendActivationEmail} disabled={_sent}>
								<iconify-icon icon="mdi:mail"></iconify-icon>{ _sending ? 'Sending' : _sent ? '' : 'Resend' } Activation Link { _sent ? 'Sent' : '' }
							</button>
						</div>
					</section>
				{:else}
					<button onclick={openLoginModal} class="text-lg hover:shadow-[6px_8px_0_rgba(0,0,0,0.2)] btn btn-lg variant-ghost-tertiary w-[10rem]">
						Log In
					</button>
				{/if}
			</div>

		<!-- Signed In -->

		{:else}
			<hr>

			<!-- Dashboard items - Signed in User -->
			<div in:fade={{ duration:100, delay: 170 }} class="my-8 h-[3rem] flex justify-evenly gap-2">
				{#if _loadingPets || _loadingVets}
					<div out:fade={{ duration:90 }} class="mx-auto w-[50%] h-[2rem] rounded-xl placeholder animate-pulse bg-surface-700 bg-opacity-20">&nbsp;
					</div>
				{:else}
					<!-- Display animal status -->
					{#each dashboardItems as item, index}
						{#if item.value > 0}
						<div in:fade={{ duration:300, delay: 100*(index+1) }} title={ item.title }
							class="rounded-xl border-2 border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 h-min">
							<button onclick={()=>console.info('Button tapped')} class="btn btn-sm text-left flex items-center py-1 px-3">
								<iconify-icon icon={item.icon ?? ''} class=" text-2xl"></iconify-icon>
								<span class="text-lg text-center">{ item.value !== undefined ? `${item.value}` : '0' }</span>
							</button>
						</div>
						{/if}
					{/each}
				{/if}
			</div>
			
			<!-- Display buddies if available -->
			{#if _loadingPets }
				<span class="animate-pulse" out:fade={{ duration:150}}>Checking on your buddies...</span>
			{:else}
				<!-- Display each available buddy -->
				<div in:fade={{ duration:400, delay: 180 }} class="my-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-6 gap-6  justify-center">
					
					<!-- Add a new Buddy -->
					<button onclick={()=>goto('/pets/add')} in:fade={{ duration:300 }}>
						<main class="flex flex-col justify-center items-center text-center ">
							<div class="rounded-[50%] w-[90%] py-[28%] border-[50%] relative flex flex-col justify-center items-center hover:cursor-pointer">
								<p>Add Buddy</p>
								<iconify-icon icon="mdi:plus" class="animate-ping text-3xl "></iconify-icon>
							</div>
						</main>
					</button>

					{#each $petstate.pets as pet, i}
						<button onclick={()=>goto('/pets/'+pet.$id)}  in:fade={{ duration:300, delay: 200*(i+1)}}>
							<BuddyCard petName={pet.name} photoID={ pet.photoID?.[0] ?? '' } />
						</button>
					{/each}
				</div>
			{/if}

		{/if}

		<div class="mt-[2rem] hidden flex-col items-center justify-center transition-transform">
			<p>{ $clinicstate?.length || 0 } Clinics available</p>
		</div>
	</section>
</main>

<style>
	section {
		margin: 1rem 0;
	}
</style>