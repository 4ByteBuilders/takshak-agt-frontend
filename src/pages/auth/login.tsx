import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        console.log("User already logged in");
        navigate("/"); // Redirect to home page if user is already logged in
      }
    };
    checkUser();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error("Error logging in with Google:", error.message);
    else {
      console.log(data);
      navigate("/"); // Redirect to home page after successful login
    }
  };

  return (
    <div className="flex items-center justify-center text-center h-full p-3">
      <div>
        <p className="text-4xl font-bold mb-2">স্বাগতম!</p>
        <p className="text-md font-thin">
          Let your event journey begin with the festive vibe of Agartala
        </p>
        <div className="mt-2 border" />
        <button
          onClick={handleGoogleLogin}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
