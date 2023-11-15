"use client";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from "firebase/auth";

import { auth } from "@/lib/firebaseConfig";
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

  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);

        // Check if credential is not null before accessing accessToken
        if (credential) {
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // Use the token and user info as needed
        } else {
          console.error("No credential available from the result");
        }
      })
      .catch((error) => {
        // Handle Errors here.
        console.error("Error during Google Sign-In:", error);
        // Additional error handling
      });
  };

  const handleFacebookSignIn = () => {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        if (credential) {
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // Use the token and user info as needed
        } else {
          console.error("No credential available from the result");
        }

        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        console.error("Error during Facebook Sign-In:", error);
        // Additional error handling
      });
  };

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
      })
      .catch((error) => {
        // If there was a problem, like the email is already used, it shows up here.
        console.error("Error signing in:", error);
      });
  };

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        alert("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="mail@example.com" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="w-full mt-6" type="submit">
            Sign in
          </Button>
        </form>
        <div>
          <p className="mt-1 w-full">
            If you don't have an account please{" "}
            <Link className="text-blue-500 hover:underline" href="/sign-up">
              Sign up
            </Link>
          </p>
          <div onClick={handleGoogleSignIn}>
            <GoogleSignInButton>Sign in with Google</GoogleSignInButton>
          </div>
        </div>
      </Form>
      <Button
        className="w-full mt-6"
        type="button"
        onClick={handleFacebookSignIn}
      >
        Facebook login
      </Button>

      <Button className="w-full mt-6" type="button" onClick={userSignOut}>
        Sign out
      </Button>
    </div>
  );
};

export default SignInForm;

function makeRequest(submit: string) {
  throw new Error("Function not implemented.");
}
