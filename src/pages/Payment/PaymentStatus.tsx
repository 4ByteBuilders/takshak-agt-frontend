import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PaymentResponse } from "@/utils/interfaces";
import Lottie from "lottie-react";
import sucessAnimation from "@/assets/payment/success.json";
import failedAnimation from "@/assets/payment/failed.json";
import droppedAnimation from "@/assets/payment/dropped.json";
import errorAnimation from "@/assets/payment/error.json";
import axios from "axios";
import { supabase } from "@/supabaseClient";
import { Button } from "@/components/ui/button";

export default function PaymentStatus() {
    const [searchParams] = useSearchParams();
    const order_id = searchParams.get("order_id");

    const [status, setStatus] = useState<PaymentResponse["payment_status"] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchPaymentStatus() {
            try {
                const auth = (await supabase.auth.getSession()).data.session?.access_token;
                axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;
                const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/booking/payment-status", {
                    params: { order_id },
                });


                const data: PaymentResponse[] = await response.data;

                if (data.length > 0) {
                    setStatus(data[0].payment_status);
                } else {
                    setStatus("UNKNOWN");
                }
            } catch (error) {
                console.error("Error fetching payment status:", error);
                setStatus("ERROR");
            } finally {
                setLoading(false);
            }
        }

        if (order_id) {
            fetchPaymentStatus();
        }
    }, [order_id]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 p-6">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 max-w-md w-full text-center transition-all duration-300">
                {loading ? (
                    <div className="flex flex-col items-center">
                        <div className="animate-spin h-12 w-12 border-t-4 border-blue-500 dark:border-blue-400 rounded-full"></div>
                        <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Fetching payment status...</p>
                    </div>
                ) : (
                    <>
                        {status === "SUCCESS" && (
                            <div>
                                <Lottie animationData={sucessAnimation} className="h-24 mx-auto" />
                                <h2 className="text-green-600 dark:text-green-400 text-2xl font-bold mt-4">Payment Successful! 🎉</h2>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">Your order has been confirmed.</p>
                            </div>
                        )}
                        {status === "FAILED" && (
                            <div>
                                <Lottie animationData={failedAnimation} className="h-24 mx-auto" />
                                <h2 className="text-red-600 dark:text-red-400 text-2xl font-bold mt-4">Payment Failed</h2>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">Something went wrong. Please try again.</p>
                                <button className="mt-4 bg-red-600 dark:bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition">
                                    Retry Payment
                                </button>
                            </div>
                        )}
                        {status === "USER_DROPPED" && (
                            <div>
                                <Lottie animationData={droppedAnimation} className="h-24 mx-auto" />
                                <h2 className="text-yellow-600 dark:text-yellow-400 text-2xl font-bold mt-4">Payment Incomplete</h2>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">You abandoned the payment. Try again.</p>
                                <button className="mt-4 bg-yellow-500 dark:bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 dark:hover:bg-yellow-500 transition">
                                    Resume Payment
                                </button>
                            </div>
                        )}
                        {(status === "ERROR" || status === "UNKNOWN") && (
                            <div>
                                <Lottie animationData={errorAnimation} className="h-24 mx-auto" />
                                <h2 className="text-gray-700 dark:text-gray-300 text-2xl font-bold mt-4">Error</h2>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">We couldn’t retrieve your payment status.</p>
                            </div>
                        )}
                        <Button className="mt-8" onClick={() => window.location.replace("/")}>
                            Back to Home
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
