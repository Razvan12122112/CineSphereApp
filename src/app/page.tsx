"use client";

import { handleSignOut } from "@/components/form/authUtils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl">CineSphere</h1>
      <Button className="w-full mt-6" type="button" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  );
}
