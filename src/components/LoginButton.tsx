"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebaseClient";

export default function LoginButton() {
  console.log("LoginButton rendered");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleClick = useCallback(async () => {
    try {
      setLoading(true);
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("LoginButton handleClick", result);
      const uid = result.user?.uid;
      console.log("LoginButton handleClick", result.user);
      if (uid) {
        localStorage.setItem("uid", uid);
      }
      if (result.user?.displayName) {
        localStorage.setItem("displayName", result.user.displayName);
      }
      if (result.user?.email) {
        localStorage.setItem("email", result.user.email);
      }
      if (result.user?.photoURL) {
        localStorage.setItem("photoURL", result.user.photoURL);
      }
      router.push("/home");
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  return (
    <button
      className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? "Signing in…" : "Login"}
    </button>
  );
}


