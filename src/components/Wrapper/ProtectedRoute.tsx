import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import Loader from "@/components/Loader/Loader";
import { setWithExpiry } from "@/utils/fetchLocalStorage";
import { toast } from "sonner";
import { X } from "lucide-react";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: user } = await supabase.auth.getUser();
            setIsAuthenticated(!!user?.user);
        };
        checkAuth();
    }, []);

    if (isAuthenticated === null) return <Loader />;

    if (!isAuthenticated) {
        toast.custom(() => (
            <div className="flex items-center gap-4 bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-lg shadow-lg border border-red-300 transform transition-transform hover:scale-105">
                <div className="w-10 h-10 flex items-center justify-center bg-white bg-opacity-50 rounded-full backdrop-blur-sm">
                    <X className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-sm font-semibold tracking-wide">You need to log in to access this page.</div>
            </div>
        ));
        setWithExpiry("redirectAfterLogin", location.pathname, 1000 * 60 * 5);
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
