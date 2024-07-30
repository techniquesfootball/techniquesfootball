"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "@/components/ui/loader";

const LogoutPage = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => router.push("/first-website"), 2000);
  });
  return (
    <div>
      <div className="App">
        <Loader />
      </div>
    </div>
  );
};

export default LogoutPage;
