import { useState } from "react";
import { getWithExpiry } from "@/utils/fetchLocalStorage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const RaiseConcern = () => {
  const navigate = useNavigate();
  const bookingId = getWithExpiry("booking_id");
  const [concern, setConcern] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    contactNumber?: string;
    concern?: string;
  }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateContactNumber = (number: string) => {
    const contactNumberRegex = /^\d{10}$/;
    return contactNumberRegex.test(number);
  };

  const validateConcern = (concern: string) => {
    const words = concern.trim().split(/\s+/);
    return words.length >= 5;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: {
      email?: string;
      contactNumber?: string;
      concern?: string;
    } = {};

    if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!validateContactNumber(contactNumber)) {
      newErrors.contactNumber = "Contact number must be 10 digits";
    }

    if (!validateConcern(concern)) {
      newErrors.concern = "Concern must be at least 5 words";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/booking/create-concern",
        {
          bookingId,
          message: concern,
          contact: contactNumber,
          email,
        }
      );

      setIsDialogOpen(true);
    } catch {
      toast.error("Some error occurred. Redirecting to home page.");
      navigate("/");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("+91-7005483524");
    toast.success("Contact number copied to clipboard!");
  };

  if (!bookingId) {
    return (
      <div className="h-full w-full ">
        Booking ID expired or not found. Please try again.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Raise Concern</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Booking ID */}
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">
                Booking ID
              </label>
              <input
                type="text"
                value={bookingId}
                readOnly
                className="w-full rounded-lg bg-inherit border border-gray-500 p-2"
              />
            </div>

            {/* Concern */}
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">
                Concern
              </label>
              <textarea
                value={concern}
                onChange={(e) => setConcern(e.target.value)}
                rows={4}
                placeholder="Enter your concern here..."
                className="w-full rounded-lg bg-inherit border border-gray-500 p-2"
              />
              {errors.concern && (
                <p className="text-red-500 text-xs sm:text-sm">
                  {errors.concern}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full rounded-lg bg-inherit border border-gray-500 p-2"
              />
              {errors.email && (
                <p className="text-red-500 text-xs sm:text-sm">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">
                Contact Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 text-gray-600">
                  +91
                </span>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Enter your contact number"
                  className="w-full rounded-r-lg bg-inherit border border-gray-500 p-2"
                />
              </div>
              {errors.contactNumber && (
                <p className="text-red-500 text-xs sm:text-sm">
                  {errors.contactNumber}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <Button type="submit" className="w-full bg-amber-400">
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              We are sorry you had a poor experience with us
            </DialogTitle>
          </DialogHeader>
          <p>
            We will get back to you within 24 hrs. In case it's urgent, you may
            contact us at:{" "}
            <span onClick={handleCopy} className="text-blue-500 cursor-pointer">
              +91-7005483524
            </span>
          </p>
          <DialogFooter>
            <Button onClick={() => navigate("/booking-history")}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RaiseConcern;
