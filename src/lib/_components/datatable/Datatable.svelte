<script lang="ts">

    import type { TableHandler, Row } from '@vincjo/datatables';
    import Search from './Search.svelte';
    import RowsPerPage from './RowsPerPage.svelte';
    import Pagination from './Pagination.svelte';
	import RowCount from './RowCount.svelte';
	import type { Snippet } from 'svelte';

    type T = $$Generic<Row>

    let element: HTMLElement
    let clientWidth = 576;

    

    // const triggerChange = table.getTriggerChange()
    // $: $triggerChange, scrollTop()

    // const scrollTop = () => {
    //     if (element) element.scrollTop = 0
    // }
    let { classs, search = true, rowsPerPage = true, rowCount = true, pagination = true, table, children }: { classs?:string; search:boolean; rowsPerPage:boolean; rowCount:boolean; pagination:boolean; table: TableHandler<T>; children:Snippet } = $props();

    const height = (search || rowsPerPage ? 48 : 8) + (rowCount || pagination ? 48 : 8);
</script>

<section bind:clientWidth class={classs}>
    <header class:container={search || rowsPerPage}>
        {#if search}
            <Search {table} />
        {/if}
        {#if rowsPerPage}
            <RowsPerPage {table} small={clientWidth < 600} />
        {/if}
    </header>

    <article bind:this={element} style="height:calc(100% - {height}px)">
        {@render children()}
    </article>

    <footer class:container={rowCount || pagination} class="w-full bg-surface-300 dark:bg-surface-800">
        {#if rowCount}
            <RowCount {table} small={clientWidth < 576} />
        {/if}
        {#if pagination}
            <Pagination {table} small={clientWidth < 576} />
        {/if}
    </footer>
</section>

<style>
    section {
        height: 100%;
    }

    section :global(table) {
        border-collapse: separate;
        border-spacing: 0;
        width: 100%;
    }

    section :global(thead) {
        position: sticky;
        inset-block-start: 0;
        z-index: 1;
    }

    header, footer {
        min-height: 8px;
        padding: 0 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    header.container, footer.container {
        height: 48px;
    }

    article {
        position: relative;
        /* height:calc(100% - 96px); */
        overflow: auto;
        scrollbar-width: thin;
    }

    article::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    article::-webkit-scrollbar-track {
        background: #f5f5f5;
    }
    article::-webkit-scrollbar-thumb {
        background: #c2c2c2;
    }
    article::-webkit-scrollbar-thumb:hover {
        background: #9e9e9e;
    }
</style>
