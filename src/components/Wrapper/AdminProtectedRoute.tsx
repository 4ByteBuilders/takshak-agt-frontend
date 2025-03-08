import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import Loader from "@/components/Loader/Loader";
import { setWithExpiry } from "@/utils/fetchLocalStorage";
import { toast } from "sonner";
import { X } from "lucide-react";
import axios from "axios";

interface ProtectedRouteProps {
  children: ReactNode;
}

const AdminProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (user) {
        try {
          const { data } = await supabase.auth.getSession();
          const auth = data.session?.access_token;
          axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;
          const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/check-admin`, { user });
          if (res.status === 200 && res.data.isAdmin) {
            setIsAdmin(true);
          } else {
            toast.error("You are not authorized to access this page.");
            navigate("/admin"); // Redirect to login or any other non-admin route
          }
        } catch {
          toast.error("An error occurred. Please try again later.");
          navigate("/admin"); // Redirect to login or any other non-admin route
        }
      } else {
        navigate("/admin"); // Redirect to login if no user is found
      }
      setIsAuthenticated(!!user?.user);
    };
    checkAuth();
  }, [navigate]);

  if (isAuthenticated === null || isAdmin === null) return <Loader />;

  if (!isAuthenticated || !isAdmin) {
    toast.custom(() => (
      <div className="flex items-center gap-4 bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-lg shadow-lg border border-red-300 transform transition-transform hover:scale-105">
        <div className="w-10 h-10 flex items-center justify-center bg-white bg-opacity-50 rounded-full backdrop-blur-sm">
          <X className="h-5 w-5 text-red-600" />
        </div>
        <div className="text-sm font-semibold tracking-wide">You need to log in to access this page.</div>
      </div>
    ));
    setWithExpiry("redirectAfterLogin", location.pathname, 1000 * 60 * 5);
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;