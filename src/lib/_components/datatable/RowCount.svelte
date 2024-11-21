<script lang="ts">
    import type { TableHandler, Row } from '@vincjo/datatables'
	import Th from './Th.svelte';

    type T = $$Generic<Row>

    let { styleclass, small, table }:{ styleclass?:string, small:boolean, table:TableHandler<T>} = $props();
    const { start, end, total } = $derived(table.rowCount);
</script>

<aside class={styleclass}>
    {#if small}
        {#if total > 0}
            <b>{start}</b>-
            <b>{end}</b>/
            <b>{total}</b>
        {:else}
            {table.i18n.noRows}
        {/if}
    {:else if total > 0}
        {@html (table.i18n.rowCount??'')
            .replace('{start}', `<b>${start}</b>`)
            .replace('{end}', `<b>${end}</b>`)
            .replace('{total}', `<b>${total}</b>`)}
    {:else}
        {table.i18n.noRows}
    {/if}
</aside>

<style>
    aside {
        line-height: 32px;
        font-weight: 200;
        opacity: 0.6;
        font-size: 14px;
    }
</style>
