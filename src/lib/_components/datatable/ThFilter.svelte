<script lang="ts">
    import type { TableHandler, Row } from '@vincjo/datatables'

    type T = $$Generic<Row>

    let value: string = $state('');
    let { classs, table, filterBy, align = "left" }: { classs:string; table: TableHandler; filterBy:string; align:'left' | 'right' | 'center' } = $props();
    const filter = table.createFilter(filterBy);
</script>

<th class={classs ?? ''}>
    <input
        style:text-align={align}
        type="text"
        placeholder="Filter..."
        spellcheck="false"
        class="bg-transparent px-4 py-1 font-medium "
        bind:value={filter.value}
        oninput={() => filter.set()}
    />
</th>

<style>
    input::placeholder {
        @apply text-sm italic text-slate-600 dark:text-slate-400 font-medium;
    }
    input:focus {
        outline: none;
        border: none;
    }
</style>
