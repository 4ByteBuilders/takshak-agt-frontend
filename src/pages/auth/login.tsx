import { supabase } from "@/supabaseClient";


const Login = () => {

  const handleGoogleLogin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log('User already logged in');
      console.log(user);
    } else {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });
      if (error) console.error('Error logging in with Google:', error.message);

    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
  }

  return (
    <div className="flex items-center justify-center text-center h-full p-3">
      <div>
        <p className="text-4xl font-bold mb-2">
          স্বাগতম!
        </p>
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
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Login