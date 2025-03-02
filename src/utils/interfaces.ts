
export interface Event {
    id: string;
    title: string;
    venue: string;
    dateTime: string;
    totalNumberOfTickets: number;
    description: string;
    photoUrls: string[];
    priceOfferings: PriceOffering[];
    createdAt: string;
}

export interface PriceOffering {
    id: string;
    name: string;
    price: number;
    capacity: number;
}
