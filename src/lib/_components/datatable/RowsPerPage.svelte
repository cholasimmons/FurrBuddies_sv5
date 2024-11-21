<script lang="ts">
    import type { TableHandler, Row } from '@vincjo/datatables'

    type T = $$Generic<Row>

    const { classs, small, table }:{ classs?:string; small:boolean; table:TableHandler<T> } = $props();
    const options = [5, 10, 20, 40];
    let rowsPerPage = $derived(() => table.rowsPerPage);
    
</script>

<aside class={'dark:text-surface-300 text-surface-700 '+ classs }>
    {#if !small}
        <span>{table.i18n.show}</span>
    {/if}
    <select bind:value={table.rowsPerPage} onchange={() => table.setPage(1)}>
        {#each [5, 10, 20, 50] as option}
            <option value={option}>{option}</option>
        {/each}
    </select>

    {#if !small}
        <span>{table.i18n.entries}</span>
    {/if}
</aside>

<style>
    aside {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 32px;
        color: #757575;
    }
    select {
        margin: 0 8px;
        border-radius: 6px;
        padding: 6px 12px;
        color: black
    }
</style>
