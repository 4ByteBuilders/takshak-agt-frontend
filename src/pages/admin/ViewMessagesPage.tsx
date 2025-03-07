import { useEffect, useState } from "react";
import axios from "axios";
import UserMessageCard from "@/components/UserMessageCard/UserMessageCard";

interface Message {
  id: string;
  name: string;
  userId: string;
  email: string;
  message: string;
  createdAt: string;
  status: "UNREAD" | "READ";
}

export default function ViewMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<"UNREAD" | "READ">("UNREAD");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/all-messages`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, []);

  const handleToggleReadStatus = async (id: string, currentStatus: "UNREAD" | "READ") => {
    const newStatus = currentStatus === "UNREAD" ? "READ" : "UNREAD";
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/admin/change-message-status`, { id, status: newStatus });
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === id ? { ...message, status: newStatus } : message
        )
      );
    } catch (error) {
      console.error(`Error changing message status to ${newStatus}:`, error);
    }
  };

  const filteredMessages = messages.filter((message) => message.status === filter);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">View Messages</h1>
      <div className="mb-4">
        <button
          onClick={() => setFilter("UNREAD")}
          className={`py-2 px-4 rounded-lg mr-2 ${filter === "UNREAD" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Unread Messages
        </button>
        <button
          onClick={() => setFilter("READ")}
          className={`py-2 px-4 rounded-lg ${filter === "READ" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Read Messages
        </button>
      </div>
      <div>
        {filteredMessages.map((message) => (
          <UserMessageCard
            key={message.id}
            name={message.name}
            email={message.email}
            message={message.message}
            onMarkAsRead={() => handleToggleReadStatus(message.id, message.status)}
          />
        ))}
      </div>
    </div>
  );
}