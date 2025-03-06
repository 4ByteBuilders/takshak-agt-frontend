import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getWithExpiry, removeLocalData } from "@/utils/fetchLocalStorage";
import Loader from "@/components/Loader/Loader";
import { motion } from "framer-motion";

const Login = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking user:", error);
        toast.error("Failed to check user. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    const redirectUrl = getWithExpiry("redirectAfterLogin") || "";
    removeLocalData("redirectAfterLogin");
    const redirectTo = `${window.location.origin}${redirectUrl}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });
    if (error) toast.error(error.message);
  };

  if (loading) return <Loader />;
  return (
    <div
      className="relative grid md:grid-cols-2 sm:grid-cols-1 items-center text-center min-h-screen p-3 pt-20"
      style={{
        backgroundImage: "url('/Loginbgimg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "bottom",
      }}
    >
      <div
        className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"
        style={{
          zIndex: 1,
        }}
      ></div>
      <div
        className="block md:hidden absolute inset-0 bg-black/70 via-black/60 to-transparent"
        style={{
          zIndex: 1,
        }}
      ></div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="flex flex-col w-full md:items-start items-center md:ml-20 pb-14 md:pb-8 px-4 md:px-0"
        style={{
          zIndex: 2,
        }}
      >
        <p className="text-4xl md:text-6xl font-black my-5">স্বাগতম!</p>
        <p className="text-2xl md:text-4xl font-bold my-5 drop-shadow-lg text-left">
          We are <span className="text-amber-400">Takshak</span> Events
        </p>

        <p className="text-md md:text-md font-medium my-5 w-full md:w-4/5 md:text-left text-center text-muted-foreground">
          Let your event journey begin with the festive vibe of Agartala!
          Explore the best events around Agartala with the best deals!
        </p>
        <button
          onClick={handleGoogleLogin}
          className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 transition-all text-white font-semibold rounded-md"
        >
          Sign in with Google
        </button>
      </motion.div>
    </div>
  );
};

export default Login;
