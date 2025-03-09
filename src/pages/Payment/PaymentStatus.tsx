import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PaymentResponse } from "@/utils/interfaces";
import Lottie from "lottie-react";
import sucessAnimation from "@/assets/payment/success.json";
import failedAnimation from "@/assets/payment/failed.json";
import droppedAnimation from "@/assets/payment/dropped.json";
import errorAnimation from "@/assets/payment/error.json";
import pendingAnimation from "@/assets/payment/pending.json";
import axios from "axios";
import { supabase } from "@/supabaseClient";
import { Button } from "@/components/ui/button";

export default function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const order_id = searchParams.get("order_id");
  const navigate = useNavigate();

  const [status, setStatus] = useState<
    PaymentResponse["payment_status"] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPaymentStatus() {
      try {
        const auth = (await supabase.auth.getSession()).data.session
          ?.access_token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/booking/payment-status",
          {
            params: { order_id },
          }
        );

        const data: PaymentResponse = await response.data;

        if (data) {
          setStatus(data.payment_status);
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
            <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
              Fetching payment status...
            </p>
          </div>
        ) : (
          <>
            {status === "SUCCESS" && (
              <div>
                <Lottie
                  animationData={sucessAnimation}
                  className="h-24 mx-auto"
                />
                <h2 className="text-green-600 dark:text-green-400 text-2xl font-bold mt-4">
                  Payment Successful! 🎉
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Your order has been confirmed.
                </p>
              </div>
            )}
            {status === "FAILED" && (
              <div>
                <Lottie
                  animationData={failedAnimation}
                  className="h-24 mx-auto"
                />
                <h2 className="text-amber-600 dark:text-amber-400 text-2xl font-bold mt-4">
                  Payment Not Verified
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  It seems we couldn’t verify your payment. If any amount has
                  been deducted, it will be refunded to your account in 2–3
                  business days.
                </p>
              </div>
            )}
            {
              (status === "PENDING" || status === "NOT_ATTEMPTED") && (
                <div>
                  <Lottie
                    animationData={pendingAnimation}
                    className="h-24 mx-auto"
                  />
                  <h2 className="text-amber-600 dark:text-amber-400 text-2xl font-bold mt-4">
                    Payment Pending or Not Attempted
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Your payment is pending. Please wait for a few minutes.
                  </p>
                </div>
              )
            }
            {(status === "USER_DROPPED" || status === "CANCELLED"
              || status === "VOID") && (
                <div>
                  <Lottie
                    animationData={droppedAnimation}
                    className="h-24 mx-auto"
                  />
                  <h2 className="text-yellow-600 dark:text-yellow-400 text-2xl font-bold mt-4">
                    Payment Incomplete
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    You abandoned the payment. Try again.
                  </p>
                </div>
              )}
            {(status === "ERROR" || status === "UNKNOWN") && (
              <div>
                <Lottie
                  animationData={errorAnimation}
                  className="h-24 mx-auto"
                />
                <h2 className="text-gray-700 dark:text-gray-300 text-2xl font-bold mt-4">
                  Error
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  We couldn’t retrieve your payment status.
                </p>
              </div>
            )}
            <div className="flex justify-center gap-2 ">
              <Button
                className="mt-8 w-20 md:w-32 text-xs md:text-sm bg-cyan-500"
                onClick={() => navigate("/")}
              >
                Home
              </Button>
              <Button
                className="mt-8 w-20 md:w-32 text-xs md:text-sm bg-yellow-400"
                onClick={() => navigate("/tickets")}
              >
                My Tickets
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
