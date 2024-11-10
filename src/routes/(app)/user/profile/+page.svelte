<script lang="ts">
	import { goto } from "$app/navigation";
	import ProfileEditForm from "$lib/_components/forms/ProfileEditForm.svelte";
	import { toTitleCase } from "$lib/_utilities/text-transform.js";
	import { appstate, userbucketstate } from "$lib/_stores/auth_store.js";
	import { type ModalComponent, type ModalSettings, Avatar, getModalStore } from "@skeletonlabs/skeleton";
	import { Role } from "appwrite";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";   
	import { appSettings } from "$lib/_stores/settings_store.js";

    let { data } = $props();

    // Loader for sending verification email
    let _sending = $state<boolean>(false);
    let _sent = $state<boolean>(false);

    let modalStore = getModalStore();

    onMount(async ()=>{
        try {
            if(!$appstate.isSignedIn)
                await appstate.checkLoggedIn();
        } catch (error) {
            console.log('Not logged in.',error);
        }
    });


    function managePhoto(): void {
        console.log('btn pressed');
    }

    function editProfile() {
        // Skeleton Form stuff
        const modalComponent: ModalComponent = {
            // Pass a reference to your custom component
            ref: ProfileEditForm,
            // Add the component properties as key/value pairs
            // props: { },
            // Provide a template literal for the default component slot
            // slot: '<p>Skeleton</p>'
        };
        const modal: ModalSettings = {
            type: 'component',
            // Pass the component directly:
            component: modalComponent,
        };

        modalStore.trigger(modal);
    }

    // Delete User Photo from Server and refresh page
    async function removePhoto() {
        // Consult User
        const response = await askUser();
        
        // If rejected, cancel delete
        if(!response) return;
        
        // User approved
        try {
            await appstate.updateUserPrefs({photoID: null});
            setTimeout(()=>{appstate.checkLoggedIn()},2000);
        } catch (error) {
            console.log('Unable to remove user photo. ',error);
        }
    }

    // Skeleton Modal that asks User for confiramtion
    function askUser() {
        return new Promise<boolean>((resolve) => {
            const areyousure: ModalSettings = {
                type: 'confirm',
                // Data
                title: 'Please Confirm',
                body: 'Are you sure you wish to remove your photo?',
                // TRUE if confirm pressed, FALSE if cancel pressed
                response: (r: boolean) => resolve(r),
            };
            modalStore.trigger(areyousure);
            });
    }

    // Resend email with verification link
    async function resendActivationEmail() {
        _sending = true;
        await appstate.sendVerificationEmail();
        _sent = true;
        _sending = false;
    }

let imageURL = $derived(() => $userbucketstate.userPhoto?.href);
// $: initials = $state.initials!;
    
</script>

<!-- HTML head -->
<svelte:head>
	<title>{$appSettings.app.name} | User Profile</title>
	<meta name="description" content="Manage your Account" />
</svelte:head>

<!-- This will be the page that displays the logged in User's account details -->

<!-- HTML body -->
<main class="text-center  px-{data.padding}">
    <section class="mx-auto w-full mt-3 max-w-xl">
        <div in:fade={{ duration: 300 }} class="flex justify-center relative">
            <Avatar src={ !imageURL ? '/icons/user.svg' : imageURL.name } border={ $appstate.account?.emailVerification ? 'border-2' : 'border-[3px] border-red-400'} width="w-32 shadow-[0_1rem_1rem_rgba(0,0,0,0.2)] transition-transform hover:scale-110" />
            
            <button disabled={!$appstate.account?.prefs.photoID} onclick={removePhoto} aria-label="btn" class="absolute ml-36 btn variant-soft-error rounded-full w-8 h-8 ">
                <iconify-icon icon="mdi:remove"></iconify-icon>
            </button>
        </div>
        
        <!-- Display name of User --> 
        <h3 class="text-xl md:text-3xl font-medium text-center mt-6 p-0 flex items-center justify-center gap-2 -mr-4">
            {$appstate.account?.name ?? 'Hello Visitor'}

            {#if $appstate.account}
                <iconify-icon icon={ $appstate._loading ? 'line-md:loading-alt-loop' : $appstate.account?.emailVerification ? 'mdi:tick' : 'mdi:cancel'}
                class="text-lg {$appstate.account?.emailVerification ? 'text-green-500' : 'text-red-500'}" title={$appstate.account && $appstate.account?.emailVerification ? 'Verified Account' : 'Unverified Account'}></iconify-icon>
            {/if}
        </h3>

        <!-- Display email of User --> 
        <p class="opacity-70 m-1 p-0 text-sm">{$appstate.account?.email ?? ''}</p>

        <!-- If logged in -->
        {#if $appstate.account}
            <div class="mt-6 flex flex-col items-center justify-start text-left">
                <p hidden={!$appstate.account?.prefs.phoneNumber}><span>Phone: </span>{$appstate.account?.prefs.phoneNumber}</p>
                <p hidden={!Role.user($appstate.account?.$id)}><span>Role: </span>User</p>
                <p hidden={!$appstate.account?.prefs.gender}><span>Gender: </span>{ ($appstate.account?.prefs.gender).toTitleCase()}</p>
                <p hidden={!$appstate.account?.prefs.dob}><span>Date of Birth: </span>{ $appstate.account?.prefs.dob }</p>

            </div>

            <section class="border-2 border-surface-300 dark:border-surface-700 my-6 py-6 bg-surface-300 dark:bg-surface-700 bg-opacity-40 dark:bg-opacity-20 rounded-lg">
                <div class="flex flex-col items-center">
                    {#if $appstate.account?.emailVerification}
                        <button class="text-500 btn gap-3 hover:bg-surface-500 hover:bg-opacity-30" onclick={editProfile}><iconify-icon icon="mdi:edit"></iconify-icon>Edit Profile</button>
                    {:else}
                        <small class="font-light opacity-70">Your account is not verified, check your email for the activation link.</small>
                        <button class="text-500 btn gap-2 hover:bg-white hover:bg-opacity-20" onclick={resendActivationEmail} disabled={_sent}>
                            <iconify-icon icon="mdi:mail"></iconify-icon>{ _sending ? 'Sending' : _sent ? '' : 'Resend' } Activation Link { _sent ? 'Sent' : '' }
                        </button>
                    {/if}
                </div>
            </section>
        {/if}
        <div class="my-6 max-w-xl btn-group variant-ghost">
            <button disabled={$appstate.account !== null} onclick={()=>goto('/auth/login')} class="rounded-none text-success-400 btn ">Log In</button>
            <button disabled={$appstate.account !== null} onclick={()=>goto('/auth/register')} class="rounded-none text-primary-400 btn ">Sign Up</button>
            <button disabled={!$appstate.account} onclick={()=>goto('/auth/logout')} class="rounded-none text-red-400 btn">Log Out</button>
        </div>
    </section>
</main>

<style>
    div > p {
        margin: 0;
        font-weight:400
    }
    div > p > span {
        opacity: 0.5;
    }
</style>