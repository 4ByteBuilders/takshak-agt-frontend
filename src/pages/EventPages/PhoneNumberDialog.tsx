import React, { useState } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import PhoneNumberInput from "./PhoneNumberInput";
import { toast } from "sonner";
import axios from "axios";

interface PhoneNumberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

const PhoneNumberDialog: React.FC<PhoneNumberDialogProps> = ({
    open,
    onOpenChange,
    onSuccess,
}) => {
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        // Basic validation: require at least 10 digits
        if (!phone || phone.replace(/\D/g, "").length < 10) {
            setError("Please enter a valid phone number.");
            return;
        }
        setLoading(true);
        const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/user/update-phone`,
            { phoneNumber: phone }
        );
        if (res.status !== 200) {
            toast.error("Failed to update phone number.");
            setError("Failed to update phone number. Please try again.");
        } else {
            toast("Phone number updated successfully.");
            onSuccess();
        }
        setLoading(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Enter Your Phone Number</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please enter your phone number to proceed to payment.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                    <PhoneNumberInput value={phone} onChange={setPhone} error={error} />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default PhoneNumberDialog;
