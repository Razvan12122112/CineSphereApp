"use client";
import "@/styles/globals.css";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";

import { auth, db } from "@/lib/firebaseConfig";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";
import GoogleSignInButton from "../GoogleSignInButton";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have more than 8 characters"),
});

const SignInForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const handleGoogleSignIn = () => {
    const googleProvider = new GoogleAuthProvider();
    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        const user = result.user;

        // Check if the user exists in Firestore
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          // User does not exist, add them to Firestore
          await addDoc(usersRef, {
            uid: user.uid,
            displayName: user.displayName || "",
            email: user.email || "",
            photoURL: user.photoURL || "",
          });

          console.log("User added to Firestore");
        } else {
          console.log("User already exists in Firestore");
        }
        router.push("/");
      })

      .catch((error) => {
        console.error("Error during Google Sign-In:", error);
      });
  };

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user exists in Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // User does not exist, add them to Firestore
        await addDoc(usersRef, {
          uid: user.uid,
          displayName: user.displayName || "",
          email: user.email || "",
          photoURL: user.photoURL || "",
        });

        console.log("User added to Firestore");
      } else {
        console.log("User already exists in Firestore");
      }
      router.push("/");
    } catch (error) {
      console.error("Error during Facebook Sign-In:", error);
    }
  };

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        router.push("/");
      })
      .catch((error) => {
        // If there was a problem, like the email is already used, it shows up here.
        console.error("Error signing in:", error);
      });
  };

  return (
    <div>
      <Button
        className="w-full mt-6 rounded-full  hover:border-gray-300 hover:shadow-sm"
        type="button"
        onClick={handleGoogleSignIn}
        variant="outline"
      >
        <img src="/google.png" alt="Google" className="mr-2 w-4 h-4" />
        Sign in with Google
      </Button>
      <Button
        className="w-full mt-4 rounded-full  hover:border-gray-300 hover:shadow-sm"
        type="button"
        onClick={handleFacebookSignIn}
        variant="outline"
      >
        <img src="/facebook.png" alt="Facebook" className="mr-2 w-4 h-4" />
        Sign in with Facebook
      </Button>

      <div className="mt-6 relative flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-1 text-sm text-gray-600 bg-white px-2">
          or sign in with email
        </span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-2 mt-4 mx-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl className="focus-visible:ring-offset-0  focus-visible:ring-1 hover:ring-1 focus-visible:ring-blue-500">
                    <Input placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Password</FormLabel>
                  <FormControl className="focus-visible:ring-offset-0  focus-visible:ring-1 hover:ring-1 focus-visible:ring-blue-500">
                    <Input placeholder="" type="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="custom-button" type="submit">
            Sign in
          </Button>
        </form>
        <div>
          <p className="mt-4 w-full text-sm text-center">
            Don't have an account?{" "}
            <Link className="text-blue-500 hover:underline" href="/sign-up">
              Sign up
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default SignInForm;
