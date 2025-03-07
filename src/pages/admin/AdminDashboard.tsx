import { supabase } from "@/supabaseClient";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FaUserCheck, FaEnvelope, FaExclamationCircle } from "react-icons/fa";

export default function AdminDashboard() {
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
          console.log(res.data);
          if (!(res.status === 200 && res.data.isAdmin)) {
            toast.error("You are not authorized to access this page.");
            navigate("/admin/login"); // Redirect to login or any other non-admin route
          }
        } catch {
          toast.error("An error occurred. Please try again later.");
          navigate("/admin/login"); // Redirect to login or any other non-admin route
        }
      } else {
        navigate("/admin/login"); // Redirect to login if no user is found
      }
    };
    checkUser();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <h1 className="text-5xl font-bold mb-8 text-white-100">Admin Dashboard</h1>
      <div className="flex flex-col gap-6 w-full max-w-2xl">
        <button
          onClick={() => navigate("/admin/add-verifiers")}
          className="flex items-center justify-center p-6 bg-green-500 hover:bg-green-600 transition-all text-white font-semibold rounded-lg shadow-lg"
        >
          <FaUserCheck className="mr-3 text-2xl" />
          Add Verifiers
        </button>
        <button
          onClick={() => navigate("/admin/view-messages")}
          className="flex items-center justify-center p-6 bg-blue-500 hover:bg-blue-600 transition-all text-white font-semibold rounded-lg shadow-lg"
        >
          <FaEnvelope className="mr-3 text-2xl" />
          View Messages
        </button>
        <button
          onClick={() => navigate("/admin/view-concerns")}
          className="flex items-center justify-center p-6 bg-red-500 hover:bg-red-600 transition-all text-white font-semibold rounded-lg shadow-lg"
        >
          <FaExclamationCircle className="mr-3 text-2xl" />
          View Concerns
        </button>
      </div>
    </div>
  );
}