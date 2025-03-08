import { useEffect, useState } from "react";
import { Plus, Trash } from "lucide-react";
import { supabase } from "@/supabaseClient";
import axios from "axios";
import { toast } from "sonner";

interface Verifier {
  id: string;
  email: string;
}

export default function AddVerifiersPage() {
  const [email, setEmail] = useState("");
  const [verifiers, setVerifiers] = useState<Verifier[]>([]);
  const adminUrl = import.meta.env.VITE_FRONTEND_ADMIN_URL;

  useEffect(() => {
    const fetchVerifiers = async () => {
      try {
        const token = await supabase.auth.getSession().then(({ data }) => data.session?.access_token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/verify`);
        if (res.status === 200) {
          setVerifiers([...res.data]);
        } else {
          toast.error("An error occurred. Redirecting to dashboard...");
          window.location.href = `${adminUrl}/dashboard`;
        }
      } catch {
        toast.error("An error occurred. Redirecting to dashboard...");
        window.location.href = `${adminUrl}/dashboard`;
      }
    };
    fetchVerifiers();
  }, [adminUrl]);

  const handleAddVerifier = async () => {
    if (email && verifiers && !verifiers.some((verifier) => verifier.email === email)) {
      try {
        const token = await supabase.auth.getSession().then(({ data }) => data.session?.access_token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/verify/add`, { email });
        
        if (response.status === 200) {
          setVerifiers([...verifiers, response.data]);
          toast.success("Verifier added successfully.");
          setEmail("");
        } else {
          toast.error("Failed to add verifier.");
        }
      } catch {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  const handleDeleteVerifier = async (id: string) => {
    try {
      const token = await supabase.auth.getSession().then(({ data }) => data.session?.access_token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/verify/remove`, { data: { id } });

      if (response.status === 200) {
        setVerifiers(verifiers.filter((verifier) => verifier.id !== id));
        toast.success("Verifier removed successfully.");
      } else {
        toast.error("Failed to remove verifier.");
      }
    } catch {
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col h-screen p-6 mt-12">
      <div className="flex flex-col items-start mb-6">
        <h1 className="text-3xl font-bold mb-4">Add Verifiers</h1>
        <div className="flex items-center mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter verifier's email"
            className="p-2 border border-gray-300 rounded-l-lg text-black w-80"
          />
          <button
            onClick={handleAddVerifier}
            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-r-lg"
          >
            <Plus />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-start">
        <ul className="w-full max-w-md p-4">
          {verifiers && verifiers.map((verifier) => (
            <li
              key={verifier.id}
              className="flex items-center justify-between p-2 border-b border-gray-300 mb-2"
            >
              <span>{verifier.email}</span>
              <button
                onClick={() => handleDeleteVerifier(verifier.id)}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                <Trash />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}