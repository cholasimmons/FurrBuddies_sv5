import { appstate } from "$lib/_stores/auth_store";
import { redirect } from "@sveltejs/kit";
import toast from "svelte-french-toast";

export const load = async () => {
    try {

        if(appstate.checkVerificationStatus()){
            toast.custom('You are already logged in');
            throw new Error('Already signed in');
        }
        
        
    } catch {
        throw redirect(307, "/");
    }
}