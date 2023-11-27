import SignUpForm from "@/components/form/SignUPForm";

const page = () => {
  return (
    <div className="w-full">
      <h1 className="flex text-2xl justify-center mb-1 font-semibold">
        Sign up to CineSphere
      </h1>
      <SignUpForm />
    </div>
  );
};

export default page;
