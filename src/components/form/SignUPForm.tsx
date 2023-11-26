"use client";
import { auth, db } from "@/lib/firebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
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
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

const FormSchema = z
  .object({
    username: z.string().min(1, "Username is required").max(30),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have more than 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  });

const SignUpForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      // Add the user to Firestore
      const user = userCredential.user;
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        displayName: values.username || "",
        email: user.email || "",
        // Add any other user details you want to store
      });

      // Reset the form after successful signup
      form.reset({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      console.log("User added to Firestore and signed up successfully");

      // Redirect to the home page
      router.push("/"); // Adjust the path as per your route settings
    } catch (error) {
      // If there was a problem during signup, like the email already being used, it shows up here.
      console.error("Error signing up:", error);
    }
  };

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel>Username</FormLabel>
                <FormControl className="focus-visible:ring-offset-0  focus-visible:ring-1 hover:ring-1 focus-visible:ring-blue-500">
                  <Input placeholder="" {...field} />
                </FormControl>

                <FormMessage className="text-xs flex justify-start" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl className="focus-visible:ring-offset-0  focus-visible:ring-1 hover:ring-1 focus-visible:ring-blue-500">
                  <Input placeholder="" {...field} />
                </FormControl>

                <FormMessage className="text-xs flex justify-start" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl className="focus-visible:ring-offset-0  focus-visible:ring-1 hover:ring-1 focus-visible:ring-blue-500">
                  <Input placeholder="" type="password" {...field} />
                </FormControl>

                <FormMessage className="text-xs flex justify-start" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Re-enter your password</FormLabel>
                <FormControl className="focus-visible:ring-offset-0  focus-visible:ring-1 hover:ring-1 focus-visible:ring-blue-500 ">
                  <Input placeholder="" type="password" {...field} />
                </FormControl>

                <FormMessage className="text-xs flex justify-start" />
              </FormItem>
            )}
          />
        </div>

        <Button className="w-full mt-6 rounded-full" type="submit">
          Sign up
        </Button>
        <p className="mt-4 w-full text-sm text-center">
          Already have an account?{" "}
          <Link className="text-blue-500 hover:underline" href="/sign-in">
            Sign in
          </Link>
        </p>
      </form>
      <div className="mt-6 relative flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-1 text-sm text-gray-600 bg-white px-2">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <Button
        className="w-full mt-6 rounded-full  hover:border-gray-300 hover:shadow-sm"
        type="button"
        onClick={handleGoogleSignIn}
        variant="outline"
      >
        <img src="/google.png" alt="Google" className="mr-2 w-4 h-4" />
        Sign up with Google
      </Button>
      <Button
        className="w-full mt-4 rounded-full  hover:border-gray-300 hover:shadow-sm"
        type="button"
        onClick={handleFacebookSignIn}
        variant="outline"
      >
        <img src="/facebook.png" alt="Facebook" className="mr-2 w-4 h-4" />
        Sign up with Facebook
      </Button>
    </Form>
  );
};

export default SignUpForm;
