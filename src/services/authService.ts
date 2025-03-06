import { supabase } from "@/supabaseClient";
import { User } from "@supabase/supabase-js";

export const getCurrentUser = async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session?.user || null);
    });

    return () => authListener.subscription.unsubscribe();
};
