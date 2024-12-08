<script lang="ts">
	import LoadingClock from '$lib/_components/icons/Loading_Clock.svelte';
	import { appstate } from '$lib/_stores/auth_store.js';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { field, form } from 'svelte-forms';
	import { email, min, pattern, required } from 'svelte-forms/validators';
	import toast from 'svelte-french-toast';
	import { fly, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { appSettings } from '$lib/_stores/settings_store.js';
	import { onMount } from 'svelte';

    let { data } = $props();

    const regexPattern = /^\d{9,12}$/;

    let modalStore = getModalStore();

    // "isLoading" type of boolean
    let _loading = $state<boolean>(true);
    let _registering = $state<boolean>(false);
    let _uploadingPhoto = $state<boolean>(false);

    // Registration response message
    let statusMessage = $state<string>();

    onMount(async ()=>{
        _loading = true;
        try {
            if(!$appstate.isSignedIn)
                await appstate.checkLoggedIn();
        } catch (error: any) {
            console.error(error.message);
        } finally {
            _loading = false;
        }
    });

    // svelte-forms custom validator
    function mustBeTrue() {
        return () => {
            return { valid: true, name: 'Please read our T\'s and C\'s' };
        };
    }

    // svelte-forms form and validation = https://chainlist.github.io/svelte-forms/
    const fclinicname = field('clinicname', '', [required(), min(3)]);
    const fregistration = field('registrationID', '', [required(), min(1)]);
    const fhqarea = field('areas', '', [required(), min(1)]);
    const fhqtown = field('towns', '', [required(), min(1)]);
    const faddress = field('address', '', [required(), min(12)]);
    const fowner_name = field('owner_name', $appstate.account?.name, [required(), min(1)]);
    const fowner_id = field('owner_id', $appstate.account?.$id, [required(), min(1)]);
    const femail = field('email', [$appstate.account?.email], [required(), email()]);
    const fphone = field('phone', [$appstate.account?.prefs?.phoneNumber], [required(), pattern(regexPattern)]);
    const ftc = field('terms', false, [required(), mustBeTrue()]);
    const newClinicForm = form(fclinicname,fregistration,fhqarea,fhqtown,faddress,fowner_name,fowner_id,femail,fphone,ftc);

    const confirmmodal: ModalSettings = {
        type: 'confirm',
        // Data
        title: 'Take note',
        body: 'You are about to register a Veterinary Clinic, after this form has been approved you will be sent a request for payment whereafter you shall be able to add more information to your Clinic such as location, working hours, services, photos, e.tc..',
        // TRUE if confirm pressed, FALSE if cancel pressed
        response: (r: boolean) => r
    };

    // Sign Up with Appwrite :)
    const registerClinic = async () => {
        if (!$newClinicForm.valid) return;
        
        const response = modalStore.trigger(confirmmodal);
        console.log(response);
        
        /*
        try {
            _registering = true;
            await clinicstate.addClinic($fname.value, $fhq.value);
            // await state.login($femail.value, $fpassword.value);
            newClinicForm.clear;
            //goto("/");
            history.back();
        } catch (error: any) {
            // state.alert({ color: "red", message: error.message });
            toast.error(error.message, { style: "red" });
        } finally {
            _registering = false;
        }
        */
    };

    function openLoginModal() {
		const modal: ModalSettings = {
			type: 'component',
			component: 'authModal',
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

</script>

<!-- HTML head -->
<svelte:head>
	<title>{$appSettings.app.name} | Create Clinic</title>
	<meta name="description" content="Add your Veterinary Clinic" />
</svelte:head>

<!-- HTML body -->
<main class="px-{data.padding}">
    {#if !$appstate.isSignedIn } <!-- $appstate.account && $appstate.account.emailVerification} -->
        <p class="mt-0 text-center">
            Please fill in the form
        </p>

        <section class="mx-auto w-full">
            <form onsubmit="{registerClinic}">
                
                <div class="grid grid-cols-3 gap gap-x-2">
                
                    <!-- Clinic Name -->
                    <div class="col-span-3">
                        <label class="block mt-6" for="clinicname"> Veterinary Clinic Name</label>

                        <input id="clinicname" type="text"  class:invalid={!$fclinicname.invalid} placeholder="Name of Clinic"
                            bind:value={$fclinicname.value} />
                            {#if $newClinicForm.hasError('name.required')}
                                <p in:fly={{ duration: 500, y: -20 }} out:fly={{ duration: 300, y: -20 }} class="text-gray-300 text-left">Clinic name is required</p>
                            {/if}
                    </div>

                    <!-- Registration ID -->
                    <div class="col-span-3 md:col-span-1">
                        <label class="block mt-6" for="registration"> Registration ID</label>

                        <input id="registration" type="text" class:invalid={!$fregistration.valid} placeholder="Registration Number"
                            bind:value={$fregistration.value} />
                    </div>

                    <!-- Owner Name -->
                    <div class="col-span-3 md:col-span-2">
                        <label class="block mt-6" for="ownername"> Owner Name</label>

                        <input id="ownername" type="text" class:invalid={!$fowner_name.valid} placeholder="Name of Clinic Owner"
                            bind:value="{$fowner_name.value}" />
                    </div>

                    <!-- Clinic Area -->
                    <div class="col-span-3 md:col-span-2">
                        <label class="block mt-6" for="area"> Area</label>
                        <input type="text" id="area" placeholder="Chelston, Ibex, Buchi" class:invalid={!$fhqarea.valid}
                            bind:value="{$fhqarea.value}">
                    </div>
                    
                    <!-- Clinic Town -->
                    <div class="col-span-3 md:col-span-1">
                        <label class="block mt-6" for="clinichq"> City</label>
                        <select
                            id="clinichq" placeholder="City of Main Office" class:invalid={!$fhqtown.valid}
                            bind:value="{$fhqtown.value}">
                            <option value="Lusaka">Lusaka</option>
                            <option value="Kitwe">Kitwe</option>
                            <option value="Solwezi">Solwezi</option>
                            <option value="Livingstone">Livingstone</option>
                            <option value="Mpulungu">Mpulungu</option>
                            <option value="Kasama">Kasama</option>
                        </select>
                    </div>
                    
                    <!-- Company Email -->
                    <div class="col-span-3 md:col-span-2">
                        <label class="block mt-6" for="clinicemail"> Company Email</label>

                        <input id="clinicemail" type="text" class:invalid={!$femail.valid} placeholder="vet@clinics.zm"
                            bind:value="{$femail.value}" />
                    </div>

                    <!-- Company Phone -->
                    <div class="col-span-3 md:col-span-1">
                        <label class="block mt-6" for="clinicphone"> Phone Number</label>

                        <input id="clinicphone" type="text" class:invalid={!$fphone.valid} placeholder="260 969 667697"
                            bind:value="{$fphone.value}" />
                    </div>

                    <!-- Physical Address -->
                    <div class="col-span-3">
                        <label class="block mt-6" for="address"> Physical Address</label>

                        <input id="address" type="text" class:invalid={!$faddress.valid} placeholder="Physical Address"
                            bind:value="{$faddress.value}" />
                    </div>

                    <!-- Legal -->
                    <section class="col-span-3 p-2 pl-0 flex items-center">
                        <span class="p-4 pl-0">
                            <input type="checkbox" bind:checked={$ftc.value} class="w-6">
                        </span>
                        <p class="opacity-50"><a href="/legal/terms/vets#registration">I agree to the terms and conditions concerning Clinic registration and management</a></p>
                        <hr>
                    </section>
                    
                    <div in:slide={{ duration: 800, easing: cubicOut, axis: 'y'}} class="{statusMessage ? 'flex flex-col' : 'hidden'} w-full h-[6rem] bg-surface-800 bg-opacity-80">
                        {statusMessage}
                    </div>

                    <!-- Form Buttons (Clear Form & Submit) -->

                    <div class="col-span-3 mt-6 flex justify-between items-center">
                        <button disabled={!$newClinicForm.dirty} onclick={newClinicForm.reset} type="reset">
                            Clear Form
                        </button>
                        <span class="flex items-center justify-center gap-4">
                            {#if _uploadingPhoto}<LoadingClock />{/if}

                            <button disabled={ !$newClinicForm.valid || !$ftc.value || _registering } class="btn variant-filled-warning" type="submit">
                                {#if _registering}Applying...{:else}Apply{/if}
                            </button>
                        </span>
                    </div>
                    <div class="spacer"></div>
                </div>
            </form>
        </section>
    {:else}
        <section class="h-full flex flex-col items-center justify-center mt-6">
            <iconify-icon icon="mdi:lock" class="text-2xl"></iconify-icon>
            <p class="text-lg">You need to be signed in and verified before you can proceed</p>

            {#if !$appstate.isSignedIn }
                <button onclick={ openLoginModal } class="my-6 btn shadow-xl hover:shadow-none w-[10rem]">
                    Log In
                </button>
            {/if}
        </section>
    {/if}
</main>

<style>
    .spacer {
        height: 2rem;
    }
    main {
        margin: 2rem 0;
    }
</style>