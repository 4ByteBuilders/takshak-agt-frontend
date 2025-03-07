// BookingDetails.tsx
import { Booking } from "@/utils/interfaces";

interface BookingDetailsProps {
    booking: Booking;
}

export default function BookingDetails({ booking }: BookingDetailsProps) {
    const { user, totalPeople, numVerifiedAtVenue } = booking;

    return (
        <div className="mt-6 p-6 bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
            <div className="flex items-center gap-4 mb-4">
                <img src={user.avatar_url} alt={user.full_name} className="w-12 h-12 rounded-full" />
                <div>
                    <p className="font-semibold">{user.full_name}</p>
                    <p className="text-sm">{user.email}</p>
                </div>
            </div>
            <p>
                <span className="font-semibold">Total People Allowed:</span> {totalPeople}
            </p>
            <p>
                <span className="font-semibold">Checked in at Venue:</span> {numVerifiedAtVenue}
            </p>
        </div>
    );
}
