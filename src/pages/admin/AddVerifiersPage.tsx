import { useEffect, useState } from "react";
import { Plus, Trash } from "lucide-react";

export default function AddVerifiersPage() {
  const [email, setEmail] = useState("");
  const [verifiers, setVerifiers] = useState<string[]>([]);

  useEffect(() => {
    // Fetch existing verifiers from the database and update states
  }, []);

  const handleAddVerifier = () => {
    if (email && !verifiers.includes(email)) {
      setVerifiers([...verifiers, email]);
      setEmail("");
    }
  };

  const handleDeleteVerifier = (emailToDelete: string) => {
    setVerifiers(verifiers.filter((verifier) => verifier !== emailToDelete));
  };

  return (
    <div className="flex flex-col h-screen p-6">
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
          {verifiers.map((verifier) => (
            <li
              key={verifier}
              className="flex items-center justify-between p-2 border-b border-gray-300 mb-2"
            >
              <span>{verifier}</span>
              <button
                onClick={() => handleDeleteVerifier(verifier)}
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