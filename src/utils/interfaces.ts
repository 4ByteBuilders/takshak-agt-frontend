
export interface Event {
    id: string;
    title: string;
    venue: string;
    dateTime: string;
    totalNumberOfTickets: number;
    description: string;
    photoUrls: PhotoUrls;
    priceOfferings: PriceOffering[];
    createdAt: string;
}

export interface UnparsedEvent {
    id: string;
    title: string;
    venue: string;
    dateTime: string;
    totalNumberOfTickets: number;
    description: string;
    photoUrls: string;
    priceOfferings: PriceOffering[];
    createdAt: string;
}

interface PhotoUrls {
    loginPageUrl: string;
    homePageUrl: string;
    eventPageUrl: string;
}

export interface PriceOffering {
    id: string;
    name: string;
    price: number;
    capacity: number;
}

export interface Ticket {
    id: string;
    event: Event;
    eventId: string;
    bookingId: string | null;
    status: string;
}

export interface Booking {
    id: string;
    userId: string;
    eventId: string;
    priceOfferingSelected: PriceOffering;
    tickets: Ticket[];
    amountPaid: number;
    paymentStatus: string;
    paymentSessionId: string | null;
    createdAt: string;
    numVerifiedAtVenue: number | null;
    qrCode: string;
    event: Event;
}
export interface UnparsedBooking {
    id: string;
    userId: string;
    eventId: string;
    priceOfferingSelected: PriceOffering;
    tickets: Ticket[];
    amountPaid: number;
    paymentStatus: string;
    paymentSessionId: string | null;
    createdAt: string;
    numVerifiedAtVenue: number | null;
    qrCode: string;
    event: UnparsedEvent;
}

export interface PaymentGatewayDetails {
    gateway_name: string;
    gateway_order_id: string;
    gateway_payment_id: string;
    gateway_order_reference_id: string;
    gateway_status_code: string;
    gateway_settlement: string;
}

export interface PaymentMethod {
    upi?: {
        channel: string;
    };
}

export interface PaymentResponse {
    auth_id: string | null;
    authorization: string | null;
    bank_reference: string;
    cf_payment_id: string;
    entity: string;
    error_details: string | null;
    is_captured: boolean;
    order_amount: number;
    order_id: string;
    payment_amount: number;
    payment_completion_time: string;
    payment_currency: string;
    payment_gateway_details: PaymentGatewayDetails;
    payment_group: string;
    payment_message: string;
    payment_method: PaymentMethod;
    payment_offers: string | null;
    payment_status: "SUCCESS" | "FAILED" | "USER_DROPPED" | "ERROR" | "UNKNOWN";
    payment_time: string;
}