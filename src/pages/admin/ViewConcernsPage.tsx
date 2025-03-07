import { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "@/supabaseClient";

interface Concern {
  id: string;
  bookingId: string;
  message: string;
  contact: string;
  email: string;
  createdAt: string;
  status: "RESOLVED" | "UNRESOLVED";
}

export default function ViewConcernsPage() {
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [filter, setFilter] = useState<"RESOLVED" | "UNRESOLVED">("UNRESOLVED");

  useEffect(() => {
    const fetchConcerns = async () => {
      try {
        const token = await supabase.auth.getSession().then(({ data }) => data.session?.access_token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/booking/get-concerns`);
        setConcerns(response.data);
      } catch (error) {
        console.error("Error fetching concerns:", error);
      }
    };
    fetchConcerns();
  }, []);

  const handleToggleConcernStatus = async (id: string, currentStatus: "RESOLVED" | "UNRESOLVED") => {
    const newStatus = currentStatus === "UNRESOLVED" ? "RESOLVED" : "UNRESOLVED";
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/booking/update-concern-status`, { id, status: newStatus });
      setConcerns((prevConcerns) =>
        prevConcerns.map((concern) =>
          concern.id === id ? { ...concern, status: newStatus } : concern
        )
      );
    } catch (error) {
      console.error(`Error changing concern status to ${newStatus}:`, error);
    }
  };

  const filteredConcerns = concerns.filter((concern) => concern.status === filter);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">View Concerns</h1>
      <div className="mb-4">
        <button
          onClick={() => setFilter("UNRESOLVED")}
          className={`py-2 px-4 rounded-lg mr-2 ${filter === "UNRESOLVED" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Unresolved Concerns
        </button>
        <button
          onClick={() => setFilter("RESOLVED")}
          className={`py-2 px-4 rounded-lg ${filter === "RESOLVED" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Resolved Concerns
        </button>
      </div>
      <div>
        {filteredConcerns.map((concern) => (
          <div key={concern.id} className="border p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-bold">Booking ID: {concern.bookingId}</h2>
            <p className="text-gray-600">Email: {concern.email}</p>
            <p className="text-gray-600">Contact: {concern.contact}</p>
            <p className="text-gray-600">Message: {concern.message}</p>
            <p className="text-gray-600">Created At: {new Date(concern.createdAt).toLocaleString()}</p>
            <div className="mt-4">
              <button
                onClick={() => handleToggleConcernStatus(concern.id, concern.status)}
                className={`py-2 px-4 rounded-lg ${concern.status === "UNRESOLVED" ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"} text-white`}
              >
                {concern.status === "UNRESOLVED" ? "Mark as Resolved" : "Mark as Unresolved"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}