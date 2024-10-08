"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/lib/auth-actions";
import { Skeleton } from "@/components/ui/skeleton";

const LoginButton = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };
    fetchUser();
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signout();
    setUser(null);
    setIsLoggingOut(false);
  };

  if (isLoading) {
    return <Skeleton className="h-12 w-22 rounded-sm" />;
  }

  if (user) {
    return (
      <>
        <Button
          onClick={handleLogout}
          disabled={isLoggingOut}
          size="sm"
          className="text-xs"
        >
          {isLoggingOut ? "Logging out..." : "Log out"}
        </Button>
      </>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-xs"
      onClick={() => {
        router.push("/first-website/login");
      }}
    >
      Login
    </Button>
  );
};

export default LoginButton;
