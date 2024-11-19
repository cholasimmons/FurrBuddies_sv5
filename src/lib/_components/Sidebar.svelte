<script lang="ts">
	import { appstate } from "$lib/_stores/auth_store";
    import "iconify-icon";
	import SidebarItem from "./SidebarItem.svelte";

</script>

<ul>
    <!--a href="/home" class:chosen={$page.url.pathname === '/home'} class="order-3 md:order-none">
        <li><iconify-icon icon="mdi:home" class="home"></iconify-icon><span>Home</span></li>
    </a-->
    <SidebarItem href="/home" icon="mdi:home" label="Home" order={3} />
    <SidebarItem href="/pets" icon="mdi:paw" label="Buddies" order={1} />
    <SidebarItem href="/clinics" icon="tabler:building-hospital" label="Clinics" order={2} />
    <SidebarItem href="/mail" icon="mdi:mail" label="Mail" order={4} />
    <SidebarItem href="/user/profile" icon="mdi:user" label="Account" order={5} />
    <!--a href="/pets" class:chosen={$page.url.pathname.startsWith('/pets')} class="order-1 md:order-none"><li><iconify-icon icon="mdi:paw"></iconify-icon>Buddies</li></a-->
    <!--a href="/clinics" class:chosen={$page.url.pathname.startsWith('/clinics')} class="order-2 md:order-none"><li><iconify-icon icon="tabler:building-hospital"></iconify-icon>Clinics</li></a-->
    <!--a href="/shop" class="xl:hidden {$page.url.pathname.startsWith('/shop') ? 'chosen' : ''} hidden md:block"><li><iconify-icon icon="tabler:shopping-cart"></iconify-icon>Shop</li></a-->
    <!--a href="/mail" class:chosen={$page.url.pathname.startsWith('/mail')} class="order-4 md:order-none"><li><iconify-icon icon="mdi:mail"></iconify-icon>Mail</li></a-->
    <!--a href="/setup" class="{$page.url.pathname.startsWith('/setup') ? 'chosen' : ''} order-5 md:order-none"><li><iconify-icon icon="mdi:cog"></iconify-icon>Setup</li></a-->
    <!--a href="/user/profile" class:chosen={$page.url.pathname === '/user/profile'} class="order-5 md:order-none"><li><iconify-icon icon="mdi:user"></iconify-icon>Account</li></a-->
    <div class="hidden md:block">
        <hr class="mx-auto ">
        <!-- If User isn't logged in -->
        <span hidden={ true }> <!-- !$state.account -->
            <SidebarItem href="/auth/logout" label="Sign Out" order={6} />
            <!--a href="/auth/logout" class:chosen={$page.url.pathname === '/auth/logout'}><li>Sign Out</li></a-->
        </span>

        <!-- If User is successfully logged in -->
        <span hidden={ $appstate.account !== null }>
            <SidebarItem href="/auth/login" label="Log In" order={6} />
            <SidebarItem href="/auth/register" label="Sign Up" order={6} />
            <!--a href="/auth/login" class:chosen={$page.url.pathname === '/auth/login'}><li>Log In</li></a-->
            <!--a href="/auth/register" class:chosen={$page.url.pathname === '/auth/register'}><li>Sign Up</li></a-->
        </span>

        <!-- Always show this regardless... -->
        <span>
            <SidebarItem href="/about" label="About" order={6} />
            <SidebarItem href="mailto:bug@buddies.simmons.studio" label="Report a Bug" order={6} />
            <!--a href="/about" class:chosen={$page.url.pathname === '/about'}><li>About</li></a-->
            <!--a href="mailto:bug@buddies.simmons.studio" target="buddies"><li>Report a Bug</li></a-->
        </span>
    </div>
    
</ul>

<style>
    :root {
      --chosen-color-light: rgb(59, 59, 59);
      --chosen-color-dark: rgb(255, 230, 0);
    }
    .chosen, .chosen li iconify-icon {
        /*background-color: rgba(128, 128, 128,0.55);*/
        /* border-right: 4px solid rgb(255, 220, 48); */
        color: var(--chosen-color-light);
        opacity: 1.0;
        font-weight: 400;
    }

    @media (prefers-color-scheme: dark) {
      .chosen, .chosen li iconify-icon {
        color: var(--chosen-color-dark);
      }
    }

    /* Small screens only */
    @media (max-width: 768px) {
        ul {
            font-size: 0.9rem;
            margin: 0;
            padding: 1rem 1.6rem 0.5rem 1.6rem;
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content:space-between
        }
        ul a li {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;
            font-weight: 300;
            transition: transform 0.3s ease;
            opacity: 0.6;
            row-gap: 2px;
        }

        ul a:hover li {
            opacity: 1;
        }
        ul a li iconify-icon {
            font-size: 1.8rem;
            transition: transform 0.3s ease;
        }
        ul a:hover li iconify-icon {
            transform: translateY(-6px);
        }
    }

    /* Larger screens */
    @media (min-width: 769px) {
        ul a:hover li, ul button:hover li {
            transform: translateX(8px);
            opacity: 1;
        }
        /* Just the icon */
        ul a:hover li iconify-icon {
            transform: translateX(-8px);
            opacity: 1;
        }

        ul a li {
            opacity: 0.7;
        }

        ul a li iconify-icon {
            opacity: 0.7;
            font-size: 1.2rem;
            margin-right: 1rem;
            transition: opacity 0.5s ease;
            transition: transform 0.3s ease;
        }
        ul a li, ul button li {
            display: flex;
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