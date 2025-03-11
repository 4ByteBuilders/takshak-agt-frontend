import { formatDate, formatTime } from '@/utils/dateFormatter';
import { ExtendedBooking } from '@/utils/interfaces';
import { PDFDocument, rgb } from 'pdf-lib';
import QRCode from 'qrcode';

export async function generateStyledTicketPDF(booking: ExtendedBooking) {
    try {

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 250]); // Custom size matching the design

        const { width, height } = page.getSize();

        // Background
        page.drawRectangle({
            x: 0,
            y: 0,
            width,
            height,
            color: rgb(0.1, 0.1, 0.1), // Dark background
        });

        // Dotted Line
        page.drawLine({
            start: { x: width / 2.5, y: 0 },
            end: { x: width / 2.5, y: height },
            thickness: 2,
            dashArray: [4, 4],
            color: rgb(0.8, 0.8, 0.8), // Light Grey Dotted Line
        });

        // === Left Side (QR Code Section) ===
        const qrCodeDataUrl = await QRCode.toDataURL(booking.qrCode);
        const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);

        page.drawImage(qrImage, {
            x: 40,
            y: height - 190,
            width: 150,
            height: 150,
        });

        page.drawText(booking.qrCode.slice(0, 8), {
            x: 85,
            y: height - 210,
            size: 10,
            color: rgb(0.8, 0.8, 0.8),
        });

        // === Right Side (Event Details) ===
        // Event Image
        const imageBytes = await fetch(booking.event.photoUrls.eventPageUrl).then((res) =>
            res.arrayBuffer()
        );
        const eventImage = await pdfDoc.embedPng(imageBytes);
        page.drawImage(eventImage, {
            x: width / 2.5 + 20,
            y: height - 100,
            width: 100,
            height: 90,
        });

        // Event Details
        page.drawText(booking.event.title, {
            x: width / 2.5 + 140,
            y: height - 40,
            size: 18,
            color: rgb(1, 1, 1),
        });

        page.drawText(`Venue: ${booking.event.venue}`, {
            x: width / 2.5 + 140,
            y: height - 70,
            size: 12,
            color: rgb(1, 1, 1),
        });

        page.drawText(`Date: ${formatDate(booking.event.dateTime, "DD MMMM YYYY")}`, {
            x: width / 2.5 + 140,
            y: height - 90,
            size: 12,
            color: rgb(1, 1, 1),
        });

        page.drawText(`Time: ${formatTime(booking.event.dateTime, "hh:mm A")}`, {
            x: width / 2.5 + 140,
            y: height - 110,
            size: 12,
            color: rgb(1, 1, 1),
        });

        page.drawText(`Tickets: ${booking.tickets.length}`, {
            x: width / 2.5 + 20,
            y: height - 150,
            size: 12,
            color: rgb(0.5, 1, 0.5),
        });
        // Price Details
        booking.priceDetails.forEach((priceDetail, idx) => {
            page.drawText(
                `${priceDetail.quantity} x ${priceDetail.name} (Rs. ${priceDetail.price})`,
                {
                    x: width / 2.5 + 140,
                    y: height - 170 - idx * 15,
                    size: 10,
                    color: rgb(0.8, 0.8, 0.8),
                }
            );
        });

        // Grand Total
        page.drawText(`Grand Total Rs. ${booking.amountPaid}`, {
            x: width - 200,
            y: 20,
            size: 14,
            color: rgb(1, 1, 1),
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `ticket_${booking.qrCode}.pdf`;
        link.click();
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}
