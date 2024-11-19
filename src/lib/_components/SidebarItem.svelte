<script lang="ts">
    import { page } from '$app/stores';
  
    let {href, icon, label, order }: { href:string; icon?:string; label:string; order:number } = $props();
  </script>
  
  <a href={href} class:chosen={$page.url.pathname.startsWith(href)} class="order-{order} md:order-none">
      <li>
        {#if icon}<iconify-icon {icon}></iconify-icon>{/if}
        {label}
      </li>
  </a>
  
  <style>
    :root {
      --chosen-color-light: rgb(56, 56, 56);
      --chosen-color-dark: rgb(255, 221, 0);
    }

    .chosen li, .chosen li * {
        /*background-color: rgba(128, 128, 128,0.55);*/
        /* border-right: 4px solid rgb(255, 220, 48); */
        opacity: 1;
        font-weight: 400;
        color: var(--chosen-color-light);
        fill: var(--chosen-color-light);
    }

    @media (prefers-color-scheme: dark) {
      .chosen li, .chosen li * {
        color: var(--chosen-color-dark);
        fill: var(--chosen-color-dark);
        opacity: 1;
      }
    }

    /* Small screens only */
    @media (max-width: 768px) {

        a li:not(chosen) {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;
            font-weight: 300;
            transition: transform 0.3s ease;
            opacity: 0.6;
            row-gap: 2px;
        }

        a:hover li {
            opacity: 1;
        }
        a li iconify-icon {
            font-size: 1.8rem;
            transition: transform 0.3s ease;
        }
        a:hover li iconify-icon {
            transform: translateY(-6px);
        }
    }

    /* Larger screens */
    @media (min-width: 769px) {

        a:hover li, button:hover li {
            transform: translateX(8px);
            opacity: 1;
        }
        /* Just the icon */
        a:hover li iconify-icon {
            transform: translateX(-8px);
            opacity: 1;
        }


        a li:not(chosen) iconify-icon {
            opacity: 0.7;
            font-size: 1.25rem;
            margin-right: 1rem;
            transition: opacity 0.5s ease;
            transition: transform 0.3s ease;
        }
        a li:not(chosen), li:not(chosen) {
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 1rem;
            font-weight: 400;
            padding: 1rem 1.2rem;
            border-radius: 8px;
            position: relative;
            overflow: hidden;
            flex-grow: 1;
            transition: opacity 0.5s ease;
            transition: transform 0.3s ease;
        }
    }
  </style>
  