<script lang="ts">
	import { goto } from '$app/navigation';
	import RightPage from '$lib/_components/RightPage.svelte';
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';
	import { appstate } from '$lib/_stores/auth_store';
	import { appSettings } from '$lib/_stores/settings_store.js';

    let _loading: boolean = false;

    let { data } = $props();
</script>

<!-- HTML head -->
<svelte:head>
	<title>{$appSettings.app.name} | Messages</title>
	<meta name="description" content="About this app" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">
	<!-- Display "Adopt a Buddy" if User is logged in, otherwise prompted to log in -->
    <h3 class="title flex justify-between items-center">

        <!-- If logged in -->

        {#if $appstate.account?.$id && $appstate.account?.emailVerification}
        <button onclick={()=>goto('/pets/add')} type="button" class="btn btn-sm variant-ghost-warning">
            <span class=" flex items-center"><iconify-icon icon="mdi:paw"></iconify-icon></span><span>Add Buddy</span>
        </button>
        {:else}

        <!-- If not logged in -->

        <button onclick={()=>goto('/shelters/adopt')} type="button" class="btn btn-sm variant-ghost-success">
            <span class=" flex items-center"><iconify-icon icon="mdi:paw"></iconify-icon></span><span>Adopt a Buddy</span>
        </button>
        {/if}

        {#if _loading}<LoadingClock/>{/if}
    </h3>

    <!--p>Display goods from established stores and independent (but verified) sellers. Thanks Eva</p-->

    <component this={RightPage}></component>
</main>

<style>
    
</style>