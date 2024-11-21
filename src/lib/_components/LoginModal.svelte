<script lang="ts">
	import { goto } from "$app/navigation";
import { appstate } from "$lib/_stores/auth_store";
	import constants from "$lib/constants";
	import { getModalStore } from "@skeletonlabs/skeleton";
	import { AppwriteException } from "appwrite";
	import { field, form } from "svelte-forms";
	import { required, pattern, email, min } from "svelte-forms/validators";
	import toast from "svelte-french-toast";
	import { fade, fly, slide } from "svelte/transition";
  const modalStore = getModalStore();
  
    let _email = $state<string>();
    let _password = $state<string>();
    let errorMessage = $state<string>();
    let isLoading = $state<boolean>(false);

    // Minimum of 6 alphabetic characters with at least 1 uppercase letter
    const regExPattern1 = /^(?=.*[A-Z]).{6,}$/;
    // Minimum of 6 alphanumeric characters with at least 1 uppercase letter
    const regExPattern2 = /^(?=.*[A-Z])[a-zA-Z0-9]{6,}$/;
    // Minimum of 6 alphanumeric characters, at least 1 uppercase letter,
    // and allows (or not) the use of any non-alphanumeric characters
    const regExPattern3 = /^(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*()-_+=~`[\]{}|\\:;"'<>,.?/]{6,}$/;

    let femail = field('email', '', [required(), email()]);
    let fpassword = field('password', '', [required(), min(8)]);
    let loginForm = form(femail,fpassword);


    async function handleLogin(e:Event){
      e.preventDefault();

      console.log(_email);
      console.log('femail: ' + $femail.value + ' ' + $femail.valid);
      console.log('fpassword: ' + $fpassword.value + ' ' + $fpassword.valid);

      if (!$loginForm.valid) {
        errorMessage = 'Login form is invalid';
        return;
      }

      if(!($femail.valid || $fpassword.valid)){
        errorMessage = 'You entered invalid details';
        return;
      }
      isLoading = true;
      errorMessage = '';

      try {
          await appstate.login(_email!, _password!); // Replace with your login function
          modalStore.close(); // Close the modal
          location.reload(); // Reload the current page
          toast.success(`Welcome to ${constants.APP_NAME} ${$appstate.account?.name}`);
      } catch (error) {
        if(error instanceof AppwriteException){
          errorMessage = error.message;
        } else {
          errorMessage = 'Login failed. Please try again.';
        }
        console.error(error);
      } finally {
          isLoading = false;
      }
    }

    function resetPassword(e: Event){
      e.preventDefault(); 
      modalStore.close()
      // modalStore.trigger({id: 'loginModal'})
    }
  </script>
  

  <div class="flex gap-4 flex-col p-8 bg-surface-200 dark:bg-slate-800 min-w-[20rem] max-w-[24rem] md:w-[28rem]">
    <h2 class="text-2xl">Login</h2>
    <form onsubmit={handleLogin} class="flex flex-col">
      <label for="email">Email:</label>
      <input id="email" type="email" bind:value={_email} placeholder="Email" required />

      <label for="password" class="mt-2">Password:</label>
      <input type="password" bind:value={_password} placeholder="Password" required />

      <a onclick={(e:Event)=>{resetPassword}} role="button" href={null} class="mt-2 text-end">Forgotten Password?</a>
    
      {#if errorMessage}
        <p
          in:fly={{ duration:300, y:36 }}
          out:fade={{ duration:500 }}
          class="mt-4 text-red-700 dark:text-red-300 min-h-8">{errorMessage ?? ''}</p>
      {/if}

      <div class="mt-6 flex justify-between items-center">
        <button disabled={!$loginForm.dirty} onclick={loginForm.reset} type="reset" class="btn btn-sm text-base">
            Reset Form
        </button>
        <button disabled={ $loginForm.valid === false || !$femail.valid || isLoading} class="btn btn-sm variant-filled-warning" type="submit">
            {#if isLoading}Logging In...{:else}Log In{/if} 
        </button>
      </div>
    </form>

    <!--button class="text-xl p-2 rounded-lg" onclick={() => { modalStore.close(); goto('/auth/register'); } }>New Account</button-->
    <!--button class="text-xl p-2" onclick={() => modalStore.close()}>Cancel</button-->
  </div>