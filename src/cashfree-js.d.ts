declare module '@cashfreepayments/cashfree-js' {
    export function load(options: { mode: 'sandbox' | 'production' }): Promise<Cashfree>;
    export interface Cashfree {
        checkout(options: { paymentSessionId: string; redirectTarget?: string }): void;
    }
}
