import { auth } from "@/lib/firebaseConfig";
import { signOut } from "firebase/auth";

export const handleSignOut = () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out successfully");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
};
