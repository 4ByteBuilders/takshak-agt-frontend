import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner"

const Login = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const checkUser = async () => {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();
  //     if (user) {
  //       navigate("/");
  //     }
  //   };
  //   checkUser();
  // }, [navigate]);

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // redirectTo: `${window.location.origin}/`,
      },
    });
    console.log(data);
    if (error) toast.error(error.message);
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
        <div className=""></div>
      </div>
    </div>
  );
};

export default Login;
