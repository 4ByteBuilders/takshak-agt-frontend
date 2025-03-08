import { useNavigate } from "react-router-dom";
import { FaUserCheck, FaEnvelope, FaExclamationCircle } from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 mt-12">
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