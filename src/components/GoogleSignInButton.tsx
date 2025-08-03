import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";

export default function GoogleSignInButton() {
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign-In Error:", error);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
    >
      Sign in with Google
    </button>
  );
}
