<script lang="ts">
    import { onNavigate } from "$app/navigation";

    onNavigate(async (navigation) => {
        if(!document.startViewTransition && navigation.from?.route.id === navigation.to?.route.id) return;

        return new Promise(resolve => {
            document.startViewTransition(async () => {
                resolve();
                // @ts-ignore
                await navigation.complete;
            });
        });
    });
</script>