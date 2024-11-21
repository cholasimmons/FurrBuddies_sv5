<script lang="ts">
    import type { TableHandler, Row } from '@vincjo/datatables';

    type T = $$Generic<Row>

    export let table: TableHandler<T>
    export let orderBy: string;
    export let align: 'left' | 'right' | 'center' = 'left'

    const identifier = orderBy?.toString()
    const sorted = table.createSort(identifier);
</script>

<th onclick={() =>{ sorted.set()}}
    class:sortable={orderBy}
    class:active={sorted.isActive}
    class={$$props.class ?? ''}
>
    <div class="flex"
        style:justify-content={align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'}
    >
        <p class="font-medium text-base px-4 py-2">
            <slot />
        </p>
        <span class:asc={sorted.direction === 'asc'}>^</span>
        <span class:desc={sorted.direction === 'desc'}>v</span>
    </div>
</th>

<style>
    th {
        background: inherit;
        white-space: nowrap;
        font-size: 13px;
        user-select: none;
    }
    th.sortable {
        cursor: pointer;
    }
    th.sortable div.flex {
        padding: 0;
        display: flex;
        align-items: center;
        height: 100%;
    }
    th.sortable span {
        padding-left: 8px;
    }
    th.sortable span:before,
    th.sortable span:after {
        border: 6px solid transparent;
        content: '';
        display: block;
        height: 0;
        width: 0;
    }
    th.sortable span:before {
        @apply mt-1 border-b-slate-800 dark:border-b-slate-200;
    }
    th.sortable span:after {
        @apply mt-1 border-t-slate-800 dark:border-t-slate-200;
    }
    th.active.sortable span.asc:before {
        border-bottom-color: #9e9e9e;
    }
    th.active.sortable span.desc:after {
        border-top-color: #9e9e9e;
    }
    th:not(.sortable) span {
        visibility: hidden;
    }
</style>
