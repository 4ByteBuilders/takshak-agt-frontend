import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner"

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
  };

  return (
    <div className="flex flex-col md:flex-row items-center text-center h-full p-3">
      <div className="flex flex-col w-1/2 items-start ml-10 ">
        <p className="text-6xl font-black my-5">স্বাগতম!</p>
        <p className="text-4xl font-bold my-5">We are <span className="text-secondary">Takshak</span> Events</p>

        <p className="text-md font-normal my-5 w-3/4 text-left">
          Let your event journey begin with the festive vibe of Agartala! Explore the best events around Agartala with the best deals!
        </p>
        <div className="border-b-2 border-gray-300" />
        <button
          onClick={handleGoogleLogin}
          className="mt-4 px-4 py-2 bg-primary text-neutral-900 font-semibold rounded-md"
        >
          Sign in with Google
        </button>
      </div>
      <div className="md:w-1/2 p-4">
        <img src="/LoginLogo.png" alt="Login Logo" className="w-full h-auto" />
      </div>
    </div>
  );
};

export default Login;
