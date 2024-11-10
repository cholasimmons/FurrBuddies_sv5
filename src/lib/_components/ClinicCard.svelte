<script lang="ts">
	import { appstate } from "$lib/_stores/auth_store";

    let {
        clinicPhoto = undefined,
        clinicName = '',
        clinicLocation = "Ibex, Lusaka",
        grid = true
    } = $props();

    // export const layout: boolean = true; // true: Grid, false: List
    let isGrid = $derived(() => grid);
</script>

<main>
    {#if isGrid.name}
        <div class="card bg-opacity-30 text-left ">
            <header class="card-header p-0 overflow-hidden">
                <div class="w-full h-[10rem] transition-transform ease-out hover:scale-105">
                    <img src={ clinicPhoto ? clinicPhoto : "/images/vet.jpg"} alt="" class="w-full h-full object-cover object-center"/>
                </div>
            </header>
            
            <footer class="card-footer pt-4">
                {#if $appstate.account && $appstate.account.emailVerification}
                    <p class="p-0 m-0 text-lg">{ clinicName }</p>
                    <span class="font-thin">{ clinicLocation }</span>
                {:else if $appstate.account && !$appstate.account.emailVerification}
                    <p class="p-0 m-0 text-lg">Your account is not verified</p>
                    <a href="/" class="font-thin">Return to Home Screen</a>
                {:else}
                    <p class="p-0 m-0 text-lg">You are not logged in</p>
                    <a href="/auth/login" class="font-thin">Log In</a>
                {/if}
            </footer>
            
        </div>
    {:else}
        <div class="text-left w-full flex h-36 mb-4">
            <div class="w-48 h-full overflow-hidden">
                <img src={ clinicPhoto ? clinicPhoto : "/images/vet.jpg"} alt="" class="w-full h-full object-cover object-center transition-transform ease-out hover:scale-105"/>
            </div>
            <div class="p-6 flex-grow bg-surface-800 bg-opacity-50 ">
                <p class="p-0 m-0 text-lg">{ $appstate.account ? clinicName : '' }</p>
                <span class="font-thin">{ clinicLocation }</span>
                <p class="chips"><span>Service 1</span><span>Service 2</span><span>Service 3</span></p>
            </div>
        </div>
    {/if}
</main>

<style>
    p.chips > span {
        @apply py-2 px-4 rounded-full text-center mr-2 bg-tertiary-300 dark:bg-tertiary-700 hover:bg-tertiary-400 hover:dark:bg-tertiary-800;
    }
</style>