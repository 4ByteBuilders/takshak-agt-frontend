import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";
import { useEffect } from "react";
import axios from "axios";

const AdminLoginPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                try {
                    const { data } = await supabase.auth.getSession();
                    const auth = data.session?.access_token;
                    axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;
                    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/check-admin`, { user });
                    if (res.status === 200 && res.data.isAdmin) {
                        // Redirect to admin dashboard or any other admin route
                        navigate("/admin/dashboard");
                    }
                    else {
                        toast.error("You are not authorized to access this page.");
                        navigate("/admin/login"); // Redirect to home or any other non-admin route
                    }
                }
                catch {
                    toast.error("An error occurred. Please try again later.");
                    navigate("/admin/login"); // Redirect to home or any other non-admin route
                }
            }
        };
        checkUser();
    }, [navigate]);

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin + "/admin/dashboard"
            }
        });
        if (error) {
            toast.error(error.message);
        } else {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/check-admin`, { user });
                if (res.data.isAdmin) {
                    navigate("/admin/dashboard");
                } else {
                    toast.error("You are not authorized to access this page.");
                    navigate("/"); // Redirect to home or any other non-admin route
                }
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen p-3">
            <h1 className="text-4xl font-bold mb-5">Welcome Admin!</h1>
            <p className="text-lg mb-5">Please log in to access the admin panel.</p>
            <button
                onClick={handleGoogleLogin}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 transition-all text-white font-semibold rounded-md"
            >
                Sign in with Google
            </button>
        </div>
    );
};

export default AdminLoginPage;