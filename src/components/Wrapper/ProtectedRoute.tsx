import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import Loader from "../Loader/Loader";
import { setWithExpiry } from "@/utils/fetchLocalStorage";


interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: user } = await supabase.auth.getUser();
            setIsAuthenticated(!!user?.user);
            setLoading(false);
        };
        checkAuth();
    }, []);

    if (loading) <Loader />;

    if (!isAuthenticated) {
        setWithExpiry("redirectAfterLogin", location.pathname, 1000 * 60 * 5);
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
