<script lang="ts">
    import type { TableHandler, Row } from '@vincjo/datatables'

    type T = $$Generic<Row>

    export let table: TableHandler<T>
    let value = '';
    const search = table.createSearch()
</script>

{#snippet header()}
    <input type="text" bind:value={search.value} oninput={() => search.set()}
    placeholder={table.i18n.search} spellcheck="false" class={$$props.class ?? 'py-4'}>
{/snippet}

<style>
    input {
        border-radius: 6px;
        outline: none;
        padding: 1rem;
        line-height: 36px;
        margin: 0;
        height: 36px;
        background: transparent;
        width: 50%;
        max-width: 196px;
        min-width: 96px;
        transition: all, 0.1s;
    }
    input:focus, input:hover {
        @apply dark:bg-surface-700 bg-surface-300;
    }
</style>
