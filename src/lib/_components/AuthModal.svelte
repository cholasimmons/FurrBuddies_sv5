<script>
    import { onMount } from 'svelte';
    import { appstate } from '$lib/_stores/auth_store';
    import { get } from 'svelte/store'; // To access store values reactively
	  import { Modal } from '@skeletonlabs/skeleton';
  
    let email = $state('');
    let password = $state('');
    let errorMessage = $state('');
  </script>
  

  <div>
      <input type="email" bind:value={email} placeholder="Email" required />
      <input type="password" bind:value={password} placeholder="Password" required />
      {#if errorMessage}
        <p class="error-message">{errorMessage}</p>
      {/if}
  </div>
  
  <style>
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 5px;
      position: relative;
    }
    .error-message {
      color: red;
    }
  </style>
  