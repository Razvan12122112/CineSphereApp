import SignInForm from "@/components/form/SignInForm";

const page = () => {
  return (
    <div className=" w-full">
      <h1 className="flex text-2xl justify-center mb-1 font-semibold">
        Sign in to CineSphere
      </h1>
      <SignInForm />
    </div>
  );
};

export default page;
