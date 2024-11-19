<script lang="ts">
    import { slide, fly, fade, scale } from 'svelte/transition';
    import { type Snippet } from 'svelte';
  
    let { key, children, duration = 300 }:{ key:string; children?: Snippet; duration: number } = $props();

    // let children:Snippet;
  </script>
  
  {#key key}
    <div
      out:fly={{ duration, y:4 }}
      in:fade={{ duration, delay: (duration+50) }}
      style="position: relative; inset: 0; height: 100%;">
      {@render children!()} <!-- <slot/> -->
    </div>
  {/key}