"use client";

import Link from "next/link";
import { buttonVariants } from "./ui/button";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import firebase from "firebase/compat/app";

function Navbar() {
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // Manually cast authUser to firebase.User to avoid TypeScript errors
        setUser(authUser as firebase.User);
      } else {
        setUser(null);
      }
    });

    // Clean up the observer when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0">
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex text-2xl ">
          <div className="mx-2 ">CineSphere</div>
        </Link>
        {user ? (
          <div className="flex items-center">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt={
                  user.displayName
                    ? `${user.displayName}'s profile photo`
                    : "User profile photo"
                }
                className="w-10 h-10 rounded-full mr-2"
              />
            )}
            <p>{user.email}</p>
          </div>
        ) : (
          <Link className={buttonVariants()} href="/sign-in">
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
