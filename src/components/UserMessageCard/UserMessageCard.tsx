import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface UserMessageCardProps {
  name: string;
  email: string;
  message: string;
  onMarkAsRead: () => void;
  status: string;
}

export default function UserMessageCard({ name, email, message, onMarkAsRead, status }: UserMessageCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const openGmailCompose = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=Reply to your message on takshakagt.in`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <div className="border p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-gray-600">{email}</p>
      <div className="mt-4">
        <button
          onClick={openDialog}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mr-2"
        >
          Read Message
        </button>
        <button
          onClick={onMarkAsRead}
          className={`py-2 px-4 rounded-lg ${status === "UNREAD" ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"} text-white`}
        >
          {status === "UNREAD" ? "Mark as Read" : "Mark as Unread"}
        </button>
        <button
          onClick={openGmailCompose}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg ml-2"
        >
          Reply via Gmail
        </button>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Message from {name}</AlertDialogTitle>
            <AlertDialogDescription>
              <span>{message}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDialog}>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}