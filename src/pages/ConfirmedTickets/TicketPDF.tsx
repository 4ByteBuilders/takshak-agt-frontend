import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { MapPin, Calendar, Ticket as TicketIcon, Watch } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/utils/dateFormatter";
import { Booking } from "@/utils/interfaces";

interface TicketPDFProps {
    booking: Booking;
}

const TicketPDF = ({ booking }: TicketPDFProps) => {
    const ticketRef = useRef<HTMLDivElement>(null);

    const downloadPDF = async () => {
        const element = ticketRef.current;
        if (!element) return;

        // Capture the ticket element with a higher scale for better quality
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        // Get dimensions in pixels and convert to millimeters (1px ≈ 0.264583mm)
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;
        const mmWidth = elementWidth * 0.264583;
        const mmHeight = elementHeight * 0.264583;

        // Create a jsPDF instance with a page size matching the ticket
        const pdf = new jsPDF({
            orientation: mmWidth > mmHeight ? "landscape" : "portrait",
            unit: "mm",
            format: [mmWidth, mmHeight],
        });

        // Add the captured image to the PDF
        pdf.addImage(imgData, "PNG", 0, 0, mmWidth, mmHeight);
        pdf.save(`ticket_${booking.qrCode}.pdf`);
    };

    return (
        <div className="my-5 flex flex-col items-center w-full">
            {/* This container is what will be captured */}
            <div ref={ticketRef}>
                <div className="flex flex-col md:flex-row items-center justify-center ticket-container">
                    {/* QR Code Card */}
                    <Card className="h-full bg-zinc-800 rounded-xl border-0 border-r-4 p-6 pb-2 ticket-card">
                        <div>
                            <QRCode
                                className="w-auto h-auto bg-white border-4 border-white rounded-lg m-auto"
                                value={booking.qrCode}
                            />
                        </div>
                        <div className="flex items-center justify-center mt-2">
                            <TicketIcon strokeWidth="1px" size="16px" className="mr-2" />
                            <CardDescription>{booking.qrCode}</CardDescription>
                        </div>
                    </Card>

                    {/* Event Details Card (for larger screens) */}
                    <Card
                        className="flex-col h-80 rounded-xl bg-zinc-800 border-0 border-l-2 border-dashed border-stone-300 w-5/12 my-5 hidden md:flex"
                    >
                        <div className="flex flex-row justify-start">
                            <div className="flex justify-center items-center ml-3 mt-3 max-w-52">
                                <img
                                    src={booking.event.photoUrls.eventPageUrl}
                                    alt="eventImage"
                                    className="rounded-lg h-40 object-cover"
                                />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">
                                    {booking.event.title}
                                </CardTitle>
                                <div className="flex flex-col mt-2">
                                    <div className="flex items-center mt-2">
                                        <MapPin strokeWidth="1px" size="16px" className="mr-2" />
                                        <CardDescription>{booking.event.venue}</CardDescription>
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <Calendar strokeWidth="1px" size="16px" className="mr-2" />
                                        <CardDescription>
                                            {formatDate(booking.event.dateTime, "DD MMMM YYYY")}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <Watch strokeWidth="1px" size="16px" className="mr-2" />
                                        <CardDescription>
                                            {formatTime(booking.event.dateTime, "hh:mm A")}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </div>
                        <CardContent>
                            <CardDescription className="mx-5 mt-8">
                                <p className="mt-2 bg-green-500/20 backdrop-blur-md border border-green-400/50 shadow-xl rounded-xl px-2 py-1 text-sm font-semibold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
                                    {booking.tickets.length} Ticket(s)
                                </p>
                            </CardDescription>
                        </CardContent>
                        <CardContent>
                            <div className="flex flex-row justify-end">
                                <p>Grand Total ₹{booking.amountPaid}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Event Details Card for small screens */}
                    <Card
                        className="max-w-[320px] flex flex-col h-full rounded-xl bg-zinc-800 border-0 border-t-2 border-dashed border-stone-300 mb-5 md:hidden"
                    >
                        <div className="flex justify-center items-center mt-3">
                            <img
                                src={booking.event.photoUrls.eventPageUrl}
                                alt="eventImage"
                                className="rounded-lg w-11/12"
                            />
                        </div>
                        <CardHeader className="text-left">
                            <CardTitle className="text-xl font-bold">
                                {booking.event.title}
                            </CardTitle>
                            <div className="flex flex-col items-start mt-2">
                                <div className="flex items-center mt-2">
                                    <MapPin strokeWidth="1px" size="16px" className="mr-2" />
                                    <CardDescription>{booking.event.venue}</CardDescription>
                                </div>
                                <div className="flex items-center mt-2">
                                    <Calendar strokeWidth="1px" size="16px" className="mr-2" />
                                    <CardDescription>
                                        {new Date(booking.event.dateTime).toLocaleString()}
                                    </CardDescription>
                                </div>
                                <div className="flex items-center mt-2">
                                    <Watch strokeWidth="1px" size="16px" className="mr-2" />
                                    <CardDescription>
                                        {formatTime(booking.event.dateTime, "hh:mm A")}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="mt-6">
                                <p className="mt-2 bg-green-500/20 backdrop-blur-md border border-green-400/50 shadow-xl rounded-xl px-2 py-1 text-sm font-semibold text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
                                    {booking.tickets.length} Ticket(s)
                                </p>
                            </CardDescription>
                        </CardContent>
                        <CardContent>
                            <div className="flex flex-row justify-end">
                                <p>Grand Total ₹{booking.amountPaid}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Download button for this ticket */}
            <Button onClick={downloadPDF} variant="default" className="mt-4">
                Download Ticket PDF
            </Button>
        </div>
    );
};

export default TicketPDF;
