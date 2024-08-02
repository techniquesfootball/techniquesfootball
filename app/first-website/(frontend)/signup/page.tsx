"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/auth-actions";

const SignUpPage = () => {
  const [role, setRole] = React.useState("");

  return (
    <>
      <div className="flex items-center w-full">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action="">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullname">Fullname</Label>
                  <Input name="fullname" id="fullname" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input name="email" id="email" type="email" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input name="password" id="password" type="password" />
                </div>
                <div className="grid gap-2 w-full">
                  <Label htmlFor="password">Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="player">Player</SelectItem>
                        <SelectItem value="coach">Coach</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <Button formAction={signup} type="submit" className="w-full">
                  Create an account
                </Button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/first-website/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SignUpPage;
