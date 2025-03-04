import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        navigate("/");
      }
    };
    checkUser();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) toast.error(error.message);
    else {
      toast("Logged in successfully!");
    }
  };

  return (
    <div
      className="grid md:grid-cols-2 sm:grid-cols-1 items-center text-center h-full p-3 pt-20"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0)), url('/Loginbgimg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "right",
      }}
    >
      <div className="flex flex-col w-full md:items-start items-center md:ml-20 pb-14 md:pb-8 px-4 md:px-0">
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
      </div>
    </div>
  );
};

export default Login;
