import { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="bg-zinc-100 h-screen flex flex-col justify-center items-center w-full ">
      <div className="bg-white border-2 p-14 rounded-md">{children}</div>
    </div>
  );
};

export default AuthLayout;
