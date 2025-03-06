import { useAuth } from "@/lib/Providers/AuthProvider";
import { format } from "date-fns";
import { Pencil } from "lucide-react";
import { useState } from "react";

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center text-red-500">
        Please log in to view your profile
      </div>
    );
  }

  const [contactNumber, setContactNumber] = useState(user.phone || "");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N.A.";
    return format(new Date(dateString), "do MMMM yyyy");
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContactNumber(e.target.value);
    if (error) {
      // Clear error on user input change
      setError("");
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    // If input is cleared, revert to original value
    if (!contactNumber.trim()) {
      setContactNumber(user.phone || "");
    }
    setIsEditing(false);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleVerifyClick();
    }
  };

  const validatePhoneNumber = (number: string) => {
    // Validates that the number is exactly 10 digits
    return /^\d{10}$/.test(number);
  };

  const handleVerifyClick = () => {
    if (!validatePhoneNumber(contactNumber)) {
      setError("Please enter a valid 10-digit phone number.");
    } else {
      setError("");
      setIsEditing(false);
      // Optionally: trigger a backend update for the verified number.
    }
  };

  return (
    <div className="mt-10 md:mt-20 mb-20 max-w-2xl container mx-auto p-6 shadow-md rounded-lg bg-card text-card-foreground">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div className="space-y-4 w-full md:w-auto">
          <div className="md:hidden flex flex-col items-center">
            <h1 className="text-3xl pb-5 font-bold">
              {user.user_metadata.full_name}
            </h1>
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="w-32 h-32 md:w-44 md:h-44 rounded-full mt-4 md:mt-0"
            />
          </div>
          <h1 className="hidden md:block text-3xl pb-5 font-bold">
            {user.user_metadata.full_name}
          </h1>
          <p>
            <strong className="block text-muted-foreground">email</strong>{" "}
            {user.email}
          </p>
          <p>
            <strong className="block text-muted-foreground">provider</strong>{" "}
            {user.app_metadata.provider}
          </p>
          <p>
            <strong className="block text-muted-foreground">
              last sign in
            </strong>{" "}
            {formatDate(user.last_sign_in_at || "")}
          </p>
          <p>
            <strong className="block text-muted-foreground">
              in Takshak's family since
            </strong>{" "}
            {formatDate(user.created_at)}
          </p>
          <p className="flex flex-col">
            <strong className="block text-muted-foreground">contact</strong>
            {isEditing ? (
              <div className="flex flex-col">
                {error && (
                  <span className="text-red-500 text-xs mb-1">{error}</span>
                )}
                <div className="flex gap-1 items-center">
                  <span>+91</span>
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={handleContactChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className={`border-b ${
                      error ? "border-red-500" : "border-gray-500"
                    } focus:outline-none focus:border-primary ml-2 px-2 py-1 w-40 bg-transparent text-white`}
                    autoFocus
                  />
                  <button
                    onClick={handleVerifyClick}
                    className="ml-2 px-2 py-1 bg-yellow-400 font-bold text-gray-700 rounded text-sm"
                  >
                    Verify
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <span>+91</span>
                <span
                  className={`ml-2 border-b border-gray-500 ${
                    contactNumber ? "text-white" : "text-gray-400"
                  }`}
                >
                  {contactNumber || "Not Available"}
                </span>
                <button
                  onClick={handleEditClick}
                  className="ml-2"
                  aria-label="Edit contact number"
                >
                  <Pencil className="w-5 h-5 text-white" />
                </button>
              </div>
            )}
          </p>
        </div>
        <img
          src={user.user_metadata.avatar_url}
          alt="Profile"
          className="hidden md:block w-32 h-32 md:w-44 md:h-44 rounded-full mt-4 md:mt-0"
        />
      </div>
    </div>
  );
}

export default Profile;
