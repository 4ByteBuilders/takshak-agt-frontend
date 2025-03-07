import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel } from "@/components/ui/alert-dialog";

interface UserMessageCardProps {
    name: string;
    email: string;
    message: string;
    onMarkAsRead: () => void;
}

export default function UserMessageCard({ name, email, message, onMarkAsRead }: UserMessageCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);

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
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                >
                    Mark as Read
                </button>
            </div>

            {isDialogOpen && (
                <AlertDialog>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Message from {name}</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription>
                            <p>{message}</p>
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={closeDialog}>Close</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}