<script lang="ts">
	import { vetstate } from "$lib/_stores/vet_store.js";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
    import 'iconify-icon';
	import LoadingClock from "$lib/_components/icons/Loading_Clock.svelte";
	import { goto } from "$app/navigation";
	import ClinicCard from "$lib/_components/ClinicCard.svelte";
	import { appSettings } from "$lib/_stores/settings_store.js";
	import { appstate } from "$lib/_stores/auth_store.js";
	import { cubicInOut } from "svelte/easing";

    let { data } = $props();

    // "isLoading" type of boolean
    let _loading = $state(false);

    // Layout data
    let isGrid = $state(true);

    onMount(async ()=>{
        _loading = true;

        try {
            await vetstate.fetch();
        } catch (error: any) {
            console.warn('Error loading Clinics. ', error.message);
        } finally {
            _loading = false;
        }
    });

    async function refreshClinics() {
        try{
            _loading = true;
            await vetstate.fetch();
        } catch(e) {
            console.error(e);
        }
        finally {
            _loading = false;
        }
    }

</script>

<!-- HTML head -->
<svelte:head>
	<title>{$appSettings.app.name} | Clinics</title>
	<meta name="description" content="A list of available health specialists" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">

    <!-- inner header -->
    <h3 class="title flex justify-between items-center">
        <!-- Left Panel -->
        <div class="flex items-center gap-2 min-h-[1.5rem]">
            <button in:fade={{ duration:100, delay:100}} hidden={!$vetstate.length} onclick={()=>goto('/clinics/register')} type="button" class="btn btn-sm variant-ghost-secondary">
                <span class=" flex items-center"><iconify-icon icon="mdi:hospital"></iconify-icon></span>
                <span>Own a Clinic?</span>
            </button>

            {#if _loading}
                <span in:fade={{duration:800}} out:fade={{duration:800}}><LoadingClock /></span>
            {/if}
        </div>

        <!-- Right Panel -->
        <div class="flex items-center gap-2 ">
            {#if $vetstate.length > 0}
            <button class="btn-icon btn-icon-lg" type="button" aria-label="button"><iconify-icon icon="mdi:filter"></iconify-icon></button>
            <button class="btn-icon btn-icon-lg" type="button" aria-label="button" onclick={()=>isGrid = !isGrid}><iconify-icon icon="mdi:{isGrid ? 'grid' : 'format-list-bulleted-square'}"></iconify-icon></button>
            {/if}
        </div>
    </h3>

    <!-- main -->
    {#if !$vetstate.length || $vetstate.length < 1}
        <section in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class="text-center py-8 h-full flex flex-col items-center">
            <h3 class="w-full title text-center">No Clinics available yet</h3>
                
            <span class="h-6">
                {#if _loading}
                    <p in:fade={{ duration: 300 }} out:fade={{ duration:200 }} class=" m-0 animate-pulse">Searching...</p>
                {/if}
            </span>
            <!--button onclick={()=>goto('/clinics/register')}
                class="mt-8 text-lg shadow-[6px_8px_0_rgba(0,0,0,0.2)] hover:shadow-none btn btn-lg variant-ghost-tertiary" type="button">Register your Veterinary Clinic
            </button-->
            {#if $vetstate.length < 1}
                <button onclick={()=>refreshClinics()}
                    class="mt-4 text-lg hover:shadow-[6px_8px_0_rgba(0,0,0,0.2)] btn btn-lg variant-ghost-tertiary" type="button">Refresh
                </button>
            {/if}
        </section>
    {:else}
        <div in:fade={{ duration: 300, delay:300 }} class="my-8 {isGrid ? 'grid grid-cols-1 sm:grid-cols-2 ' : 'flex flex-col'} gap-4">
            {#each $vetstate as clinic, index}
                <a href={$appstate.account?.emailVerification ? `/clinics/${clinic.$id}` : null}>
                    <ClinicCard clinicName={clinic.name} grid={isGrid}/>
                </a>
            {/each}
        </div>
    {/if}
</main>