<script lang="ts">
	import { goto } from '$app/navigation';
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';
	import { mail, appstate } from '$lib/_stores/auth_store.js';
	import { appSettings } from '$lib/_stores/settings_store.js';
	import { truncateString } from '$lib/_utilities/text-transform.js';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import { fade } from 'svelte/transition';


	let { data } = $props();

	// Loaders
	let _loading: boolean = $state(false);
	let _fetching: boolean = $state(false);
	// $: mail = $mail;
	let email = $mail;

	onMount(async ()=>{
		_loading = true;
		
		// await appstate.checkLoggedIn();
		if($appstate.account?.emailVerification){
			_fetching = true;
			try {
				await mail.fetch();
			} catch(e) {
				console.error(e);
				toast.error('Could not retrieve mail');
			} finally {
				_fetching = false;
			}
		}
		_loading = false;
	});

	// Manual refresh
	async function refreshInbox() {
		_fetching = true;
		try {
			await mail.fetch();
		} catch (error:any) {
			console.error(error);
			toast.error(error?.message);
		} finally {
			_fetching = false;
		}
	}

</script>

<!-- HTML head -->
<svelte:head>
	<title>{$appSettings.app.name} | Messages</title>
	<meta name="description" content="Your personalized inbox" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">

	<!-- Header -->
    <h3 class="title flex justify-between items-center">
        <!-- Left Panel -->
        <div class="flex items-center gap-2">
			{#if !_loading && $appstate.account?.$id}
                <button in:fade={{ duration:100, delay:100}} onclick={refreshInbox} disabled={ !$appstate.account?.emailVerification } type="button" class="btn btn-sm variant-ghost">
                    <span class=" flex items-center"><iconify-icon icon="mdi:refresh" class={_fetching ? 'animate-spin' : ''}></iconify-icon></span>
                    <span>Refresh Inbox</span>
                </button>
			{/if}
            {#if _loading}<span in:fade={{duration:700}} out:fade={{duration:700}}><LoadingClock/></span>{/if}
        </div>
        
        <!-- Right Panel -->
		{#if $appstate.account?.emailVerification }
			<div class="{ $appstate.account ? 'flex items-center' : 'hidden'} ">
				<button class="btn-icon btn-icon-lg" type="button" aria-label="Menu"><iconify-icon icon="mdi:filter"> </iconify-icon></button>
			</div>
		{/if}
    </h3>

	<!-- main -->
	{#if _loading}
		<section in:fade={{ duration: 300, delay: 250 }} out:fade={{ duration:200 }} class="text-center mt-16">
			<div class="flex flex-col items-center justify-center gap-3 pt-12">
				<iconify-icon icon="mdi:mail-outline" class="text-3xl animate-bounce"></iconify-icon>
				<div class="flex flex-col items-center">
					<h3 class="title">Please hold on a moment...</h3>
				</div>
			</div>
		</section>
	{:else if $appstate.account && $appstate.account.emailVerification }
	<!-- User logged in and verified - Display Mail -->

		{#if $mail?.length < 1 }
			<section in:fade={{ duration: 300, delay: 250 }} out:fade={{ duration:200 }} class="text-center mt-16">
				<div class="flex flex-col items-center justify-center gap-3 pt-12">
					<iconify-icon icon="mdi:mail-outline" class="text-3xl"></iconify-icon>
					<div class="flex flex-col items-center">
						<h3 class="title">Having messages would be awesome!</h3>
					</div>
					
				</div>
				
			</section>
		{:else}

			<!-- Display each available message -->
			<dl in:fade={{ duration:200, delay: 250 }} out:fade={{ duration:250 }} class="mt-5 list-dl">
				{#each email as mail, index}
					<a href="/mail/{mail.$id}">
						<div in:fade={{ duration:200, delay: (index+1)*100 }} class="bg-surface-700 bg-opacity-30 hover:bg-surface-hover-token border-2 border-surface-300 dark:border-surface-700">
							<span class="w-[2rem] h-[2rem]">💌</span>
							<span class="flex-col overflow-x-hidden ">
								<dt class="{mail.isRead ? 'font-light' : 'font-bold'}">{mail.title}</dt>
								<dd class="font-medium">{ truncateString(mail.message)}</dd>
							</span>
						</div>
					</a>
				{/each}
			</dl>
		{/if}
	
	{:else if $appstate.account && !$appstate.account.emailVerification}
	<!-- User logged in but not verified - Notice to get verified -->

		<div in:fade={{ duration: 300, delay: 250 }} out:fade={{ duration:200 }} class="flex flex-col items-center justify-center gap-3 pt-12">
			<iconify-icon icon="mdi:mail" class="text-3xl"></iconify-icon>
			<p class="text-sm">Your account needs to be verified first</p>
		</div>
	
	{:else}
	<!-- User NOT logged in - Prompt to log in -->

		<div in:fade={{ duration: 300, delay: 250 }} out:fade={{ duration:200 }} class="flex flex-col items-center justify-center gap-3 pt-12">
			<p class="text-lg">You're missing out!</p>
			<button onclick={()=>goto('/auth/login')} class="hover:shadow-[6px_8px_0_rgba(0,0,0,0.2)] btn btn-lg variant-ghost-tertiary">
				Log in
			</button>
		</div>
	{/if}
</main>

<style>
	dl.list-dl > a > div {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		margin-bottom: 0.6rem;
		padding: 0.8rem 1rem;
	}

	dl.list-dl > a > div dt {
		font-weight: 400;
		font-size: 1.2rem;
	}
	dl.list-dl > a > div dd {
		font-weight: 200;
	}
	main {
		margin: 1rem 0;
	}
</style>