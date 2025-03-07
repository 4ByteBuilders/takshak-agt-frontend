import { supabase } from "@/supabaseClient";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FaCalendarAlt, FaPlusCircle } from "react-icons/fa";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <button
          onClick={() => navigate("/admin/my-events")}
          className="flex items-center justify-center p-6 bg-blue-500 hover:bg-blue-600 transition-all text-white font-semibold rounded-lg shadow-lg"
        >
          <FaCalendarAlt className="mr-3 text-2xl" />
          My Events
        </button>
        <button
          onClick={() => navigate("/admin/create-event")}
          className="flex items-center justify-center p-6 bg-green-500 hover:bg-green-600 transition-all text-white font-semibold rounded-lg shadow-lg"
        >
          <FaPlusCircle className="mr-3 text-2xl" />
          Create Event
        </button>
      </div>
    </div>
  );
}