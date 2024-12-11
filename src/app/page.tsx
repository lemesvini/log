"use client";

import { FaGoogle } from "react-icons/fa6";
import { auth, provider } from "../app/firebase";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const user = auth.currentUser;
  const handleGoogleLogin = async () => { 
    try {
      const result = await signInWithPopup(auth, provider); // Await the result of signInWithPopup
      // You can access the logged-in user information here
      router.push('/dashboard')
      console.log(user);
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  return (
    <div className="bg-[#0D1117] flex h-[100dvh] w-full justify-center items-center font-mono">
      <div className="flex w-[90%] max-w-[300px] h-[70%] max-h-[300px] bg-black border border-green-600 flex-col items-center justify-evenly">
        <span className="text-green-600">
          welcome to{" "}
          <span className="text-green-600 font-black text-2xl">{"<Log />"}</span>
        </span>

        <button
          onClick={handleGoogleLogin}
          className="bg-green-600 text-white p-2 h-12 rounded-3xl font-bold flex flex-row items-center hover:bg-white hover:text-green-600"
        >
          <FaGoogle className="h-full w-full p-1" />
        </button>
      </div>
    </div>
  );
}
